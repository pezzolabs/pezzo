import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { Button, Card, Col, Row, Space } from "antd";
import { CommitPromptModal } from "../CommitPromptModal";
import { PublishPromptModal } from "../PublishPromptModal";
import { useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { PromptVersionSelector } from "../PromptVersionSelector";
import { PromptType } from "../../../../@generated/graphql/graphql";
import { ChatEditMode } from "../editor/chat/ChatEditMode";
import { PromptEditMode } from "../editor/prompt/PromptEditMode";
import { usePromptVersionEditorContext } from "../../../lib/providers/PromptVersionEditorContext";
import { CommitButton } from "../editor/CommitButton";
import { Variables } from "../editor/Variables";
import { ProviderSettingsCard } from "../editor/ProviderSettingsCard";
import { FunctionsFormModal } from "../FormModal";

const FUNCTIONS_FEATURE_FLAG = true;

export const PromptEditView = () => {
  const { prompt, isLoading: isPromptLoading } = useCurrentPrompt();
  const { currentVersion, isPublishEnabled, isDraft } =
    usePromptVersionEditorContext();

  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isFunctionsModalOpen, setIsFunctionsModalOpen] = useState(false);

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
            <Card title="Provider Settings" style={{ marginBottom: 24 }}>
              <ProviderSettingsCard
                onOpenFunctionsModal={
                  FUNCTIONS_FEATURE_FLAG
                    ? () => setIsFunctionsModalOpen(true)
                    : null
                }
              />
            </Card>
            <Card title="Variables">
              <Variables />
            </Card>
          </Col>
        </Row>

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
