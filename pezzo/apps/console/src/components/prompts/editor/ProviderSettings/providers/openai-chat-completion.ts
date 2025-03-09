import OpenAI from "openai";
import { FormSchema, ProviderSettingsDefinition } from "../types";
import { OpenAIToolkit } from "@pezzo/llm-toolkit";

const { gptModels } = OpenAIToolkit;

type OpenAIProviderSettings = Omit<
  OpenAI.Chat.Completions.CompletionCreateParams,
  "messages"
>;

const defaultSettings: OpenAIProviderSettings = {
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export const generateFormSchema = (
  settings: OpenAIProviderSettings
): FormSchema => {
  const options = Object.keys(gptModels).map((model) => ({
    value: model,
    label: model,
  }));

  const maxResponseTokensValue = gptModels[settings.model].maxTokens;

  return [
    {
      label: "Model",
      name: "model",
      type: "select",
      options,
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
      max: maxResponseTokensValue,
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

export const openAIChatCompletionSettingsDefinition: ProviderSettingsDefinition<OpenAIProviderSettings> =
  {
    defaultSettings,
    generateFormSchema,
  };
