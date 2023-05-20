import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProjects } from "../hooks/queries";

export const useCurrentProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { data, isLoading } = useGetProjects();

  useEffect(() => {
    if (!projectId) {
      return navigate("/projects");
    }
  }, [navigate, projectId]);

  const project = useMemo(
    () => data?.projects.find((project) => project.id === projectId),
    [data, projectId]
  );

  return { project, isLoading };
};
