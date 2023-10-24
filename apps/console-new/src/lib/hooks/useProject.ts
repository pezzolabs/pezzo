import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_PROJECT } from "../../graphql/definitions/queries/projects";

export const useProject = (projectId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () =>
      gqlClient.request(GET_PROJECT, {
        data: { id: projectId },
      }),
  });

  return {
    project: data?.project,
    isLoading,
  };
};
