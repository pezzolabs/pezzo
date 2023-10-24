import { useEffect } from "react";
import { Card, Form } from "antd";
import { PromptEditorTextArea } from "~/components/common/PromptEditorTextArea";
import { usePromptVersionEditorContext } from "~/lib/providers/PromptVersionEditorContext";
import { findVariables } from "~/lib/utils/find-variables";

export const PromptEditMode = () => {
  const { form, setVariables } = usePromptVersionEditorContext();
  const value = Form.useWatch(["content", "prompt"], { form });

  useEffect(() => {
    if (value) {
      const variables = findVariables(value);
      setVariables(variables);
    }
  }, [value, setVariables]);

  return (
    <Card>
      <Form.Item
        name={["content", "prompt"]}
        rules={[{ required: true, message: "Prompt content is required" }]}
      >
        <PromptEditorTextArea
          placeholder="Type your prompt here"
          rows={12}
          bordered={false}
          color="#fff"
        />
      </Form.Item>
    </Card>
  );
};
