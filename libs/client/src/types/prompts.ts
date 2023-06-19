import {
  CreateChatCompletionRequest as OpenAICreateChatCompletionRequest,
  CreateCompletionRequest as OpenAICreateCompletionRequest,
} from "openai";

export enum PromptExecutionType {
  ChatCompletion = "ChatCompletion",
  Completion = "Completion",
}

export type OpenAIProviderSettings = {
  [PromptExecutionType.Completion]: OpenAICreateCompletionRequest;
  [PromptExecutionType.ChatCompletion]: OpenAICreateChatCompletionRequest;
};

export enum ProviderType {
  OpenAI = "OpenAI",
}

export type PromptSettings<
  TProviderType extends ProviderType = ProviderType.OpenAI,
  TExecutionType extends PromptExecutionType = PromptExecutionType.Completion
> = TProviderType extends ProviderType.OpenAI
  ? OpenAIProviderSettings[TExecutionType]
  : unknown;

type getSettingsFn<
  TProviderType extends ProviderType = ProviderType.OpenAI,
  TExecutionType extends PromptExecutionType = PromptExecutionType.Completion
> = (
  overrides?: Partial<PromptSettings<TProviderType, TExecutionType>>
) => PromptSettings<TProviderType, TExecutionType>;

export interface Prompt<
  TProviderType extends ProviderType = ProviderType.OpenAI
> {
  id: string;
  deployedVersion: string;
  getChatCompletionSettings: getSettingsFn<
    TProviderType,
    PromptExecutionType.ChatCompletion
  >;
  getCompletionSettings: getSettingsFn<
    TProviderType,
    PromptExecutionType.Completion
  >;
}

function chatCompletion(options: {
  settings: Record<string, unknown>;
  content: unknown;
}): OpenAICreateChatCompletionRequest {
  const { settings, content } = options;
  return {
    model: settings["model"] as string,
    ...settings["modelSettings"] as Record<string, unknown>,
    messages: [
      {
        role: "user",
        content: content as string,
      },
    ],
  };
}

function completion(options: {
  settings: Record<string, unknown>;
  content: unknown;
}): OpenAICreateChatCompletionRequest {
  const { settings } = options;
  return settings as unknown as OpenAICreateChatCompletionRequest;
}

export function getPromptSettings(options: {
  settings: Record<string, unknown>;
  content: unknown;
}): Omit<Prompt, "id" | "deployedVersion"> {
  return {
    getChatCompletionSettings: (overrides) =>
      chatCompletion({ ...options, ...overrides}),
    getCompletionSettings: (overrides) =>
      completion({ ...options, ...overrides }),
  };
}
