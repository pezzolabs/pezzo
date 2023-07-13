import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import {
  Button,
  Card,
  Col,
  Form,
  Radio,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { defaultOpenAISettings } from "../../../lib/model-providers";
import { PromptSettings } from "../PromptSettings";
import { PromptEditor } from "../PromptEditor";
import { CommitPromptModal } from "../CommitPromptModal";
import { PublishPromptModal } from "../PublishPromptModal";
import { useEffect, useMemo, useState } from "react";
import { PlayCircleOutlined, SendOutlined } from "@ant-design/icons";
import { PromptVersionSelector } from "../PromptVersionSelector";
import { PromptType } from "../../../../@generated/graphql/graphql";
import { PromptEditorChat } from "../editor/chat/PromptEditorChat";
import { PromptVersionEditorProvider } from "../../../lib/providers/PromptVersionEditorContext";

export const PromptEditView = () => {
  const { prompt, currentPromptVersion, isDraft } = useCurrentPrompt();
  // const initialMessages = useMemo(
  //   () =>
  //     currentPromptVersion?.settings.messages.map((message) => ({
  //       role: message.role,
  //     })) || [
  //       {
  //         role: "user",
  //       },
  //     ],
  //   [currentPromptVersion]
  // );


  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // useEffect(() => {
  //   if (messages.length) return;
  //   setMessages(initialMessages);
  // }, [form, messages, initialMessages]);

  // useEffect(() => {
  //   form.resetFields();
  //   setMessages(initialMessages);
  // }, [prompt.id, currentPromptVersion, form, initialMessages]);

  // const initialValues = {
  //   settings: isDraft ? defaultOpenAISettings : currentPromptVersion.settings,
  // };

  return (
    <PromptVersionEditorProvider>
      <Card style={{ marginBottom: 14, border: 0 }} size="small">
        <Row>
          <Col span={12}>{!isDraft && <PromptVersionSelector />}</Col>
          <Col
            span={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Space>
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
                // disabled={!hasChangesToCommit}
                onClick={() => setIsCommitModalOpen(true)}
                icon={<SendOutlined />}
              >
                Commit
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={17}>
          {/* <PromptEditor
            form={form}
            messages={messages}
            onDeleteMessage={handleDeleteMessage}
            onNewMessage={() =>
              setMessages((prev) => [...prev, { role: "user" }])
            }
          /> */}
          {prompt.type === PromptType.Prompt ? (
            <>poopoo</>
          ) : (
            <PromptEditorChat />
          )}
        </Col>
        <Col span={7}>
          {/* <Card title="Settings"> */}
          {/* <PromptSettings model={settings.model} /> */}
          {/* </Card> */}
          {/* <Card title="Variables" style={{ marginTop: 18 }}>
            {Object.keys(variables).length === 0 && (
              <Typography.Text type="secondary">
                No variables found.
              </Typography.Text>
            )}

            {Object.keys(variables).map((key) => (
              <Tag key={key}>{key}</Tag>
            ))}
          </Card> */}
        </Col>
      </Row>
      {/* 
      <CommitPromptModal
        form={form}
        open={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        onCommitted={() => {
          form.resetFields();
          setIsCommitModalOpen(false);
        }}
      /> */}
      {currentPromptVersion && (
        <PublishPromptModal
          onClose={() => setIsPublishModalOpen(false)}
          open={isPublishModalOpen}
        />
      )}
    </PromptVersionEditorProvider>
  );
};
