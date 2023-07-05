import { getIntegration } from "@pezzo/integrations";
import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { usePromptTester } from "../../../lib/providers/PromptTesterContext";
import { Button, Card, Col, Form, Row, Space, Spin, Tag, Tooltip } from "antd";
import { defaultOpenAISettings } from "../../../lib/model-providers";
import { usePromptEdit } from "../../../lib/hooks/usePromptEdit";
import { PromptSettings } from "../PromptSettings";
import { PromptEditor } from "../PromptEditor";
import { PromptVariables } from "../PromptVariables";
import { CommitPromptModal } from "../CommitPromptModal";
import { PublishPromptModal } from "../PublishPromptModal";
import { useEffect, useState } from "react";
import {
  Loading3QuartersOutlined,
  PlayCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { PromptVersionSelector } from "../PromptVersionSelector";

export const PromptPlaygroundView = () => {
  const { prompt, currentPromptVersion, isDraft } = useCurrentPrompt();
  const [_, setTrigger] = useState(0);

  const { form, handleFormValuesChange, hasChangesToCommit, variables } =
    usePromptEdit();

  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const { openTester, runTest, isTestInProgress, isTesterOpen } =
    usePromptTester();

  useEffect(() => {
    form.resetFields();
  }, [prompt.id, currentPromptVersion, form]);

  const settings = isDraft
    ? defaultOpenAISettings
    : currentPromptVersion.settings;

  return (
    <Form
      onValuesChange={handleFormValuesChange}
      onFinish={() => console.log("okFinish")}
      initialValues={{ settings }}
      form={form}
      layout="vertical"
      name="prompt-form"
      autoComplete="off"
    >
      <Row>
        <Col span={17}>
          <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col span={17}>{!isDraft && <PromptVersionSelector />}</Col>
            <Col style={{ marginLeft: 24, display: "flex", gap: 12 }}>
              {currentPromptVersion && (
                <Button
                  onClick={() => setIsPublishModalOpen(true)}
                  icon={<PlayCircleOutlined />}
                  type="primary"
                >
                  Publish
                </Button>
              )}
              <Button
                disabled={!hasChangesToCommit}
                onClick={() => setIsCommitModalOpen(true)}
                icon={<SendOutlined />}
              >
                Commit
              </Button>
            </Col>
          </Row>

          <PromptEditor
            form={form}
            onDeleteMessage={() => setTrigger((t) => t + 1)}
          />
          <Card title="Variables" style={{ marginTop: 18 }}>
            {Object.keys(variables).map((key) => (
              <Tag key={key}>{key}</Tag>
            ))}
          </Card>
        </Col>
        <Col span={6} offset={1}>
          <Card title="Settings">
            <PromptSettings model={settings.model} />
          </Card>
        </Col>
      </Row>

      <CommitPromptModal
        form={form}
        open={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        onCommitted={() => {
          form.resetFields();
          setIsCommitModalOpen(false);
        }}
      />
      {currentPromptVersion && (
        <PublishPromptModal
          onClose={() => setIsPublishModalOpen(false)}
          open={isPublishModalOpen}
        />
      )}
    </Form>
  );
};
