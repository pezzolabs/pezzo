import { Alert, Button, Form, Input, Modal } from "antd";
import { useCreateFineTunedModelMutation } from "../../graphql/hooks/mutations";
import { css } from "@emotion/css";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

type Inputs = {
  name: string;
};

export const CreateFineTunedModelDialog = ({
  open,
  onClose,
  onCreated,
}: Props) => {
  const [form] = Form.useForm<Inputs>();

  const {
    mutate: createFineTunedModel,
    error,
    isLoading,
  } = useCreateFineTunedModelMutation({
    onSuccess: () => {
      onCreated();
    },
  });

  const handleFormFinish = async (values: Inputs) => {
    createFineTunedModel({
      name: values.name,
    });
    form.resetFields();
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="New Fine Tuned Model"
      open={open}
      onCancel={onCancel}
      footer={false}
    >
      {isLoading && <Alert type="info" message="Creating model..." />}
      <>
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
            label="Model name"
            name="name"
            fieldId="name"
            rules={[{ required: true, message: "Model name is required" }]}
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
      </>
    </Modal>
  );
};
