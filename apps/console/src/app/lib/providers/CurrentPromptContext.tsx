import { createContext, useContext } from "react";
import { GetPromptQuery } from "../../../@generated/graphql/graphql";
import { Navigate, useParams } from "react-router-dom";
import { useGetPrompt } from "../../graphql/hooks/queries";

interface CurrentPromptContextValue {
  prompt: GetPromptQuery["prompt"];
  promptId: string;
  isLoading: boolean;
}

const CurrentPromptContext = createContext<CurrentPromptContextValue>({
  prompt: undefined,
  promptId: undefined,
  isLoading: false,
});

export const useCurrentPrompt = () => {
  return useContext(CurrentPromptContext);
};

export const CurrentPromptProvider = ({ children }) => {
  const { promptId } = useParams();
  const { prompt, isError, isLoading } = useGetPrompt(promptId, {
    enabled: !!promptId,
  });

  if (isError) {
    return <Navigate to={`/projects`} />;
  }

  const value = {
    prompt,
    promptId,
    isLoading,
  };

  return (
    <CurrentPromptContext.Provider value={value}>
      {children}
    </CurrentPromptContext.Provider>
  );
};
