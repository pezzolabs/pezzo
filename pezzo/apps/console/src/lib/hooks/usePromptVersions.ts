import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_PROMPT_VERSIONS } from "../../graphql/definitions/queries/prompts";

export const usePromptVersions = (promptId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["promptVersions", promptId],
    queryFn: () =>
      gqlClient.request(GET_PROMPT_VERSIONS, {
        data: { promptId },
      }),
  });

  return {
    promptVersions: data?.prompt?.versions,
    isLoading,
  };
};
