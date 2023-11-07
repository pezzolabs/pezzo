import { createContext, useContext, useEffect, useState } from "react";
import { useTestPrompt } from "~/graphql/hooks/mutations";
import { useCurrentProject } from "../hooks/useCurrentProject";
import { useCurrentPrompt } from "./CurrentPromptContext";
import { RequestReport } from "~/@generated/graphql/graphql";
import { EditorFormInputs, useEditorContext } from "./EditorContext";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.record(z.string(), z.string().min(1));

export type PromptTesterVariablesInputs = z.infer<typeof formSchema>;

interface PromptTesterContextValue {
  isOpen: boolean;
  openTestModal: (value: EditorFormInputs) => void;
  closeTestModal: () => void;
  testVariablesForm: UseFormReturn<z.infer<typeof formSchema>>;
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
  const { getForm, variables } = useEditorContext();
  const editorForm = getForm();
  const [isOpen, setIsOpen] = useState(false);

  const testVariablesForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const currentValues = testVariablesForm.getValues();
    const variablesRecord: z.infer<typeof formSchema> = {};

    for (const variableName of variables) {
      variablesRecord[variableName] = currentValues[variableName] || "";
    }

    testVariablesForm.reset({
      ...variablesRecord,
    });
  }, [prompt, variables, testVariablesForm]);

  const handleOpenTestModal = () => {
    setIsOpen(true);
  };

  const handleCloseTestModal = () => {
    setIsOpen(false);
    reset();
  };

  const runTest = async () => {
    const variables = testVariablesForm.getValues();
    const { type, content, settings } = editorForm.getValues();

    testPrompt({
      type,
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
    runTest,
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
