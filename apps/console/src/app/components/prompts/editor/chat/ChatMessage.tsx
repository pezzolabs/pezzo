import { Button, Card, Form, Select } from "antd";
import { PromptEditFormInputs } from "../../../../lib/hooks/usePromptVersionEditor";
import { DeleteOutlined, SwapOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { colors } from "../../../../lib/theme/colors";
import styled from "@emotion/styled";

const StyledTextArea = styled(TextArea)`
  resize: none !important;
  border: none;
  background: transparent;
  outline: none;
  color: ${colors.neutral["200"]};

  ::placeholder {
    color: ${colors.neutral["500"]};
  }
`;

interface Props {
  id: string;
  canDelete?: boolean;
  onDelete: () => void;
}

export const ChatMessage = ({ id, canDelete = true, onDelete }: Props) => {
  return (
    <Card
      style={{ marginBottom: 12 }}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>
            <SwapOutlined style={{ color: colors.neutral["500"] }} />
            <Form.Item
              name={["messages", id, "role"]}
              initialValue={"user"}
              style={{
                width: 200,
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
                suffixIcon={null}
                bordered={false}
              />
            </Form.Item>
          </div>
          {canDelete && <Button icon={<DeleteOutlined />} onClick={onDelete} />}
        </div>
      }
    >
      <Form.Item
        name={["messages", id, "content"]}
        rules={[{ required: true, message: "Message content is required" }]}
      >
        <StyledTextArea
          placeholder="Start typing your prompt here..."
          rows={5}
          bordered={false}
          color="#fff"
        />
      </Form.Item>
    </Card>
  );
};
