import { Form } from "antd";
import { useEffect, useState } from "react";
import { useCurrentPrompt } from "../providers/CurrentPromptContext";
import { getIntegration } from "@pezzo/integrations";

export type PromptEditFormInputs = {
  content: string;
  settings: any;
};

function findVariables(text: string): Record<string, null> {
  const regex = /\{([\w\s]+)\}/g;
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

export const getDraftPromptData = (integrationId: string) => {
  return {
    content: "Start typing your prompt here...",
    settings: getIntegration(integrationId).defaultSettings,
  };
};

export const usePromptEdit = () => {
  const { prompt, currentPromptVersion, isDraft } = useCurrentPrompt();
  const [form] = Form.useForm<PromptEditFormInputs>();
  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const versionInitialSnapshot = isDraft
    ? getDraftPromptData(prompt.integrationId)
    : currentPromptVersion;
  const [content, setContent] = useState<string>(
    versionInitialSnapshot.content
  );

  const handleFormValuesChange = () => {
    const { content } = form.getFieldsValue(true);
    const touched = form.isFieldsTouched(["content", "settings"]);
    setIsFormTouched(touched);
    setContent(content);

    setVariables((oldVarialbes) => {
      const newVariables = findVariables(content);
      const mappedVariables = Object.keys(newVariables).reduce<
        Record<string, string | null>
      >((acc, key: string) => {
        if (oldVarialbes[key]) {
          acc[key] = oldVarialbes[key];
        }

        return acc;
      }, newVariables);
      return mappedVariables;
    });
  };

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
