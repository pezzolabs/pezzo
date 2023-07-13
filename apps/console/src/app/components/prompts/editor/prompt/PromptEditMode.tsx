import { Card, Form } from "antd";
import { PromptEditorTextArea } from "../../../common/PromptEditorTextArea";

export const PromptEditMode = () => {
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
