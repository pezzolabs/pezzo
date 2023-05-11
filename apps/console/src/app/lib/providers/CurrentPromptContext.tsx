import { createContext, useContext, useState } from "react";
import { gqlClient } from "../graphql";
import { GET_PROMPT } from "../../graphql/queries/prompts";
import { GetPromptQuery, GetPromptVersionQuery } from "@pezzo/graphql";
import { useQuery } from "@tanstack/react-query";
import { IntegrationDefinition, getIntegration } from "@pezzo/integrations";

interface CurrentPromptContextValue {
  isDraft: boolean;
  prompt: GetPromptQuery["prompt"];
  integration: IntegrationDefinition;
  currentPromptVersion: GetPromptVersionQuery["promptVersion"];
  setCurrentPromptId: (promptId: string, version: string) => void;
  isLoading: boolean;
  setPromptVersion: (version: string) => void;
}

const CurrentPromptContext = createContext<CurrentPromptContextValue>({
  isDraft: undefined,
  prompt: undefined,
  integration: undefined,
  currentPromptVersion: undefined,
  setCurrentPromptId: () => void 0,
  isLoading: false,
  setPromptVersion: () => void 0,
});

export const useCurrentPrompt = () => {
  return useContext(CurrentPromptContext);
};

export const CurrentPromptProvider = ({ children }) => {
  const [promptId, setPromptId] = useState<string | undefined>(undefined);
  const [promptVersion, setPromptVersion] = useState<string | undefined>(
    undefined
  );

  const queryKey = ["prompt", promptId, promptVersion];

  const { data: currentPrompt, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      gqlClient.request(GET_PROMPT, {
        data: { promptId, version: promptVersion },
      }),
    enabled: !!promptId && !!promptVersion,
  });

  const value = {
    isDraft: currentPrompt?.prompt.version === null,
    prompt: currentPrompt?.prompt,
    currentPromptVersion: currentPrompt?.prompt?.version,
    integration:
      currentPrompt?.prompt &&
      getIntegration(currentPrompt.prompt.integrationId),
    setCurrentPromptId: (promptId: string, version: string) => {
      setPromptId(promptId);
      setPromptVersion(version);
    },
    setPromptVersion,
    isLoading,
  };

  return (
    <CurrentPromptContext.Provider value={value}>
      {children}
    </CurrentPromptContext.Provider>
  );
};
