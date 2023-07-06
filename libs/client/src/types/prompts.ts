import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest as OpenAICreateChatCompletionRequest,

} from "openai";
import { PezzoInjectedContext } from "./function-extension";
import {
  OpenAIProviderSettings,
  PromptExecutionType,
  ProviderType,
} from "./providers";

export type PromptSettings<
  TProviderType extends ProviderType = ProviderType.OpenAI,
  TExecutionType extends PromptExecutionType = PromptExecutionType.ChatCompletion
> = TProviderType extends ProviderType.OpenAI
  ? OpenAIProviderSettings[TExecutionType]
  : unknown;

type getSettingsFn<
  TProviderType extends ProviderType = ProviderType.OpenAI,
  TExecutionType extends PromptExecutionType = PromptExecutionType.ChatCompletion
> = (
  overrides?: Partial<PromptSettings<TProviderType, TExecutionType>>
) => PromptSettings<TProviderType, TExecutionType>;

export type PromptVariables = Record<string, string | number | boolean>;

export interface Prompt<
  TProviderType extends ProviderType = ProviderType.OpenAI
> {
  id: string;
  deployedVersion: string;
  getChatCompletionSettings: getSettingsFn<
    TProviderType,
    PromptExecutionType.ChatCompletion
  >;
}

function chatCompletion(options: {
  settings: Record<string, unknown>;
  messages: ChatCompletionRequestMessage[];
  _pezzo: PezzoInjectedContext;
}): OpenAICreateChatCompletionRequest & { pezzo: PezzoInjectedContext } {
  const { settings, messages, _pezzo } = options;

  const { messages: _, ...rest } = settings as unknown as OpenAICreateChatCompletionRequest;

  return {
    pezzo: _pezzo,
    model: settings["model"] as string,
    ...rest,
    messages,
  };
}

export function getPromptSettings(options: {
  settings: Record<string, unknown>;
  content: string;
  interpolatedMessages: ChatCompletionRequestMessage[];
  _pezzo: PezzoInjectedContext;
}): Omit<Prompt, "id" | "deployedVersion"> {

  const obj = {
    settings: options.settings,
    messages: options.interpolatedMessages,
    _pezzo: options._pezzo,
  };

  return {
    getChatCompletionSettings: () => chatCompletion(obj)

  };
}

export interface ReportPromptExecutionResult<TResult> {
  id: string;
  promptId: string;
  status: PromptExecutionStatus;
  result?: TResult;
  totalCost: number;
  totalTokens: number;
  duration: number;
}

export interface TestPromptResult {
  success: boolean;
  result?: string;
  error: string | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptCost: number;
  completionCost: number;
  totalCost: number;
  duration: number;
  content: string;
  interpolatedContent: string;
  settings: any;
  variables: Record<string, boolean | number | string>;
}

export interface IntegrationBaseSettings<T> {
  model: string;
  modelSettings: T;
}

export enum PromptExecutionStatus {
  Success = "Success",
  Error = "Error",
}
