import OpenAI from "openai";
import { FormSchema, ProviderSettingsDefinition } from "../types";

type OpenAIProviderSettings = Omit<
  OpenAI.Chat.Completions.CompletionCreateParams,
  "messages"
>;

const defaultSettings: OpenAIProviderSettings = {
  model: "gpt-35-turbo",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

const generateFormSchema = (settings: OpenAIProviderSettings): FormSchema => {
  const getMaxResponseTokensMaxValue = () => {
    switch (settings.model) {
      case "gpt-35-turbo":
        return 8192;
      case "gpt-4":
        return 4096;
    }
  };

  return [
    {
      label: "Model",
      name: "model",
      type: "select",
      options: [
        { value: "gpt-35-turbo", label: "gpt-35-turbo" },
        { value: "gpt-4", label: "gpt-4" },
      ],
    },
    {
      label: "Temperature",
      name: "temperature",
      type: "slider",
      min: 0,
      max: 1,
      step: 0.1,
    },
    {
      label: "Max Response Length",
      name: "max_tokens",
      type: "slider",
      min: 1,
      max: getMaxResponseTokensMaxValue(),
      step: 1,
    },
    {
      label: "Top P",
      name: "top_p",
      type: "slider",
      min: 0,
      max: 1,
      step: 0.1,
    },
    {
      label: "Frequency Penalty",
      name: "frequency_penalty",
      type: "slider",
      min: 0,
      max: 1,
      step: 0.1,
    },
    {
      label: "Presence Penalty",
      name: "presence_penalty",
      type: "slider",
      min: 0,
      max: 1,
      step: 0.1,
    },
  ];
};

export const azureOpenAIChatCompletionSettingsDefinition: ProviderSettingsDefinition<OpenAIProviderSettings> =
  {
    defaultSettings,
    generateFormSchema,
  };
