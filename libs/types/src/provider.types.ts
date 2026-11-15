export enum PromptService {
  OpenAIChatCompletion = "OpenAIChatCompletion",
  AzureOpenAIChatCompletion = "AzureOpenAIChatCompletion",
  AnthropicCompletion = "AnthropicCompletion",
  MiniMaxChatCompletion = "MiniMaxChatCompletion",
}

export enum Provider {
  OpenAI = "OpenAI",
  Azure = "Azure",
  Anthropic = "Anthropic",
  MiniMax = "MiniMax",
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
  [Provider.MiniMax]: {
    name: "MiniMax",
  },
};

export const promptProvidersMapping = {
  [PromptService.OpenAIChatCompletion]: {
    name: "OpenAI Chat Completion",
    provider: Provider.OpenAI,
    defaultSettings: {},
  },
  [PromptService.AzureOpenAIChatCompletion]: {
    name: "Azure OpenAI (Coming Soon)",
    provider: Provider.Azure,
    defaultSettings: {},
  },
  [PromptService.AnthropicCompletion]: {
    name: "Anthropic (Coming Soon)",
    provider: Provider.Anthropic,
    defaultSettings: {},
  },
  [PromptService.MiniMaxChatCompletion]: {
    name: "MiniMax Chat Completion",
    provider: Provider.MiniMax,
    defaultSettings: {},
  },
};
