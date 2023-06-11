import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetProjects } from "./queries";

export const useCurrentProject = () => {
  const { projectId } = useParams();
  const { data, isLoading } = useGetProjects();

  const project = useMemo(
    () => projects?.find((project) => project.id === projectId),
    [projects, projectId]
  );

  return { project, isLoading };
};
