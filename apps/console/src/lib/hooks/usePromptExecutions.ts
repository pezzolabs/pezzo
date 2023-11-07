import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "~/lib/graphql";
import { GET_PROMPT_EXECUTIONS } from "~/graphql/definitions/queries/prompt-executions";

export const usePromptExecutions = (promptId: string) => {
  const { data: promptExecutions, isLoading } = useQuery({
    queryKey: ["promptExecutions", promptId],
    queryFn: () =>
      gqlClient.request(GET_PROMPT_EXECUTIONS, {
        data: {
          promptId: { equals: promptId },
        },
      }),
    enabled: !!promptId,
  });

  return {
    isLoading,
    promptExecutions: promptExecutions?.promptExecutions,
  };
};
