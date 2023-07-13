import { Form } from "antd";
import { useEffect, useRef, useState } from "react";
import { useCurrentPrompt } from "../providers/CurrentPromptContext";
import { defaultOpenAISettings } from "../model-providers";

export type PromptVersionContent = {
  prompt?: string;
  messages?: {
    role: "user" | "assistant";
    content: string;
  }[];
};

export type PromptEditFormInputs = {
  settings: any;
  content: any; // TODO
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

export const usePromptVersionEditor = () => {
  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const [content, setContent] = useState<any>({});

  // const versionInitialSnapshot = isDraft
  //   ? defaultOpenAISettings
  //   : currentPromptVersion.settings;

  const setVariable = (key: string, value: string) => {
    const newVariables = { ...variables };
    newVariables[key] = value;
    setVariables(newVariables);
  };

  const checkHasChangesToCommit = () => {
    return true;
  };

  return {
    isSaveDisabled: !isFormTouched,
    hasChangesToCommit: checkHasChangesToCommit(),
    isSaving: false,
    variables,
    setVariable,
    content,
    setContent,
  };
};
