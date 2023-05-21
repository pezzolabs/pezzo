import { createContext, useContext, useState } from "react";
import { OpenAIChatSettings } from "@pezzo/common";
import { TEST_PROMPT } from "../../graphql/mutations/prompts";
import { gqlClient } from "../graphql";
import { GetPromptExecutionQuery, PromptExecution } from "@pezzo/graphql";
import { TestPromptResult } from "@pezzo/client";
import { useCurrentPrompt } from "./CurrentPromptContext";
import { useCurrentProject } from "./CurrentProjectContext";

export interface PromptTestInput {
  content: string;
  settings: OpenAIChatSettings;
  variables: Record<string, string>;
}

interface PromptTesterContextValue {
  openTester: () => void;
  closeTester: () => void;
  isTesterOpen: boolean;
  runTest: (input: PromptTestInput) => Promise<void>;
  testResult: Partial<GetPromptExecutionQuery["promptExecution"]>;
  isTestInProgress: boolean;
  loadTestResult: (
    data: Partial<GetPromptExecutionQuery["promptExecution"]>
  ) => void;
}

const CurrentPromptContext = createContext<PromptTesterContextValue>({
  openTester: () => void 0,
  closeTester: () => void 0,
  isTesterOpen: false,
  runTest: () => void 0,
  testResult: undefined,
  isTestInProgress: false,
  loadTestResult: () => void 0,
});

export const usePromptTester = () => {
  return useContext(CurrentPromptContext);
};

export const PromptTesterProvider = ({ children }) => {
  const { project } = useCurrentProject();
  const [isTesterOpen, setIsTesterOpen] = useState<boolean>(false);
  const [testResult, setTestResult] =
    useState<Partial<TestPromptResult>>(undefined);
  const [isTestInProgress, setIsTestInProgress] = useState<boolean>(false);
  const { integration } = useCurrentPrompt();

  const value = {
    isTesterOpen,
    setIsTesterOpen,
    openTester: () => {
      setIsTesterOpen(true);
    },
    closeTester: () => {
      setTestResult(null);
      setIsTesterOpen(false);
    },
    runTest: async (input: PromptTestInput) => {
      setIsTestInProgress(true);
      const result = await gqlClient.request(TEST_PROMPT, {
        data: {
          projectId: project.id,
          integrationId: integration.id,
          content: input.content,
          settings: input.settings,
          variables: input.variables,
        },
      });
      setTestResult(result.testPrompt);
      setIsTestInProgress(false);
    },
    testResult,
    isTestInProgress: isTestInProgress,
    loadTestResult: (data: Partial<PromptExecution>) => {
      setTestResult(data);
    },
  };

  return (
    <CurrentPromptContext.Provider value={value}>
      {children}
    </CurrentPromptContext.Provider>
  );
};
