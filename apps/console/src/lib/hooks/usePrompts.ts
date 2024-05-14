import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { useCurrentProject } from "./useCurrentProject";
import { GET_ALL_PROMPTS } from "~/graphql/definitions/queries/prompts";

export const usePrompts = () => {
  const { project } = useCurrentProject();

  const { data, isLoading } = useQuery({
    queryKey: ["prompts"],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROMPTS, {
        data: { projectId: project.id },
      }),
    enabled: !!project.id,
  });

  return {
    prompts: data?.prompts,
    isLoading,
  };
};
