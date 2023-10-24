import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_PROMPT_VERSIONS } from "../../graphql/definitions/queries/prompts";

export const usePromptVersions = (promptId: string, enabled = true) => {
  const { data, isLoading } = useQuery({
    queryKey: ["promptVersions", promptId],
    queryFn: () =>
      gqlClient.request(GET_PROMPT_VERSIONS, {
        data: { promptId },
      }),
    enabled: !!promptId && enabled,
  });

  return {
    promptVersions: data?.prompt?.versions,
    isLoading,
  };
};
