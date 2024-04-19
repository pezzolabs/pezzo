import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { useCurrentProject } from "./useCurrentProject";
import { GET_MODELS } from "~/graphql/definitions/queries/gai";

export const useModels = () => {
  const { project } = useCurrentProject();

  const { data, isLoading } = useQuery({
    queryKey: ["models"],
    queryFn: () =>
      gqlClient.request(GET_MODELS, {

      }),
    // enabled: !!project,
  });

  return {
    models: data.models || [],
    isLoading,
  };
};
