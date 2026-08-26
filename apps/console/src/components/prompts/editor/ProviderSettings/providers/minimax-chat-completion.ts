import { FormSchema, ProviderSettingsDefinition } from "../types";

interface MiniMaxProviderSettings {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
}

const MINIMAX_MODELS: Record<string, { maxTokens: number }> = {
  "MiniMax-M2.7": { maxTokens: 1048576 },
  "MiniMax-M2.7-highspeed": { maxTokens: 1048576 },
  "MiniMax-M2.5": { maxTokens: 204800 },
  "MiniMax-M2.5-highspeed": { maxTokens: 204800 },
};

const defaultSettings: MiniMaxProviderSettings = {
  model: "MiniMax-M2.7",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
};

const generateFormSchema = (
  settings: MiniMaxProviderSettings
): FormSchema => {
  const options = Object.keys(MINIMAX_MODELS).map((model) => ({
    value: model,
    label: model,
  }));

  const maxResponseTokensValue =
    MINIMAX_MODELS[settings.model]?.maxTokens ?? 204800;

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
      min: 0.01,
      max: 1,
      step: 0.01,
    },
    {
      label: "Max Response Length",
      name: "max_tokens",
      type: "slider",
      min: 1,
      max: Math.min(maxResponseTokensValue, 16384),
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
  ];
};

export const miniMaxChatCompletionSettingsDefinition: ProviderSettingsDefinition<MiniMaxProviderSettings> =
  {
    defaultSettings,
    generateFormSchema,
  };
