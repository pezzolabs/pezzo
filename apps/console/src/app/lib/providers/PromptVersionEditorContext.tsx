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
  PromptService,
  PromptType,
} from "../../../@generated/graphql/graphql";
import { Form, FormInstance } from "antd";
import { useGetPromptVersion } from "../../graphql/hooks/queries";
import { openAIChatCompletionSettingsDefinition } from "../../components/prompts/editor/ProviderSettings/providers/openai-chat-completion";
import { getServiceDefaultSettings } from "../../components/prompts/editor/ProviderSettings/providers";

interface FormInputs {
  service: PromptService;
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
  formValues: FormInputs;
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
      const service = PromptService.OpenAiChatCompletion;
      const settings = getServiceDefaultSettings(service);

      initialValues.current = {
        service,
        settings,
        content:
          prompt.type === PromptType.Prompt ? { prompt: "" } : { messages: [] },
      };
    }

    if (isFetched && currentVersion) {
      initialValues.current = {
        service: currentVersion.service,
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
    formValues,
  };

  return (
    <PromptVersionEditorContext.Provider value={value}>
      <Form layout="vertical" form={form} initialValues={initialValues.current}>
        {children}
      </Form>
    </PromptVersionEditorContext.Provider>
  );
};
