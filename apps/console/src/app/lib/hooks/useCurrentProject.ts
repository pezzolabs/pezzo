import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProjects } from "./queries";

export const useCurrentProject = () => {
  const { projectId } = useParams();
  const { data, isLoading } = useGetProjects();
  const navigate = useNavigate();

  const project = useMemo(
    () => data?.projects.find((project) => project.id === projectId),
    [data, projectId]
  );

  useEffect(() => {
    if (!project && !isLoading) {
      navigate("/projects");
    }
  }, [project, isLoading, navigate]);

  return { project, isLoading };
};
