import { createContext, useContext, useState } from "react";
import {
  PromptVersionFormInputs,
  usePromptVersionEditorContext,
} from "./PromptVersionEditorContext";
import { Form, FormInstance } from "antd";
import { useTestPrompt } from "~/graphql/hooks/mutations";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { useCurrentPrompt } from "./CurrentPromptContext";
import { RequestReport } from "~/@generated/graphql/graphql";

interface PromptTesterContextValue {
  isOpen: boolean;
  openTestModal: (value: PromptVersionFormInputs) => void;
  closeTestModal: () => void;
  testVariablesForm: FormInstance<Record<string, string>>;
  runTest: () => void;
  isTestLoading: boolean;
  testError: any;
  testResult: RequestReport;
}

const PromptTesterContext = createContext<PromptTesterContextValue>({
  isOpen: undefined,
  openTestModal: () => void 0,
  closeTestModal: () => void 0,
  testVariablesForm: undefined,
  runTest: () => void 0,
  isTestLoading: undefined,
  testError: undefined,
  testResult: undefined,
});

export const usePromptTester = () => {
  return useContext(PromptTesterContext);
};

export const PromptTesterProvider = ({ children }) => {
  const { prompt } = useCurrentPrompt();
  const { project } = useCurrentProject();
  const {
    mutate: testPrompt,
    isLoading: isTestLoading,
    error: testError,
    data,
    reset,
  } = useTestPrompt();
  const { formValues, promptType } = usePromptVersionEditorContext();
  const [isOpen, setIsOpen] = useState(false);
  const [testVariablesForm] = Form.useForm<Record<string, string>>();

  const handleOpenTestModal = () => {
    setIsOpen(true);
  };

  const handleCloseTestModal = () => {
    setIsOpen(false);
    reset();
  };

  const handleRunTest = async () => {
    const { content, settings } = formValues;
    const variables = testVariablesForm.getFieldsValue();

    testPrompt({
      type: promptType,
      content,
      settings,
      variables,
      projectId: project.id,
      promptId: prompt.id,
    });
  };

  const value = {
    isOpen,
    openTestModal: handleOpenTestModal,
    closeTestModal: handleCloseTestModal,
    testVariablesForm,
    runTest: handleRunTest,
    isTestLoading,
    testError: testError?.response.errors[0].message,
    testResult: data?.testPrompt,
  };

  return (
    <PromptTesterContext.Provider value={value}>
      {children}
    </PromptTesterContext.Provider>
  );
};
