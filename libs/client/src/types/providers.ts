import {
  CreateChatCompletionRequest as OpenAICreateChatCompletionRequest,
  CreateCompletionRequest as OpenAICreateCompletionRequest,
} from "openai/dist/api";

export enum ProviderType {
  OpenAI = "OpenAI",
}

export enum PromptExecutionType {
  ChatCompletion = "ChatCompletion",
  Completion = "Completion",
}

export type OpenAIProviderSettings = {
  [PromptExecutionType.Completion]: OpenAICreateCompletionRequest;
  [PromptExecutionType.ChatCompletion]: OpenAICreateChatCompletionRequest;
};
