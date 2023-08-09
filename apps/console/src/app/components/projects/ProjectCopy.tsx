import { Button, Tooltip } from "antd";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "../../lib/utils/browser-utils";
import { useState } from "react";

export const ProjectCopy = () => {
  const { project, isLoading } = useCurrentProject();
  const [clicked, setClicked] = useState(false);

  if (isLoading) return null;

  return (
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
        Copy Project ID
      </Button>
    </Tooltip>
  );
};
