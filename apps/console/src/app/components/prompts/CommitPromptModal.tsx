import { Modal, Form, Input, Button, Alert } from "antd";
import { css } from "@emotion/css";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { usePromptVersionEditorContext } from "../../lib/providers/PromptVersionEditorContext";
import { useCreatePromptVersion } from "../../graphql/hooks/mutations";

interface Props {
  open: boolean;
  onClose: () => void;
  onCommitted: () => void;
}

type Inputs = {
  message: string;
};

export const CommitPromptModal = ({ open, onClose, onCommitted }: Props) => {
  const [form] = Form.useForm<Inputs>();
  const { prompt } = useCurrentPrompt();
  const { formValues } = usePromptVersionEditorContext();

  const { mutateAsync: createPromptVersion, error } = useCreatePromptVersion();

  const handleFormFinish = async (values: Inputs) => {
    const { settings, content } = formValues;

    const data = {
      message: values.message,
      content,
      settings: settings || {},
      promptId: prompt.id,
    };

    await createPromptVersion(data);
    form.resetFields();
    onCommitted();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`Commit Prompt - ${prompt.name}`}
      open={open}
      onCancel={handleCancel}
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
          label="Commit message"
          name="message"
          fieldId="message"
          rules={[{ required: true, message: "Commit message is required" }]}
        >
          <Input placeholder="e.g. Implement better instructions" />
        </Form.Item>

        <Form.Item
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button type="primary" htmlType="submit">
            Commit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
