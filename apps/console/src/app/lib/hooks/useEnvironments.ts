import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_ALL_ENVIRONMENTS } from "../../graphql/definitions/queries/environments";
import { useCurrentProject } from "./useCurrentProject";

export const useEnvironments = () => {
  const { project } = useCurrentProject();

  const { data, isLoading } = useQuery({
    queryKey: ["environments"],
    queryFn: () =>
      gqlClient.request(GET_ALL_ENVIRONMENTS, {
        data: { projectId: project.id },
      }),
  });

  return {
    environments: data?.environments,
    isLoading,
  };
};
