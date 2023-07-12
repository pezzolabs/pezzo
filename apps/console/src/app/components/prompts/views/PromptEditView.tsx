import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { Button, Card, Col, Form, Row, Tag, Typography } from "antd";
import { defaultOpenAISettings } from "../../../lib/model-providers";
import { usePromptEdit } from "../../../lib/hooks/usePromptEdit";
import { PromptSettings } from "../PromptSettings";
import { PromptEditor } from "../PromptEditor";
import { CommitPromptModal } from "../CommitPromptModal";
import { PublishPromptModal } from "../PublishPromptModal";
import { useEffect, useMemo, useState } from "react";
import { PlayCircleOutlined, SendOutlined } from "@ant-design/icons";
import { PromptVersionSelector } from "../PromptVersionSelector";

export const PromptEditView = () => {
  const { prompt, currentPromptVersion, isDraft } = useCurrentPrompt();
  const initialMessages = useMemo(
    () =>
      currentPromptVersion?.settings.messages.map((message) => ({
        role: message.role,
      })) || [
        {
          role: "user",
        },
      ],
    [currentPromptVersion]
  );

  const { form, handleFormValuesChange, hasChangesToCommit, variables } =
    usePromptEdit();

  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant" }[]>(
    []
  );

  useEffect(() => {
    if (messages.length) return;
    setMessages(initialMessages);
  }, [form, messages, initialMessages]);

  const handleDeleteMessage = () => {
    const updatedSettings = form.getFieldValue("settings");
    setMessages((prev) => prev.slice(0, prev.length - 1));
    form.setFieldValue(
      ["settings", "messages"],
      updatedSettings.messages.slice(0, updatedSettings.messages.length - 1)
    );
  };

  useEffect(() => {
    form.resetFields();
    setMessages(initialMessages);
  }, [prompt.id, currentPromptVersion, form, initialMessages]);

  const settings = isDraft
    ? defaultOpenAISettings
    : currentPromptVersion.settings;

  return (
    <Form
      onValuesChange={handleFormValuesChange}
      initialValues={{ settings }}
      form={form}
      layout="vertical"
      name="prompt-form"
      autoComplete="off"
    >
      <Row>
        <Col span={17}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            {!isDraft && <PromptVersionSelector />}
            <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
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
            </div>
          </div>
          <PromptEditor
            form={form}
            messages={messages}
            onDeleteMessage={handleDeleteMessage}
            onNewMessage={() =>
              setMessages((prev) => [...prev, { role: "user" }])
            }
          />
        </Col>
        <Col span={6} offset={1}>
          <Card title="Settings">
            <PromptSettings model={settings.model} />
          </Card>
          <Card title="Variables" style={{ marginTop: 18 }}>
            {Object.keys(variables).length === 0 && (
              <Typography.Text type="secondary">
                No variables found.
              </Typography.Text>
            )}

            {Object.keys(variables).map((key) => (
              <Tag key={key}>{key}</Tag>
            ))}
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
