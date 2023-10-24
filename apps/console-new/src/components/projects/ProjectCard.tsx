import { Card, MenuProps, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "~/lib/utils/analytics";
import Icon from "@ant-design/icons/lib/components/Icon";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import Dropdown from "antd/es/dropdown/dropdown";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { useState } from "react";
import { GetProjectsQuery } from "~/@generated/graphql/graphql";
import { RenameProjectModal } from "./RenameProjectModal";

interface ProjectCardProps {
  project: GetProjectsQuery["projects"][0];
  onDelete: () => void;
  onUpdate: () => void;
}

export const ProjectCard = ({
  project,
  onDelete,
  onUpdate,
}: ProjectCardProps) => {
  const { name, id } = project;

  const [projectToDelete, setProjectToDelete] = useState<
    GetProjectsQuery["projects"][0] | null
  >(null);
  const [projectToRename, setProjectToRename] = useState<
    GetProjectsQuery["projects"][0] | null
  >(null);
  const navigate = useNavigate();
  const onCardClick = () => {
    navigate(`/projects/${id}`);
    trackEvent("project_nav_clicked", { projectId: id });
  };

  const menuItems: MenuProps["items"] = [
    {
      label: "Rename",
      key: "rename",
      icon: <EditOutlined />,
    },
    {
      label: <Typography.Text type="danger">Delete</Typography.Text>,
      key: "delete",
      icon: (
        <Typography.Text type="danger">
          <DeleteOutlined />
        </Typography.Text>
      ),
    },
  ];

  const handleMenuItemClick: MenuProps["onClick"] = (e) => {
    const { domEvent } = e;

    switch (e.key) {
      case "rename":
        trackEvent("project_rename_modal_opened", { projectId: project.id });
        setProjectToRename(project);
        break;
      case "delete":
        trackEvent("project_delete_modal_opened", { projectId: project.id });
        setProjectToDelete(project);
        break;
    }
    domEvent.stopPropagation();
  };

  return (
    <>
      <DeleteProjectModal
        projectToDelete={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onDelete={() => {
          onDelete();
          setProjectToDelete(null);
        }}
      />
      <RenameProjectModal
        projectToRename={projectToRename}
        onClose={() => setProjectToRename(null)}
        onRename={() => {
          onUpdate();
          setProjectToRename(null);
        }}
      />
      <Card
        hoverable
        onClick={onCardClick}
        style={{ marginBottom: 16, height: 122 }}
      >
        <Row justify="space-between" align="middle">
          <Typography.Title level={4} style={{ margin: 0 }}>
            {name}
          </Typography.Title>

          <Dropdown
            trigger={["click"]}
            menu={{
              items: menuItems,
              onClick: handleMenuItemClick,
            }}
          >
            <Icon
              onClick={(e) => e.stopPropagation()}
              component={() => (
                <EllipsisVerticalIcon height={24} opacity={0.5} />
              )}
            />
          </Dropdown>
        </Row>
      </Card>
    </>
  );
};
