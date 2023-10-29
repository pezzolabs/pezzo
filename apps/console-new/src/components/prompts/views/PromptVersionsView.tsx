import { Table, Typography } from "antd";
import { usePromptVersions } from "~/lib/hooks/usePromptVersions";
import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { Avatar } from "~/components/common/Avatar";
import { InlineCodeSnippet } from "~/components/common/InlineCodeSnippet";
import { trackEvent } from "~/lib/utils/analytics";
import React from "react";

export const PromptVersionsView = () => {
  const { prompt } = useCurrentPrompt();
  const { promptVersions } = usePromptVersions(prompt.id);

  React.useEffect(() => {
    trackEvent("prompt_versions_viewed");
  }, [prompt.id]);

  const columns = [
    {
      title: "SHA",
      dataIndex: "sha",
      key: "sha",
      render: (sha) => <InlineCodeSnippet>{sha}</InlineCodeSnippet>,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (user) => (
        <>
          {/* <Avatar user={user} size="small" /> */}
          <Typography.Text style={{ marginLeft: 8 }}>
            {user.name}
          </Typography.Text>
        </>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (message) =>
        message ? (
          <Typography.Text>{message}</Typography.Text>
        ) : (
          <Typography.Text italic type="secondary">
            No message
          </Typography.Text>
        ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => new Date(time).toLocaleString(),
    },
  ];

  return (
    promptVersions && (
      <Table
        pagination={false}
        columns={columns}
        dataSource={promptVersions.map((version) => ({
          key: version.sha,
          sha: version.sha.slice(0, 7),
          message: version.message,
          author: version.createdBy,
          time: version.createdAt,
        }))}
      />
    )
  );
};
