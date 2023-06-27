import {
  CreateChatCompletionRequest as OpenAICreateChatCompletionRequest,
  CreateCompletionRequest as OpenAICreateCompletionRequest,
} from "openai";
import { PromptExecutionStatus } from "../types";
import { PromptVersion } from "../@generated/graphql/graphql";
import { PezzoInjectedContext } from "./helpers";

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
  getCompletionSettings: getSettingsFn<
    TProviderType,
    PromptExecutionType.Completion
  >;
}

function chatCompletion(options: {
  settings: Record<string, unknown>;
  content: unknown;
  _pezzo: PezzoInjectedContext;
}): OpenAICreateChatCompletionRequest & { _pezzo: PezzoInjectedContext } {
  const { settings, content, _pezzo } = options;
  return {
    _pezzo,
    model: settings["model"] as string,
    ...(settings["modelSettings"] as Record<string, unknown>),
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
  _pezzo: PezzoInjectedContext;
}): OpenAICreateCompletionRequest & { _pezzo: PezzoInjectedContext } {
  const { settings, _pezzo } = options;

  return {
    model: settings["model"] as string,
    _pezzo,
    ...settings,
  };
}

export function getPromptSettings(options: {
  settings: Record<string, unknown>;
  content: string;
  interpolatedContent: string;
  _pezzo: PezzoInjectedContext;
}): Omit<Prompt, "id" | "deployedVersion"> {
  const obj = {
    settings: options.settings,
    content: options.interpolatedContent,
    _pezzo: options._pezzo,
  };

  return {
    getChatCompletionSettings: () => chatCompletion(obj),
    getCompletionSettings: () => completion(obj),
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
