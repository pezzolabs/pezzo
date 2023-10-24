import { useMutation } from "@tanstack/react-query";
import { Modal, Form, Input, Button, Alert } from "antd";
import { gqlClient, queryClient } from "~/lib/graphql";
import { css } from "@emotion/css";
import { CREATE_ENVIRONMENT } from "~/graphql/definitions/mutations/environments";
import { CreateEnvironmentMutation } from "~/@generated/graphql/graphql";
import { GraphQLErrorResponse } from "~/graphql/types";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { trackEvent } from "~/lib/utils/analytics";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

type Inputs = {
  name: string;
};

export const CreateEnvironmentModal = ({ open, onClose, onCreated }: Props) => {
  const { project } = useCurrentProject();
  const [form] = Form.useForm<Inputs>();

  const { mutate, error } = useMutation<
    CreateEnvironmentMutation,
    GraphQLErrorResponse,
    Inputs
  >({
    mutationFn: (data: Inputs) =>
      gqlClient.request(CREATE_ENVIRONMENT, {
        data: {
          name: data.name,
          projectId: project.id,
        },
      }),
    onSuccess: (data) => {
      onCreated(data.createEnvironment.name);
      queryClient.invalidateQueries({ queryKey: ["environments"] });
    },
  });

  const handleFormFinish = async (values: Inputs) => {
    mutate(values);
    form.resetFields();
    trackEvent("environment_form_submitted");
  };

  const onCancel = () => {
    onClose();
    trackEvent("environment_form_cancelled");
  };

  return (
    <Modal
      title="New Environment"
      open={open}
      onCancel={onCancel}
      footer={false}
    >
      {error && (
        <Alert type="error" message={error.response.errors[0].message} />
      )}
      <Form
        form={form}
        layout="vertical"
        name="basic"
        style={{ maxWidth: 600, marginTop: 20 }}
        onFinish={handleFormFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Environment name"
          name="name"
          fieldId="name"
          rules={[{ required: true, message: "Environment name is required" }]}
        >
          <Input placeholder="e.g. Development" />
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
