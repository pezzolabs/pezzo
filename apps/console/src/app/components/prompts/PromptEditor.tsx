import {
  Button,
  Card,
  Col,
  Form,
  FormInstance,
  Row,
  Select,
  Input,
} from "antd";
import { PromptEditFormInputs } from "../../lib/hooks/usePromptVersionEditor";
import { DeleteOutlined, SwapOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface Props {
  value?: string;
  messages: { role: "user" | "assistant" }[];
  onNewMessage: () => void;
  form: FormInstance<PromptEditFormInputs>;
  onDeleteMessage: () => void;
  onChange?: (value: string) => void;
}

export const PromptEditor = ({
  form,
  onDeleteMessage,
  onNewMessage,
  messages,
}: Props) => {
  const settings = form.getFieldValue("settings");

  return (
    <Row>
      <Col span={24}>
        {messages.map((_, index) => (
          <Card
            style={{ marginBottom: 12 }}
            key={index}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Item
                  name={["settings", "messages", index, "role"]}
                  initialValue={
                    settings.messages[index]?.role == null ? "user" : undefined
                  }
                  style={{
                    width: index > 0 ? "95%" : "100%",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <Select
                    options={[
                      {
                        label: "User",
                        value: "user",
                      },
                      {
                        label: "Assistant",
                        value: "assistant",
                      },
                    ]}
                    suffixIcon={<SwapOutlined />}
                    bordered={false}
                  />
                </Form.Item>
                {index > 0 && (
                  <Button icon={<DeleteOutlined />} onClick={onDeleteMessage} />
                )}
              </div>
            }
          >
            <Form.Item
              key={index}
              name={["settings", "messages", index, "content"]}
            >
              <TextArea
                styles={{
                  textarea: {
                    color: "#fff",
                  },
                }}
                placeholder="Start typing your prompt here..."
                style={{
                  resize: "none",
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  color: "#fff",
                }}
                rows={5}
                bordered={false}
                color="#fff"
              />
            </Form.Item>
          </Card>
        ))}
      </Col>
      <Button
        onClick={onNewMessage}
        disabled={!settings.messages[messages.length - 1]?.content?.length}
      >
        + New Message
      </Button>
    </Row>
  );
};
