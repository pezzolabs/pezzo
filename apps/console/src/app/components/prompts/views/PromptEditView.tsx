import { Form, Space, Button, Row, Col, Card } from "antd";
import { PromptEditor } from "../PromptEditor";
import { PromptSettings } from "../PromptSettings";
import {
  CodeOutlined,
  ExperimentOutlined,
  PlayCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/css";
import {
  getDraftPromptData,
  usePromptEdit,
} from "../../../lib/hooks/usePromptEdit";
import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { useEffect, useState } from "react";
import { PromptTester } from "../PromptTester/PromptTester";
import { PromptVariables } from "../PromptVariables";
import { usePromptTester } from "../../../lib/providers/PromptTesterContext";
import { PromptVersionSelector } from "../PromptVersionSelector";
import { CommitPromptModal } from "../CommitPromptModal";
import { PublishPromptModal } from "../PublishPromptModal";
import { ConsumePromptModal } from "../ConsumePromptModal";

export const PromptEditView = () => {
  const {
    form,
    handleFormValuesChange,
    isChangesToCommit,
    variables,
    setVariable,
  } = usePromptEdit();
  const { prompt, currentPromptVersion, isDraft } = useCurrentPrompt();
  const { openTester, runTest, isTestInProgress } = usePromptTester();
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isConsumePromptModalOpen, setIsConsumePromptModalOpen] =
    useState(false);

  useEffect(() => {
    form.resetFields();
  }, [prompt.id, currentPromptVersion]);

  const handleTest = async () => {
    await runTest({
      content: form.getFieldValue("content"),
      settings: form.getFieldValue("settings"),
      variables,
    });
    openTester();
  };

  const initialValues = {
    settings: isDraft
      ? getDraftPromptData(prompt.integrationId).settings
      : currentPromptVersion.settings,
    content: isDraft
      ? getDraftPromptData(prompt.integrationId).content
      : currentPromptVersion.content,
  };

  return (
    <>
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
      <PromptTester />

      <ConsumePromptModal
        open={isConsumePromptModalOpen}
        onClose={() => setIsConsumePromptModalOpen(false)}
        variables={variables}
      />

      <Row gutter={[12, 12]}>
        <Col span={12}>{!isDraft && <PromptVersionSelector />}</Col>
        <Col
          span={12}
          className={css`
            display: flex;
            justify-content: flex-end;
            margin-bottom: 16px;
          `}
        >
          <Space wrap>
            <Button
              onClick={() => setIsConsumePromptModalOpen(true)}
              icon={<CodeOutlined />}
            >
              Consume
            </Button>
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
              disabled={!isChangesToCommit}
              onClick={() => setIsCommitModalOpen(true)}
              icon={<SendOutlined />}
            >
              Commit
            </Button>

            <Button
              onClick={handleTest}
              loading={isTestInProgress}
              icon={<ExperimentOutlined />}
              type="default"
            >
              Test
            </Button>
          </Space>
        </Col>
      </Row>

      <Form
        onValuesChange={handleFormValuesChange}
        initialValues={initialValues}
        form={form}
        layout="vertical"
        name="basic"
        autoComplete="off"
      >
        <Row>
          <Col flex={"1"}>
            <div style={{ paddingRight: 8, height: "100%" }}>
              <Card style={{}}>
                <PromptEditor />
              </Card>
            </div>
          </Col>
          <Col flex="280px">
            <div style={{ paddingLeft: 8, height: "100%" }}>
              <Space
                style={{ width: "100%" }}
                direction="vertical"
                size="middle"
              >
                <Card title="Settings">
                  <PromptSettings integrationId={prompt.integrationId} />
                </Card>

                <Card title="Variables">
                  <PromptVariables
                    variables={variables}
                    onVariableChange={setVariable}
                  />
                </Card>
              </Space>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};
