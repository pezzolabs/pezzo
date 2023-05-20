import { useNavigate } from "react-router-dom";
import { useGetProjects } from "../../lib/hooks/queries";
import { useEffect } from "react";
import { Row, Spin } from "antd";
import styled from "@emotion/styled";
import { ProjectCard } from "../../components/projects";

const Spinner = styled(Row)`
  height: 100%;
`;

Spinner.defaultProps = {
  justify: "center",
  align: "middle",
  children: <Spin size="large" />,
};

const Paper = styled.div`
  max-width: 320px;
`;

export const ProjectsPage = () => {
  const { data, isLoading } = useGetProjects();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!data.projects.length) navigate("/onboarding");
  }, [data, isLoading, navigate]);

  if (isLoading) return <Spinner />;

  return (
    <Paper>
      {data.projects?.map((project) => (
        <ProjectCard
          key={project.id}
          name={project.name}
          slug={project.slug}
          id={project.id}
        />
      ))}
    </Paper>
  );
};
