import { useMutation } from "@tanstack/react-query";
import { Modal, Form, Input, Button, Alert } from "antd";
import { gqlClient, queryClient } from "../../lib/graphql";
import { css } from "@emotion/css";
import { slugify } from "../../lib/utils/string-utils";
import { useState } from "react";
import { CREATE_ENVIRONMENT } from "../../graphql/mutations/environments";

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
  const [form] = Form.useForm<Inputs>();
  const [error, setError] = useState<string | null>(null);

  const createEnvironmentMutation = useMutation({
    mutationFn: (data: Inputs) =>
      gqlClient.request(CREATE_ENVIRONMENT, {
        data: {
          slug: data.slug,
          name: data.name,
        },
      }),
    onSuccess: (data) => {
      onCreated(data.createEnvironment.name);
      queryClient.invalidateQueries({ queryKey: ["environments"] });
    },
    onError: async ({ response }) => {
      const error = await response.errors[0].message;
      setError(error);
    },
  });

  const handleFormFinish = async (values) => {
    setError(null);
    createEnvironmentMutation.mutate(values);
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
      {error && <Alert type="error" message={error} />}
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
