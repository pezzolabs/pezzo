import { CreateChatCompletionRequest as OpenAICreateChatCompletionRequest } from "openai";

export enum ProviderType {
  OpenAI = "OpenAI",
}

export enum PromptExecutionType {
  ChatCompletion = "ChatCompletion",
}

export type OpenAIProviderSettings = {
  [PromptExecutionType.ChatCompletion]: OpenAICreateChatCompletionRequest;
};
