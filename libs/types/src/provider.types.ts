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
};

export const promptProvidersMapping = {
  [PromptService.OpenAIChatCompletion]: {
    name: "OpenAI Chat Completion",
    provider: Provider.OpenAI,
    defaultSettings: {},
  },
  [PromptService.AzureOpenAIChatCompletion]: {
    name: "Azure OpenAI Chat Completion",
    provider: Provider.Azure,
    defaultSettings: {},
  },
}