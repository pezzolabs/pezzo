import { Button, Card, Form, Select } from "antd";
import { CloseOutlined, SwapOutlined } from "@ant-design/icons";
import { colors } from "../../../../lib/theme/colors";
import { PromptEditorTextArea } from "../../../common/PromptEditorTextArea";
import styled from "@emotion/styled";
import { useCurrentPrompt } from "../../../../lib/providers/CurrentPromptContext";
import { trackEvent } from "../../../../lib/utils/analytics";

interface Props {
  index: number;
  canDelete?: boolean;
  onDelete: () => void;
}

const StyledCard = styled(Card)`
  .ant-card-head {
    padding: 10px 20px;
  }

  .ant-card-body {
    padding: 16px 20px 10px 20px;
  }
`;

export const ChatMessage = ({ index, canDelete = true, onDelete }: Props) => {
  const { promptId } = useCurrentPrompt();

  return (
    <StyledCard
      style={{ marginBottom: 12, padding: 0 }}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <SwapOutlined style={{ color: colors.neutral[400] }} />
            <Form.Item name={[index, "role"]} noStyle>
              <Select
                bordered={false}
                suffixIcon={null}
                style={{ width: 200 }}
                onChange={(role) => {
                  trackEvent("prompt_chat_completion_message_role_changed", {
                    promptId,
                    role,
                  });
                }}
                options={[
                  {
                    label: "System",
                    value: "system",
                  },
                  {
                    label: "User",
                    value: "user",
                  },
                  {
                    label: "Assistant",
                    value: "assistant",
                  },
                ]}
              />
            </Form.Item>
          </div>
          {canDelete && (
            <Button
              style={{ opacity: 0.5 }}
              type="text"
              icon={<CloseOutlined />}
              onClick={onDelete}
            />
          )}
        </div>
      }
    >
      <Form.Item
        name={[index, "content"]}
        rules={[{ required: true, message: "Message content is required" }]}
      >
        <PromptEditorTextArea
          placeholder="Start typing your message here..."
          autoSize={{ minRows: 4, maxRows: 20 }}
          bordered={false}
          color="#fff"
          style={{ padding: 0 }}
        />
      </Form.Item>
    </StyledCard>
  );
};
