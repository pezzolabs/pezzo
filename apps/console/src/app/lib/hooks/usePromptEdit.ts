import { OpenAIChatSettings, defaultOpenAIChatSettings } from "@pezzo/common";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { useCurrentPrompt } from "../providers/CurrentPromptContext";
import { PromptModes } from "@pezzo/graphql";

export type PromptEditFormInputs = {
  content: string;
  settings: OpenAIChatSettings;
};

function findVariables(text: string): Record<string, null> {
  const regex = /\{\{([\w\s]+)\}\}/g;
  const matches = text.match(regex);
  const interpolatableValues = matches
    ? matches.map((match) => match.replace(/[{}]/g, ""))
    : [];
  const uniqueValues = Array.from(new Set(interpolatableValues));
  const interpolatableObject: Record<string, null> = {};
  uniqueValues.forEach((value) => {
    interpolatableObject[value] = null;
  });
  return interpolatableObject;
}

export const draftPromptData = {
  content: "Start typing your prompt here...",
  mode: PromptModes.Chat,
  settings: defaultOpenAIChatSettings,
};

export const usePromptEdit = () => {
  const { currentPromptVersion, isDraft } = useCurrentPrompt();
  const [form] = Form.useForm<PromptEditFormInputs>();
  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const versionInitialSnapshot = isDraft
    ? draftPromptData
    : currentPromptVersion;
  const [content, setContent] = useState<string>(
    versionInitialSnapshot.content
  );

  const handleFormValuesChange = () => {
    const { content } = form.getFieldsValue(true);
    const touched = form.isFieldsTouched(["content", "settings"]);
    setIsFormTouched(touched);
    setContent(content);

    const variables = findVariables(content);
    setVariables(variables);
  };

  useEffect(() => {
    if (content) {
      const variables = findVariables(content);
      setVariables(variables);
    }
  }, [content]);

  const setVariable = (key: string, value: string) => {
    const newVariables = { ...variables };
    newVariables[key] = value;
    setVariables(newVariables);
  };

  const isPromptChanged = () => {
    const contentChanged = content !== versionInitialSnapshot.content;
    const settingsChanged =
      JSON.stringify(form.getFieldValue("settings")) !==
      JSON.stringify(versionInitialSnapshot.settings);
    return contentChanged || settingsChanged;
  };

  return {
    form,
    handleFormValuesChange,
    isSaveDisabled: !isFormTouched,
    isSaving: false,
    isChangesToCommit: isPromptChanged(),
    variables,
    setVariable,
  };
};
