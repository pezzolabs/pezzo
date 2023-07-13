import {
  MutableRefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCurrentPrompt } from "./CurrentPromptContext";
import {
  GetPromptVersionQuery,
  PromptType,
} from "../../../@generated/graphql/graphql";
import { Form, FormInstance } from "antd";
import { useGetPromptVersion } from "../../graphql/hooks/queries";

interface FormInputs {
  settings: any;
  content: any;
}

interface PromptVersionEditorContext {
  hasChangesToCommit: boolean;
  isPublishEnabled: boolean;
  currentVersionSha: string;
  setCurrentVersionSha: (sha: string) => void;
  currentVersion: GetPromptVersionQuery["promptVersion"];
  isDraft: boolean;
  isFetched: boolean;
  form: FormInstance;
  initialValues: MutableRefObject<FormInputs>;
  variables: string[];
  setVariables: (variables: string[]) => void;
}

const PromptVersionEditorContext =
  createContext<PromptVersionEditorContext>(null);

export const usePromptVersionEditorContext = () => {
  return useContext(PromptVersionEditorContext);
};

export const PromptVersionEditorProvider = ({ children }) => {
  const { prompt } = useCurrentPrompt();
  const [form] = Form.useForm<FormInputs>();
  const formValues = Form.useWatch(null, { form, preserve: true });
  const initialValues = useRef<FormInputs>(undefined);
  const isDraft = !prompt?.latestVersion;
  const [currentVersionSha, setCurrentVersionSha] = useState<string>(
    prompt?.latestVersion?.sha
  );
  const [variables, setVariables] = useState<string[]>([]);

  const { promptVersion: currentVersion, isFetched } = useGetPromptVersion(
    { promptId: prompt.id, promptVersionSha: currentVersionSha },
    {
      enabled: !!prompt && !!currentVersionSha,
    }
  );

  useEffect(() => {
    // Take a snapshot of the initial values.
    // This will then be used to determine if there are changes to commit.
    if (isDraft) {
      initialValues.current = {
        settings: {},
        content:
          prompt.type === PromptType.Prompt ? { prompt: "" } : { messages: [] },
      };
    }

    if (isFetched && currentVersion) {
      initialValues.current = {
        settings: currentVersion.settings,
        content: currentVersion.content,
      };
    }

    // Set the form values to the initial values.
    form.setFieldsValue(initialValues.current);
  }, [currentVersion, isFetched, form, prompt, isDraft]);

  const checkForChangesToCommit = () => {
    const initialStringified = JSON.stringify(initialValues.current);
    const currentStringified = JSON.stringify(formValues);
    return initialStringified !== currentStringified;
  };

  const value = {
    isFetched,
    hasChangesToCommit: checkForChangesToCommit(),
    isPublishEnabled: !isDraft,
    currentVersionSha,
    setCurrentVersionSha,
    currentVersion,
    isDraft,
    form,
    initialValues,
    variables,
    setVariables,
  };

  return (
    <PromptVersionEditorContext.Provider value={value}>
      <Form form={form} initialValues={initialValues.current}>
        {children}
      </Form>
    </PromptVersionEditorContext.Provider>
  );
};
