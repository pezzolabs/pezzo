import { Form } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCurrentPrompt } from "../providers/CurrentPromptContext";
import { getIntegration } from "@pezzo/integrations";
import { defaultOpenAISettings } from "../model-providers";

export type PromptEditFormInputs = {
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
    content: "",
    settings: getIntegration(integrationId).defaultSettings,
  };
};

export const usePromptEdit = () => {
  const { currentPromptVersion, isDraft } = useCurrentPrompt();
  const [form] = Form.useForm<PromptEditFormInputs>();
  const isFirstRunRef = useRef(true);
  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const versionInitialSnapshot = isDraft
    ? defaultOpenAISettings
    : currentPromptVersion.settings;

  const handleFormValuesChange = () => {
    const touched = form.isFieldsTouched(["settings"]);
    setIsFormTouched(touched);
    const messages = form.getFieldValue("settings").messages;
    setVariables((oldVarialbes) => {
      const newVariables = messages
        .filter((message) => message.content)
        .map((message) => findVariables(message.content))
        .reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

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

  useEffect(() => {
    if (!isFirstRunRef.current) return;
    isFirstRunRef.current = false;
    const messages = form.getFieldValue("settings").messages;
    const newVariables = messages
      .map((message) => findVariables(message.content))
      .reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

    if (Object.keys(newVariables).length === 0) return;

    setVariables(newVariables);
  }, [form]);

  const setVariable = (key: string, value: string) => {
    const newVariables = { ...variables };
    newVariables[key] = value;
    setVariables(newVariables);
  };

  return {
    form,
    handleFormValuesChange,
    isSaveDisabled: !isFormTouched,
    hasChangesToCommit:
      JSON.stringify(form.getFieldValue("settings")) !==
      JSON.stringify(versionInitialSnapshot),
    isSaving: false,
    variables,
    setVariable,
  };
};
