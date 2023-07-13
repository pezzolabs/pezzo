import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCurrentPrompt } from "./CurrentPromptContext";
import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "../graphql";
import { GET_PROMPT_VERSION } from "../../graphql/definitions/queries/prompts";
import {
  GetPromptVersionQuery,
  PromptType,
} from "../../../@generated/graphql/graphql";
import { Form, FormInstance } from "antd";

interface PromptVersionEditorContext {
  hasChangesToCommit: boolean;
  isPublishEnabled: boolean;
  currentVersionSha: string;
  setCurrentVersionSha: (sha: string) => void;
  currentVersion: GetPromptVersionQuery["promptVersion"];
  isDraft: boolean;
  isFetched: boolean;
  form: FormInstance;
  initialValues: any;
}

const PromptVersionEditorContext =
  createContext<PromptVersionEditorContext>(null);

export const usePromptVersionEditorContext = () => {
  return useContext(PromptVersionEditorContext);
};

export const PromptVersionEditorProvider = ({ children }) => {
  const { prompt } = useCurrentPrompt();
  const [form] = Form.useForm();
  const formValues = Form.useWatch(null, { form, preserve: true });
  const [currentVersionSha, setCurrentVersionSha] = useState<string>(
    prompt?.latestVersion?.sha
  );
  const initialValues = useRef(undefined);
  const isDraft = !prompt?.latestVersion;

  const { data, isFetched } = useQuery({
    queryKey: ["prompt", prompt.id, "currentVersion", currentVersionSha],
    queryFn: () =>
      gqlClient.request(GET_PROMPT_VERSION, {
        data: { sha: currentVersionSha },
      }),
    enabled: !!prompt && !!currentVersionSha,
  });

  const currentVersion = data?.promptVersion;

  useEffect(() => {
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

    form.setFieldsValue(initialValues.current);
  }, [currentVersion, isFetched, form, prompt, isDraft]);

  const isPublishEnabled = !isDraft;

  const checkForChangesToCommit = () => {
    const initialStringified = JSON.stringify(initialValues.current);
    const currentStringified = JSON.stringify(formValues);
    return initialStringified !== currentStringified;
  };

  const value = {
    isFetched,
    hasChangesToCommit: checkForChangesToCommit(),
    isPublishEnabled,
    currentVersionSha,
    setCurrentVersionSha,
    currentVersion,
    isDraft,
    form,
    initialValues,
  };

  return (
    <PromptVersionEditorContext.Provider value={value}>
      <Form form={form} initialValues={initialValues.current}>
        {children}
      </Form>
    </PromptVersionEditorContext.Provider>
  );
};
