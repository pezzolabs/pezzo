import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetProjects } from "../hooks/queries";

export const useCurrentProject = () => {
  const { projectId } = useParams();
  const { data, isLoading } = useGetProjects();

  const project = useMemo(
    () => data?.projects.find((project) => project.id === projectId),
    [data, projectId]
  );

  return { project, isLoading };
};
