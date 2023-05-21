import { useNavigate } from "react-router-dom";
import { useGetProjects } from "../../lib/hooks/queries";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  Typography,
  theme,
} from "antd";
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
  const { data, isLoading } = useGetProjects();
  const [isCreateNewProjectModalOpen, setIsCreateNewProjectModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const { token } = theme.useToken();

  useEffect(() => {
    if (isLoading) return;
    if (!data?.projects.length) navigate("/onboarding");
  }, [data, isLoading, navigate]);

  if (isLoading) return <Spinner />;

  return (
    <Paper>
      <Typography.Title level={2}>Projects</Typography.Title>

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
        {data.projects?.map((project, index) => (
          <Col span={12}>
            <ProjectCard
              key={project.id}
              name={project.name}
              slug={project.slug}
              id={project.id}
            />
          </Col>
        ))}
        {!isOdd(data.projects.length) && (
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
