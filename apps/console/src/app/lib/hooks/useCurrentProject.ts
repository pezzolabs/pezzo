import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetProjects } from "../../graphql/hooks/queries";

export const useCurrentProject = () => {
  const { projectId } = useParams();
  const { projects, isLoading } = useGetProjects();

  const project = useMemo(
    () => projects?.find((project) => project.id === projectId),
    [projects, projectId]
  );

  return { project, isLoading };
};
