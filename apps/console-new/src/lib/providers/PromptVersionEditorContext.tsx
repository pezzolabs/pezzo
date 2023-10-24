import {
  MutableRefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCurrentPrompt } from "./CurrentPromptContext";
import {
  GetPromptVersionQuery,
  PromptService,
  PromptType,
} from "~/@generated/graphql/graphql";
import { Form, FormInstance } from "antd";
import { useGetPromptVersion } from "~/graphql/hooks/queries";
import { getServiceDefaultSettings } from "~/components/prompts/editor/ProviderSettings/providers";
import stableStringify from "json-stable-stringify";

export interface PromptVersionFormInputs {
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
  initialValues: MutableRefObject<PromptVersionFormInputs>;
  variables: string[];
  setVariables: (variables: string[]) => void;
  formValues: PromptVersionFormInputs;
  promptType: PromptType;
  setPromptType: (type: PromptType) => void;
}

const PromptVersionEditorContext =
  createContext<PromptVersionEditorContext>(null);

export const usePromptVersionEditorContext = () => {
  return useContext(PromptVersionEditorContext);
};

export const PromptVersionEditorProvider = ({ children }) => {
  const { prompt } = useCurrentPrompt();
  const [form] = Form.useForm<PromptVersionFormInputs>();
  const formValues = Form.useWatch(null, { form, preserve: true });
  const [promptType, setPromptType] = useState<PromptType>();

  const initialValues = useRef<PromptVersionFormInputs>(undefined);
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

  const getDefaultContent = useCallback((type: PromptType) => {
    switch (type) {
      case PromptType.Prompt:
        return { prompt: "" };
      case PromptType.Chat:
        return {
          messages: [
            {
              role: "user",
              content: "",
            },
          ],
        };
    }
  }, []);

  useEffect(() => {
    // Take a snapshot of the initial values.
    // This will then be used to determine if there are changes to commit.
    if (isDraft) {
      const service = PromptService.OpenAiChatCompletion;
      const settings = getServiceDefaultSettings(service);

      initialValues.current = {
        service,
        settings,
        content: getDefaultContent(PromptType.Chat),
      };
      setPromptType(PromptType.Chat);
    }

    if (isFetched && currentVersion) {
      initialValues.current = {
        service: currentVersion.service,
        settings: currentVersion.settings,
        content: currentVersion.content,
      };
      setPromptType(currentVersion.type);
    }

    // Set the form values to the initial values.
    form.setFieldsValue(initialValues.current);
  }, [getDefaultContent, currentVersion, isFetched, form, prompt, isDraft]);

  const hasChangesToCommit = useMemo(() => {
    const newValueStringified = stableStringify(formValues);
    const oldValueStringified = stableStringify(initialValues.current);
    const hasChanges = newValueStringified !== oldValueStringified;
    return hasChanges;
  }, [formValues]);

  const handleSetPromptType = (type: PromptType) => {
    setPromptType(type);
    let content;

    if (type === PromptType.Chat) {
      content = {
        messages: [{ role: "user", content: formValues.content.prompt }],
      };
    }

    if (type === PromptType.Prompt) {
      content = { prompt: formValues.content.messages[0].content };
    }

    form.setFieldValue("content", content);

    if (!hasChangesToCommit) {
      initialValues.current.content = content;
    }
  };

  const value = {
    isFetched,
    hasChangesToCommit: hasChangesToCommit,
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
    promptType,
    setPromptType: handleSetPromptType,
  };

  return (
    <PromptVersionEditorContext.Provider value={value}>
      <Form layout="vertical" form={form} initialValues={initialValues.current}>
        {children}
      </Form>
    </PromptVersionEditorContext.Provider>
  );
};
