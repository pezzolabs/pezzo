import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_ALL_ENVIRONMENTS } from "../../graphql/queries/environments";
import { useCurrentProject } from "../providers/CurrentProjectContext";

export const useEnvironments = () => {
  const { project } = useCurrentProject();

  const { data } = useQuery({
    queryKey: ["environments"],
    queryFn: () =>
      gqlClient.request(GET_ALL_ENVIRONMENTS, {
        data: { projectId: project.id },
      }),
  });

  return {
    environments: data?.environments,
  };
};
