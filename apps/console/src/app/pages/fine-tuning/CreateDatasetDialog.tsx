import { Alert, Button, Form, Input, Modal } from "antd";
import { useCreateDatasetMutation } from "../../graphql/hooks/mutations";
import { css } from "@emotion/css";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

type Inputs = {
  name: string;
};

export const CreateDatasetDialog = ({
  open,
  onClose,
  onCreated,
}: Props) => {
  const [form] = Form.useForm<Inputs>();

  const {
    mutate: createDataset,
    error,
  } = useCreateDatasetMutation({
    onSuccess: () => {
      onCreated();
    }
  });

  const handleFormFinish = async (values: Inputs) => {
    createDataset({
      name: values.name,
    });
    form.resetFields();
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="New Dataset"
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
          label="Dataset name"
          name="name"
          fieldId="name"
          rules={[{ required: true, message: "Dataset name is required" }]}
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
