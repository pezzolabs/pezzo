import { Button, Card, Col, Form, FormInstance, Row, Input } from "antd";
import { PromptEditFormInputs } from "../../lib/hooks/usePromptEdit";
import { DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface Props {
  functions: any[];
  onNewMessage: () => void;
  form: FormInstance<PromptEditFormInputs>;
  onDeleteMessage: (ix: number) => void;
  onChange?: (value: string) => void;
}

export const FunctionsEditor = ({
  form,
  onDeleteMessage,
  onNewMessage,
  functions,
}: Props) => {
  const settings = form.getFieldValue("settings");

  return (
    <Row>
      <Col span={24}>
        {functions.map((_, index) => (
          <Card
            style={{ marginBottom: 12 }}
            key={index}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Item
                  name={["settings", "functions", index, "name"]}
                  rules={[
                    { required: true, message: "Function name is required" },
                  ]}
                  initialValue={
                    settings.functions[index]?.name || `untitled_function`
                  }
                  style={{
                    width: index > 0 ? "95%" : "100%",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <Input bordered={false} />
                </Form.Item>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => onDeleteMessage(index)}
                />
              </div>
            }
          >
            <Form.Item
              key={index}
              rules={[
                { required: true, message: "Function description is required" },
              ]}
              name={["settings", "functions", index, "description"]}
            >
              <TextArea
                styles={{
                  textarea: {
                    color: "#fff",
                  },
                }}
                placeholder="Start typing your description here..."
                style={{
                  resize: "none",
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  color: "#fff",
                }}
                rows={3}
                bordered={false}
                color="#fff"
              />
            </Form.Item>
          </Card>
        ))}
      </Col>
      <Button onClick={onNewMessage}>+ New Function</Button>
    </Row>
  );
};
