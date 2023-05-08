import { Alert, List, Modal, Radio, Typography } from "antd";
import { useEnvironments } from "../../lib/hooks/useEnvironments";
import { useCurrentPrompt } from "../../lib/providers/CurrentPromptContext";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { gqlClient, queryClient } from "../../lib/graphql";
import { PUBLISH_PROMPT } from "../../graphql/mutations/prompt-environments";
import { PublishPromptInput } from "@pezzo/graphql";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const PublishPromptModal = ({ open, onClose }: Props) => {
  const { currentPromptVersion, prompt } = useCurrentPrompt();
  const { environments } = useEnvironments();
  const [selectedEnvironmentSlug, setSelectedEnvironmentSlug] =
    useState<string>(undefined);
  const [selectedEnvironmentName, setSelectedEnvironmentName] =
    useState<string>(undefined);

  const publishPromptMutation = useMutation({
    mutationFn: (data: PublishPromptInput) =>
      gqlClient.request(PUBLISH_PROMPT, {
        data: {
          promptId: data.promptId,
          environmentSlug: data.environmentSlug,
          promptVersionSha: data.promptVersionSha,
        },
      }),
    mutationKey: ["publishPrompt", prompt.id, currentPromptVersion.sha],
    onSuccess: () => {
      queryClient.invalidateQueries(["promptEnvironments"]);
    },
  });

  const handlePublish = async () => {
    publishPromptMutation.mutate({
      promptId: prompt.id,
      environmentSlug: selectedEnvironmentSlug,
      promptVersionSha: currentPromptVersion.sha,
    });
  };

  useEffect(() => {
    setSelectedEnvironmentSlug(undefined);
    setSelectedEnvironmentName(undefined);
    publishPromptMutation.reset();
  }, [open]);

  return (
    environments && (
      <Modal
        cancelButtonProps={{
          style: {
            display:
              publishPromptMutation.isError || publishPromptMutation.isSuccess
                ? ""
                : "none",
          },
        }}
        onCancel={onClose}
        cancelText="Close"
        okText="Publish"
        okButtonProps={{
          disabled: !selectedEnvironmentSlug,
        }}
        onOk={handlePublish}
        open={open}
        title={`Publish ${prompt.name}`}
      >
        <>
          <p>Select the environment to publish this version to.</p>
          {publishPromptMutation.isSuccess && (
            <Alert
              style={{ marginBottom: 12 }}
              type="success"
              showIcon
              description={`Prompt successfully published to the ${selectedEnvironmentName} environment.`}
            />
          )}

          {publishPromptMutation.isError && (
            <Alert
              style={{ marginBottom: 12 }}
              type="error"
              showIcon
              // eslint-disable-next-line
              description={
                (publishPromptMutation.error as unknown as any)?.response
                  ?.errors[0]?.message
              }
            />
          )}

          <Radio.Group
            style={{ width: "100%" }}
            value={selectedEnvironmentSlug}
          >
            <List
              bordered
              dataSource={environments}
              renderItem={(env) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedEnvironmentSlug(env.slug);
                    setSelectedEnvironmentName(env.name);
                  }}
                >
                  <Typography.Text>{env.name}</Typography.Text>
                  <Radio value={env.slug} />
                </List.Item>
              )}
            />
          </Radio.Group>
        </>
      </Modal>
    )
  );
};
