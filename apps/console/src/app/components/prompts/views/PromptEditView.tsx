import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import {
  Button,
  Card,
  Col,
  Popover,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { CommitPromptModal } from "../CommitPromptModal";
import { PublishPromptModal } from "../PublishPromptModal";
import { useState } from "react";
import {
  CodeOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { PromptVersionSelector } from "../PromptVersionSelector";
import { PromptType } from "../../../../@generated/graphql/graphql";
import { ChatEditMode } from "../editor/chat/ChatEditMode";
import { PromptEditMode } from "../editor/prompt/PromptEditMode";
import { usePromptVersionEditorContext } from "../../../lib/providers/PromptVersionEditorContext";
import { CommitButton } from "../editor/CommitButton";
import { Variables } from "../editor/Variables";
import { ProviderSettingsCard } from "../editor/ProviderSettingsCard";
import { FunctionsFormModal } from "../FormModal";
import { InlineCodeSnippet } from "../../common/InlineCodeSnippet";
import { colors } from "../../../lib/theme/colors";
import { ConsumePromptModal } from "../ConsumePromptModal";
import { trackEvent } from "../../../lib/utils/analytics";

const FUNCTIONS_FEATURE_FLAG = true;

export const PromptEditView = () => {
  const { prompt, isLoading: isPromptLoading } = useCurrentPrompt();
  const { currentVersion, isPublishEnabled, isDraft } =
    usePromptVersionEditorContext();

  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isConsumePromptModalOpen, setIsConsumePromptModalOpen] =
    useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isFunctionsModalOpen, setIsFunctionsModalOpen] = useState(false);

  const onConsumeClick = () => {
    setIsConsumePromptModalOpen(true);
    trackEvent("how_to_consume_modal_open");
  };

  return (
    !isPromptLoading && (
      <>
        <div style={{ marginBottom: 14, border: 0 }}>
          <Row>
            <Col span={12}>{!isDraft && <PromptVersionSelector />}</Col>
            <Col
              span={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Space>
                {isPublishEnabled && (
                  <Button onClick={onConsumeClick} icon={<CodeOutlined />}>
                    How to Consume
                  </Button>
                )}
                {isPublishEnabled && (
                  <Button
                    onClick={() => setIsPublishModalOpen(true)}
                    icon={<PlayCircleOutlined />}
                    type="primary"
                  >
                    Publish
                  </Button>
                )}
                <CommitButton onClick={() => setIsCommitModalOpen(true)} />
              </Space>
            </Col>
          </Row>
        </div>

        <Row gutter={24}>
          <Col span={17}>
            {prompt.type === PromptType.Prompt ? (
              <PromptEditMode />
            ) : (
              <ChatEditMode />
            )}
          </Col>
          <Col span={7}>
            <Card title="Settings" style={{ marginBottom: 24 }}>
              <ProviderSettingsCard
                onOpenFunctionsModal={
                  FUNCTIONS_FEATURE_FLAG
                    ? () => setIsFunctionsModalOpen(true)
                    : null
                }
              />
            </Card>
            <Card
              title={
                <>
                  Variables
                  <Tooltip
                    title={
                      <Typography.Text>
                        You can specify variables using curly braces. For
                        example - {`{someVariable}`}.
                      </Typography.Text>
                    }
                  >
                    <InfoCircleFilled
                      style={{ marginLeft: 12, color: colors.neutral[500] }}
                    />
                  </Tooltip>
                </>
              }
            >
              <Variables />
            </Card>
          </Col>
        </Row>

        <ConsumePromptModal
          open={isConsumePromptModalOpen}
          onClose={() => setIsConsumePromptModalOpen(false)}
        />

        <CommitPromptModal
          open={isCommitModalOpen}
          onClose={() => setIsCommitModalOpen(false)}
          onCommitted={() => {
            setIsCommitModalOpen(false);
          }}
        />
        {currentVersion && (
          <PublishPromptModal
            onClose={() => setIsPublishModalOpen(false)}
            open={isPublishModalOpen}
          />
        )}

        {FUNCTIONS_FEATURE_FLAG && (
          <FunctionsFormModal
            onClose={() => setIsFunctionsModalOpen(false)}
            open={isFunctionsModalOpen}
          />
        )}
      </>
    )
  );
};
