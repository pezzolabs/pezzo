import { useNavigate } from "react-router-dom";
import { useGetProjects } from "../../graphql/hooks/queries";
import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Spin, Typography, theme, message } from "antd";
import styled from "@emotion/styled";
import { ProjectCard } from "../../components/projects";
import { PlusOutlined } from "@ant-design/icons";
import { CreateNewProjectModal } from "../../components/projects/CreateNewProjectModal";
import { trackEvent } from "../../lib/utils/analytics";

const Spinner = styled(Row)`
  height: 100%;
`;

Spinner.defaultProps = {
  justify: "center",
  align: "middle",
  children: <Spin size="large" />,
};

const Paper = styled.div`
  min-width: 640px;
`;

const isOdd = (number: number) => number % 2 === 0;

export const ProjectsPage = () => {
  const { projects, isLoading } = useGetProjects();
  const [isCreateNewProjectModalOpen, setIsCreateNewProjectModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isLoading) return;
    if (!projects?.length) navigate("/onboarding");
  }, [projects, isLoading, navigate]);

  if (isLoading) return <Spinner />;

  const onOpenCreateNewProjectModal = (placement: "button" | "card") => () => {
    setIsCreateNewProjectModalOpen(true);
    trackEvent("project_create_modal_opened", { placement });
  };

  return (
    <>
      {contextHolder}
      <Paper>
        <CreateNewProjectModal
          open={isCreateNewProjectModalOpen}
          onClose={() => setIsCreateNewProjectModalOpen(false)}
          onCreated={() => setIsCreateNewProjectModalOpen(false)}
        />

        <Row justify="end">
          <Button
            icon={<PlusOutlined />}
            onClick={onOpenCreateNewProjectModal("button")}
            style={{
              marginBottom: token.marginLG,
            }}
            size="large"
          >
            Create project
          </Button>
        </Row>

        <Row gutter={16}>
          {projects?.map((project, index) => (
            <Col span={12} key={project.id}>
              <ProjectCard
                onDelete={() =>
                  messageApi.success("Project deleted successfully")
                }
                onUpdate={() =>
                  messageApi.success("Project updated successfully")
                }
                project={project}
              />
            </Col>
          ))}
          {!isOdd(projects?.length) && (
            <Col span={12}>
              <Card hoverable onClick={onOpenCreateNewProjectModal("card")}>
                <Row justify="center">
                  <Col>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      size="large"
                    />
                  </Col>
                </Row>
                <Row justify="center" style={{ marginTop: token.marginSM }}>
                  <Typography.Text strong>Create a new project</Typography.Text>
                </Row>
              </Card>
            </Col>
          )}
        </Row>
      </Paper>
    </>
  );
};
