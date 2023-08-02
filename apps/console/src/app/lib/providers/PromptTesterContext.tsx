import { createContext, useContext, useState } from "react";
import {
  PromptVersionFormInputs,
  usePromptVersionEditorContext,
} from "./PromptVersionEditorContext";
import { Form, FormInstance } from "antd";
import { useTestPrompt } from "../../graphql/hooks/mutations";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { useCurrentPrompt } from "./CurrentPromptContext";
import { RequestReport } from "../../../@generated/graphql/graphql";

interface PromptTesterContextValue {
  isOpen: boolean;
  openTestModal: (value: PromptVersionFormInputs) => void;
  closeTestModal: () => void;
  testVariablesForm: FormInstance<Record<string, string>>;
  runTest: () => void;
  isTestLoading: boolean;
  testResult: RequestReport;
}

const PromptTesterContext = createContext<PromptTesterContextValue>({
  isOpen: undefined,
  openTestModal: () => void 0,
  closeTestModal: () => void 0,
  testVariablesForm: undefined,
  runTest: () => void 0,
  isTestLoading: undefined,
  testResult: undefined,
});

export const usePromptTester = () => {
  return useContext(PromptTesterContext);
};

export const PromptTesterProvider = ({ children }) => {
  const { prompt } = useCurrentPrompt();
  const { project } = useCurrentProject();
  const { mutateAsync: testPrompt, isLoading: isTestLoading } = useTestPrompt();
  const { form: promptVersionForm } = usePromptVersionEditorContext();
  const [isOpen, setIsOpen] = useState(false);
  const [testVariablesForm] = Form.useForm<Record<string, string>>();
  const [testResult, setTestResult] = useState<RequestReport>(null);

  const handleOpenTestModal = () => {
    setIsOpen(true);
  };

  const handleCloseTestModal = () => {
    setIsOpen(false);
    setTestResult(null);
  };

  const handleRunTest = async () => {
    const { content, settings } = promptVersionForm.getFieldsValue();
    const variables = testVariablesForm.getFieldsValue();

    const { testPrompt: result } = await testPrompt({
      content,
      settings,
      variables,
      projectId: project.id,
      promptId: prompt.id,
    });
    setTestResult(result);
  };

  const value = {
    isOpen,
    openTestModal: handleOpenTestModal,
    closeTestModal: handleCloseTestModal,
    testVariablesForm,
    runTest: handleRunTest,
    isTestLoading,
    testResult,
  };

  return (
    <PromptTesterContext.Provider value={value}>
      {children}
    </PromptTesterContext.Provider>
  );
};
