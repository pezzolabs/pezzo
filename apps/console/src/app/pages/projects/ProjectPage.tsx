import { Button, Space, Tooltip, Typography } from "antd";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "../../lib/utils/browser-utils";
import { useState } from "react";
import { GettingStartedWizard } from "./getting-started-wizard/GettingStartedWizard";
import { GettingStartedWizardProvider } from "../../lib/providers/GettingStartedWizardProvider";

export const ProjectPage = () => {
  const { project, isLoading } = useCurrentProject();
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState<"javascript" | undefined>();

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
            onMouseLeave={() => {
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
      <GettingStartedWizardProvider>
        <GettingStartedWizard />
      </GettingStartedWizardProvider>
    </div>
  );
};
