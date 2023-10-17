import { Button, Card, Form, Select } from "antd";
import { CloseOutlined, SwapOutlined, HolderOutlined } from "@ant-design/icons";
import { colors } from "../../../../lib/theme/colors";
import { PromptEditorTextArea } from "../../../common/PromptEditorTextArea";
import styled from "@emotion/styled";
import { useCurrentPrompt } from "../../../../lib/providers/CurrentPromptContext";
import { trackEvent } from "../../../../lib/utils/analytics";
import { useDrag, useDrop } from "react-dnd";

interface Props {
  index: number;
  canDelete?: boolean;
  onDelete: () => void;
  isOver: boolean;
}

const StyledCard = styled(Card)`
  .ant-card-head {
    padding: 10px 20px;
  }

  .ant-card-body {
    padding: 16px 20px 10px 20px;
  }
`;
interface DraggableChatMessageProps extends Props {
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

export const ChatMessage: React.FC<DraggableChatMessageProps> = ({
  index,
  canDelete = true,
  onDelete,
  onMove,
  isOver,
}: DraggableChatMessageProps) => {
  const { promptId } = useCurrentPrompt();

  const [{ opacity }, ref, preview] = useDrag({
    type: "CHAT_MESSAGE",
    item: { index },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  const [, drop] = useDrop({
    accept: "CHAT_MESSAGE",
    drop: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={preview} style={{ opacity }}>
      {isOver ? null : (
        <StyledCard
          style={{ marginBottom: 12, padding: 0 }}
          title={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div ref={(node) => ref(drop(node))} style={{ cursor: "move" }}>
                  <HolderOutlined
                    style={{ color: colors.neutral[400], marginRight: 10 }}
                  />
                </div>
                <SwapOutlined style={{ color: colors.neutral[400] }} />
                <Form.Item name={[index, "role"]} noStyle>
                  <Select
                    bordered={false}
                    suffixIcon={null}
                    style={{ width: 200 }}
                    onChange={(role) => {
                      trackEvent(
                        "prompt_chat_completion_message_role_changed",
                        {
                          promptId,
                          role,
                        }
                      );
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
      )}
    </div>
  );
};
