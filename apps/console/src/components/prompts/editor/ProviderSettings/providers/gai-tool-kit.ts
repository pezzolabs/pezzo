import { OpenAIGptCostOptions, OpenAIGptModelSettings } from "./types";

const gaiToolkit = () => {
  const defineModel = <T>(settings: T): T => settings;

  const calculateGptCost = ({
                              model,
                              promptTokens,
                              completionTokens,
                            }: OpenAIGptCostOptions & { model: keyof typeof gptModels }) => {
    const promptCost =
      (promptTokens / 1000) * gptModels[model].promptCostPer1000Tokens;
    const completionCost =
      (completionTokens / 1000) * gptModels[model].completionsCostPer1000Tokens;

    return {
      promptCost,
      completionCost,
    };
  };

  const gptModels = {
    /**
     * GPT-3.5
     */
    ["gpt-3.5-turbo"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.0015,
      completionsCostPer1000Tokens: 0.002,
      maxTokens: 4096,
    }),
    ["gpt-3.5-turbo-16k"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.003,
      completionsCostPer1000Tokens: 0.004,
      maxTokens: 16385,
    }),
    // New GPT-3.5 turbo model (Novermber 2023)
    ["gpt-3.5-turbo-1106"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.0010,
      completionsCostPer1000Tokens: 0.0020,
      maxTokens: 4096,
    }),
    ["gpt-3.5-turbo-instruct"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.0015,
      completionsCostPer1000Tokens: 0.0020,
      maxTokens: 4096,
    }),
    ["gpt-3.5-turbo-0125"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.0010,
      completionsCostPer1000Tokens: 0.0020,
      maxTokens: 4096,
    }),
    /**
     * GPT-4
     */
    ["gpt-4"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.03,
      completionsCostPer1000Tokens: 0.06,
      maxTokens: 8192,
    }),
    ["gpt-4-turbo"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.06,
      completionsCostPer1000Tokens: 0.12,
      maxTokens: 4096,
    }),
    ["gpt-4-32k"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.06,
      completionsCostPer1000Tokens: 0.12,
      maxTokens: 32768,
    }),
    // Same as above
    ["gpt-4-1106-preview"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["gpt-4-0125-preview"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    // Same as above
    ["gpt-4-vision-preview"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    /**
     * claude
     */
    ["claude-3-haiku-20240307"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-sonnet-20240229"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-opus-20240229"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-haiku-20240307-bedrock"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-sonnet-20240229-bedrock"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-opus-20240229-bedrock"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    /**
     * gemini
     */
    ["gemini-pro"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 2048,
    }),
    ["gemini-1.5-pro-preview-0409"]: defineModel<OpenAIGptModelSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 8192,
    }),
  };

  return {
    calculateGptCost,
    gptModels,
  };
};

export const GaiToolkit = gaiToolkit();
