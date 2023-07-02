import { Button, Card, Space, Tag, Tooltip, Typography } from "antd";
import { useCurrentProject } from "../../../lib/hooks/useCurrentProject";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "../../../lib/utils/browser-utils";
import { useState } from "react";
import { CodeBracketIcon, PlusIcon } from "@heroicons/react/24/solid";
import colors from "tailwindcss/colors";
import { JavascriptIntegrationModal } from "../../../components/overview";

export const ProjectPage = () => {
  const { project, isLoading } = useCurrentProject();
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState<"javascript" | undefined>();
  const [isHovering, setHovering] = useState(false);

  if (isLoading) return <>Loading...</>;

  return (
    <div>
      <Space direction="horizontal" size="large" align="center">
        <Typography.Title level={3} style={{ margin: 0 }}>
          {project.name}
        </Typography.Title>
        <Tooltip title={clicked ? "Copied!" : "Copy to clipboard"}>
          <Button
            icon={<CopyOutlined />}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => {
              setHovering(false);
              if (clicked) setTimeout(() => setClicked(false), 1000);
            }}
            onClick={() => {
              copyToClipboard(project.id);
              setClicked(true);
            }}
          >
            Project ID
          </Button>
        </Tooltip>
      </Space>
      {showModal === "javascript" && (
        <JavascriptIntegrationModal
          onCancel={() => setShowModal(undefined)}
          projectId={project.id}
        />
      )}
      <Card style={{ marginTop: 24 }}>
        <Typography.Title level={4}>Getting started</Typography.Title>
        <Typography.Paragraph type="secondary">
          We'll help you get things up and running in no time.
        </Typography.Paragraph>

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <div>
            <Typography.Title level={4} style={{ marginTop: 42 }}>
              Integrate Pezzo With Your Server
            </Typography.Title>

            <Typography.Paragraph type="secondary">
              Pezzo's SDK is currently available in JavaScript only. <br />
              To get started, install the SDK in your project
            </Typography.Paragraph>
          </div>
        </Space>
        <Space
          direction="horizontal"
          size="large"
          style={{ marginTop: 24, gap: 48 }}
        >
          <Card
            style={{ width: 325, marginTop: 24 }}
            hoverable
            onClick={() => setShowModal("javascript")}
          >
            <Space
              direction="horizontal"
              size="large"
              style={{ display: "flex" }}
            >
              <CodeBracketIcon color={colors["white"]} width={24} />
              <Typography.Text>JavaScript</Typography.Text>
            </Space>
          </Card>
          <Card
            style={{ width: 325, marginTop: 24 }}
            hoverable
            onClick={() => setShowModal("javascript")}
          >
            <Space
              direction="horizontal"
              size="large"
              style={{ display: "flex" }}
            >
              <CodeBracketIcon color={colors["white"]} width={24} />
              <Typography.Text>Python</Typography.Text>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
};
