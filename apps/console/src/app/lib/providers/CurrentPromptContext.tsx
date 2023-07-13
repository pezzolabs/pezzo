import { createContext, useContext } from "react";
import { gqlClient } from "../graphql";
import { GET_PROMPT } from "../../graphql/definitions/queries/prompts";
import { GetPromptQuery } from "../../../@generated/graphql/graphql";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

interface CurrentPromptContextValue {
  prompt: GetPromptQuery["prompt"];
  isLoading: boolean;
}

const CurrentPromptContext = createContext<CurrentPromptContextValue>({
  prompt: undefined,
  isLoading: false,
});

export const useCurrentPrompt = () => {
  return useContext(CurrentPromptContext);
};

export const CurrentPromptProvider = ({ children }) => {
  const { promptId } = useParams();

  const {
    data: currentPrompt,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["prompt", promptId],
    queryFn: () =>
      gqlClient.request(GET_PROMPT, {
        data: { promptId },
      }),
    enabled: !!promptId,
  });

  if (isError) {
    return <Navigate to={`/projects`} />;
  }

  const value = {
    prompt: currentPrompt?.prompt,
    isLoading,
  };

  return (
    <CurrentPromptContext.Provider value={value}>
      {children}
    </CurrentPromptContext.Provider>
  );
};
