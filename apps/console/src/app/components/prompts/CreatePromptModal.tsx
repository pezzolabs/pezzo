import { useMutation } from "@tanstack/react-query";
import { Modal, Form, Input, Button, Alert } from "antd";
import { CREATE_PROMPT } from "../../graphql/mutations/prompts";
import { gqlClient, queryClient } from "../../lib/graphql";
import { css } from "@emotion/css";
import { PromptIntegrationSelector } from "./PromptIntegrationSelector";
import { integrations } from "@pezzo/integrations";
import { CreatePromptMutation } from "@pezzo/graphql";
import { GraphQLErrorResponse } from "../../graphql/types";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";

const integrationsArray = Object.values(integrations);

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

type Inputs = {
  name: string;
  integrationId: string;
};

export const CreatePromptModal = ({ open, onClose, onCreated }: Props) => {
  const { project } = useCurrentProject();
  const [form] = Form.useForm<Inputs>();

  const { mutate, error } = useMutation<
    CreatePromptMutation,
    GraphQLErrorResponse,
    Inputs
  >({
    mutationFn: (data: Inputs) =>
      gqlClient.request(CREATE_PROMPT, {
        data: {
          name: data.name,
          integrationId: data.integrationId,
          projectId: project.id,
        },
      }),
    onSuccess: (data) => {
      onCreated(data.createPrompt.id);
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });

  const handleFormFinish = (data: Inputs) => {
    mutate(data);
    form.resetFields();
  };

  return (
    <Modal title="New Prompt" open={open} onCancel={onClose} footer={false}>
      {error && (
        <Alert type="error" message={error.response.errors[0].message} />
      )}
      <Form
        form={form}
        layout="vertical"
        name="basic"
        style={{ maxWidth: 600, marginTop: 20 }}
        initialValues={{ integrationId: integrationsArray[0].id }}
        onFinish={handleFormFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Integration"
          name="integrationId"
          rules={[{ required: true, message: "Integration is required" }]}
        >
          <PromptIntegrationSelector
            onChange={(value) => form.setFieldValue("integration", value)}
          />
        </Form.Item>

        <Form.Item
          label="Prompt name"
          name="name"
          rules={[
            { required: true, message: "Prompt name is required" },
            {
              pattern: new RegExp("^(?:[A-Z][a-z0-9]*)+$"),
              message:
                "Prompt name must be pascal case (e.g. RecommendProduct)",
            },
          ]}
        >
          <Input placeholder="e.g. RecommendProduct" />
        </Form.Item>

        <Form.Item
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
