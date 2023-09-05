import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { Button, Card, Col, Row, Space, Tooltip, Typography } from "antd";
import { CommitPromptModal } from "../CommitPromptModal";
import { PublishPromptModal } from "../PublishPromptModal";
import { useState } from "react";
import {
  ExperimentOutlined,
  CodeOutlined,
  InfoCircleFilled,
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
import { colors } from "../../../lib/theme/colors";
import { PromptTesterModal } from "../prompt-tester/PromptTesterModal";
import { usePromptTester } from "../../../lib/providers/PromptTesterContext";
import { ConsumePromptModal } from "../ConsumePromptModal";
import { trackEvent } from "../../../lib/utils/analytics";

const FUNCTIONS_FEATURE_FLAG = true;

export const PromptEditView = () => {
  const { openTestModal } = usePromptTester();
  const { prompt, isLoading: isPromptLoading } = useCurrentPrompt();
  const { currentVersion, isPublishEnabled, isDraft, form } =
    usePromptVersionEditorContext();

  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isConsumePromptModalOpen, setIsConsumePromptModalOpen] =
    useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isFunctionsModalOpen, setIsFunctionsModalOpen] = useState(false);

  const handleRunTest = () => {
    const formValues = form.getFieldsValue();
    openTestModal(formValues);
    trackEvent("prompt_run_test_clicked");
  };

  const onConsumeClick = () => {
    setIsConsumePromptModalOpen(true);
    trackEvent("prompt_how_to_consume_modal_opened");
  };

  const onPublishClick = () => {
    setIsPublishModalOpen(true);
    trackEvent("prompt_publish_modal_opened");
  };

  const onCommitClick = () => {
    setIsCommitModalOpen(true);
    trackEvent("prompt_commit_modal_opened");
  };

  const onOpenFunctionsModal = FUNCTIONS_FEATURE_FLAG
    ? () => {
        setIsFunctionsModalOpen(true);
        trackEvent("prompt_functions_modal_opened");
      }
    : null;

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
                <Button icon={<ExperimentOutlined />} onClick={handleRunTest}>
                  Test
                </Button>
                {isPublishEnabled && (
                  <Button onClick={onConsumeClick} icon={<CodeOutlined />}>
                    How to Consume
                  </Button>
                )}
                {isPublishEnabled && (
                  <Button
                    onClick={onPublishClick}
                    icon={<PlayCircleOutlined />}
                    type="primary"
                  >
                    Publish
                  </Button>
                )}
                <CommitButton onClick={onCommitClick} />
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
                onOpenFunctionsModal={onOpenFunctionsModal}
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

        <PromptTesterModal />

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
