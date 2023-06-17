import { useNavigate } from "react-router-dom";
import { useGetProjects } from "../../graphql/hooks/queries";
import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Spin, Typography, theme } from "antd";
import styled from "@emotion/styled";
import { ProjectCard } from "../../components/projects";
import { PlusOutlined } from "@ant-design/icons";
import { CreateNewProjectModal } from "../../components/projects/CreateNewProjectModal";

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

  useEffect(() => {
    if (isLoading) return;
    if (!projects?.length) navigate("/onboarding");
  }, [projects, isLoading, navigate]);

  if (isLoading) return <Spinner />;

  return (
    <Paper>
      <CreateNewProjectModal
        open={isCreateNewProjectModalOpen}
        onClose={() => setIsCreateNewProjectModalOpen(false)}
        onCreated={() => setIsCreateNewProjectModalOpen(false)}
      />
      <Row justify="end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => setIsCreateNewProjectModalOpen(true)}
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
              name={project.name}
              slug={project.slug}
              id={project.id}
            />
          </Col>
        ))}
        {!isOdd(projects?.length) && (
          <Col span={12}>
            <Card
              hoverable
              onClick={() => setIsCreateNewProjectModalOpen(true)}
            >
              <Row justify="center">
                <Col>
                  <Button type="dashed" icon={<PlusOutlined />} size="large" />
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
  );
};
