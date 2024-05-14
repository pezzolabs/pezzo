import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { useCurrentProject } from "./useCurrentProject";
import { GET_ALL_PROMPTS } from "~/graphql/definitions/queries/prompts";

export const usePrompts = () => {
  const { project} = useCurrentProject();
  const ProjectId = project?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["prompts"],
    queryFn: () =>
      gqlClient.request(GET_ALL_PROMPTS, {
        data: { projectId: ProjectId },
      }),
    enabled: !!ProjectId,
  });

  return {
    prompts: data?.prompts,
    isLoading,
  };
};
