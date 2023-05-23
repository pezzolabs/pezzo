import { useMutation } from "@tanstack/react-query";
import { Modal, Form, Input, Button, Alert } from "antd";
import { gqlClient, queryClient } from "../../lib/graphql";
import { css } from "@emotion/css";
import { slugify } from "../../lib/utils/string-utils";
import { CREATE_ENVIRONMENT } from "../../graphql/mutations/environments";
import { CreateEnvironmentMutation } from "@pezzo/graphql";
import { GraphQLErrorResponse } from "../../graphql/types";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

type Inputs = {
  name: string;
  slug: string;
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
          slug: data.slug,
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
  };

  const handleFormValuesChange = () => {
    const { name } = form.getFieldsValue();
    const slug = slugify(name);
    form.setFieldsValue({ slug });
  };

  return (
    <Modal
      title="New Environment"
      open={open}
      onCancel={onClose}
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
        onValuesChange={handleFormValuesChange}
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
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Slug is required" }]}
        >
          <Input disabled placeholder="Type your environment name" />
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
