export enum PromptService {
  OpenAIChatCompletion = "OpenAIChatCompletion",
  AzureOpenAIChatCompletion = "AzureOpenAIChatCompletion",
  AnthropicCompletion = "AnthropicCompletion",
}

export enum Provider {
  OpenAI = "OpenAI",
  Azure = "Azure",
  Anthropic = "Anthropic",
}

export const providerDetails = {
  [Provider.OpenAI]: {
    name: "OpenAI",
  },
  [Provider.Azure]: {
    name: "Azure",
  },
  [Provider.Anthropic]: {
    name: "Anthropic",
  },
};

export const promptProvidersMapping = {
  [PromptService.OpenAIChatCompletion]: {
    name: "OpenAI Chat Completion",
    provider: Provider.OpenAI,
    defaultSettings: {},
  },
  [PromptService.AzureOpenAIChatCompletion]: {
    name: "Azure OpenAI (coming soon)",
    provider: Provider.Azure,
    defaultSettings: {},
  },
  [PromptService.AnthropicCompletion]: {
    name: "Anthropic (coming soon)",
    provider: Provider.Anthropic,
    defaultSettings: {},
  },
};
