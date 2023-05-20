import { DownOutlined } from "@ant-design/icons";
import { Button, MenuProps, Typography } from "antd";
import { Dropdown, Space } from "antd";
import { useCurrentProject } from "../../lib/providers/CurrentProjectContext";
import { useNavigate } from "react-router-dom";
import { useGetProjects } from "../../lib/hooks/queries";

export const ProjectSelector = () => {
  const { project } = useCurrentProject();
  const { data } = useGetProjects();
  const navigate = useNavigate();

  if (!data?.projects) return null;

  const items: MenuProps["items"] = data?.projects.map((project) => ({
    key: project.id,
    label: <Typography.Text>{project.name}</Typography.Text>,
    onClick: () => navigate(`/projects/${project.id}/prompts`),
  }));

  const selectedProject = project || data?.projects?.[0];

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
