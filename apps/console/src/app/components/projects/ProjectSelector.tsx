import { DownOutlined } from "@ant-design/icons";
import { Button, MenuProps, Typography } from "antd";
import { Dropdown, Space } from "antd";
import { useCurrentProject } from "../../lib/providers/CurrentProjectContext";
import { useProjects } from "../../lib/hooks/useProjects";
import { useNavigate } from "react-router-dom";

export const ProjectSelector = () => {
  const { project } = useCurrentProject();
  const { projects } = useProjects();
  const navigate = useNavigate();

  if (!projects) {
    return null;
  }

  const items: MenuProps["items"] = projects.map((project) => ({
    key: project.id,
    label: <Typography.Text>{project.name}</Typography.Text>,
    onClick: () => navigate(`/projects/${project.id}/prompts`),
  }));

  const selectedProject = project || projects[0];

  return (
    <Dropdown trigger={["click"]} menu={{ items }}>
      <Space>
        <Button>
          {selectedProject.name}
          <DownOutlined />
        </Button>
      </Space>
    </Dropdown>
  );
};
