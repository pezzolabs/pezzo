import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { useCurrentProject } from "./useCurrentProject";
import { GET_MODELS } from "~/graphql/definitions/queries/prompts";

export const useModels = () => {
  const { project } = useCurrentProject();

  const { data, isLoading } = useQuery({
    queryKey: ["models"],
    queryFn: () =>
      gqlClient.request(GET_MODELS, {
        data: { projectId: project.id },
      }),
    enabled: !!project,
  });

  return {
    models: data?.models,
    isLoading,
  };
};
