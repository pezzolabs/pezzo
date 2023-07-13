import { useMutation } from "@tanstack/react-query";
import { Modal, Form, Input, Button, Alert, Radio } from "antd";
import { CREATE_PROMPT } from "../../graphql/definitions/mutations/prompts";
import { gqlClient, queryClient } from "../../lib/graphql";
import { css } from "@emotion/css";
import {
  CreatePromptMutation,
  PromptType,
} from "../../../@generated/graphql/graphql";
import { GraphQLErrorResponse } from "../../graphql/types";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

type Inputs = {
  name: string;
  type: PromptType;
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
          type: data.type,
          name: data.name,
          projectId: project.id,
          type: PromptType.Chat
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
        initialValues={{
          type: PromptType.Prompt,
        }}
        style={{ maxWidth: 600, marginTop: 20 }}
        onFinish={handleFormFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Prompt name"
          name="name"
          rules={[{ required: true, message: "Prompt name is required" }]}
        >
          <Input placeholder="e.g. RecommendProduct" />
        </Form.Item>

        <Form.Item required label="Type" name="type">
          <Radio.Group>
            <Radio.Button value={PromptType.Prompt}>Prompt</Radio.Button>
            <Radio.Button value={PromptType.Chat}>Chat</Radio.Button>
          </Radio.Group>
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
