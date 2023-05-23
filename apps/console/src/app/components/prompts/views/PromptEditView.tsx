import { Form, Space, Button, Row, Col, Card, Tooltip } from "antd";
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
import { PromptTester } from "../PromptTester";
import { PromptVariables } from "../PromptVariables";
import { usePromptTester } from "../../../lib/providers/PromptTesterContext";
import { PromptVersionSelector } from "../PromptVersionSelector";
import { CommitPromptModal } from "../CommitPromptModal";
import { PublishPromptModal } from "../PublishPromptModal";
import { ConsumePromptModal } from "../ConsumePromptModal";
import { useProviderApiKeys } from "../../../lib/hooks/queries";

export const PromptEditView = () => {
  const {
    form,
    handleFormValuesChange,
    isChangesToCommit,
    variables,
    setVariable,
  } = usePromptEdit();
  const { prompt, currentPromptVersion, integration, isDraft } =
    useCurrentPrompt();
  const { openTester, runTest, isTestInProgress, isTesterOpen } =
    usePromptTester();
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isConsumePromptModalOpen, setIsConsumePromptModalOpen] =
    useState(false);

  const { data: providerApiKeysData } = useProviderApiKeys();

  const isTestEnabled = !!providerApiKeysData?.providerApiKeys.find(
    (apiKey) => apiKey.provider === integration.provider
  );

  useEffect(() => {
    form.resetFields();
  }, [prompt.id, currentPromptVersion]);

  const handleTest = async (values) => {
    console.log(values);
    await runTest({
      content: values.content,
      settings: values.settings,
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
      {isTesterOpen && <PromptTester />}

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

            <Tooltip
              title={
                !isTestEnabled &&
                `Configure an API key for the ${integration.provider} to use the Test feature.`
              }
            >
              <Button
                loading={isTestInProgress}
                icon={<ExperimentOutlined />}
                disabled={!isTestEnabled}
                htmlType="submit"
                form="prompt-form"
              >
                Test
              </Button>
            </Tooltip>
          </Space>
        </Col>
      </Row>

      <Form
        onValuesChange={handleFormValuesChange}
        onFinish={handleTest}
        initialValues={initialValues}
        form={form}
        layout="vertical"
        name="prompt-form"
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
