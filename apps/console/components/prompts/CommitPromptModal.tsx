import { useMutation } from "@tanstack/react-query";
import { Modal, Form, Input, Button, Alert, FormInstance } from "antd";
import { gqlClient, queryClient } from "../../lib/graphql";
import { css } from "@emotion/css";
import { useState } from "react";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { CREATE_PROMPT_VERSION } from "../../graphql/mutations/prompts";
import { PromptEditFormInputs } from "../../lib/hooks/usePromptEdit";
import { CreatePromptVersionInput, PromptModes } from "@pezzo/graphql";

interface Props {
  open: boolean;
  onClose: () => void;
  onCommitted: (id: string) => void;
  form: FormInstance<PromptEditFormInputs>;
}

type Inputs = {
  message: string;
};

export const CommitPromptModal = ({
  open,
  onClose,
  onCommitted,
  form: editPromptForm,
}: Props) => {
  const { prompt } = useCurrentPrompt();
  const [form] = Form.useForm<Inputs>();
  const [error, setError] = useState<string | null>(null);

  const createPromptVersionMutation = useMutation({
    mutationFn: (data: CreatePromptVersionInput) => {
      return gqlClient.request(CREATE_PROMPT_VERSION, {
        data: {
          message: data.message,
          content: data.content,
          settings: data.settings,
          mode: data.mode,
          promptId: data.promptId,
        },
      });
    },
    onSuccess: () => {
      form.resetFields();
      queryClient.invalidateQueries(["prompt", prompt.id]);
      onClose();
    },
  });

  const handleFormFinish = async (values) => {
    setError(null);
    const editPromptValues = editPromptForm.getFieldsValue(true);

    createPromptVersionMutation.mutate({
      message: form.getFieldValue("message"),
      content: editPromptValues.content,
      settings: editPromptValues.settings,
      mode: PromptModes.Chat,
      promptId: prompt.id,
    });

    form.resetFields();
  };

  return (
    <Modal
      title={`Commit Prompt - ${prompt.name}`}
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
