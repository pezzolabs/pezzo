import { OpenAIToolkit } from "@pezzo/llm-toolkit";
import { Provider } from "./provider.types";
import { Type } from "class-transformer";
import { AllPrimitiveTypes, Primitive, RecursiveObject } from "./ts-helpers";
import OpenAI from "openai";
import { PromptExecutionType } from "./prompt-execution-type";

type ExtractModelNames<T> = T extends { model: infer M } ? M : never;
export type AcceptedModels = ExtractModelNames<
  Parameters<typeof OpenAIToolkit.calculateGptCost>[0]
>;

export type ObservabilityReportProperties = RecursiveObject<Primitive>;
export type ObservabilityReportMetadata = {
  provider: string;
  model: string;
  modelAuthor: string;
  client?: string;
  clientVersion?: string;
  environment: string;
  type: PromptExecutionType;
  [key: string]: AllPrimitiveTypes;
};

export class GenericObservabilityRequestResponseBody {
  [key: string]: AllPrimitiveTypes;
}

export class OpenAIObservabilityRequestBody
  implements Partial<OpenAI.Chat.Completions.ChatCompletion>
{
  model: AcceptedModels;
  messages: OpenAI.Chat.CompletionCreateParams["messages"];
  max_tokens: number;
  temperature: number;
  top_p: number;
}

export class OpenAIObservabilityResponseBody
  implements OpenAI.Chat.Completions.ChatCompletion
{
  object: OpenAI.Chat.Completions.ChatCompletion["object"];
  id: string;
  created: number;
  model: AcceptedModels;
  choices: OpenAI.Chat.Completions.ChatCompletion["choices"];
  completion: string;
  stream: boolean;
  stop: string;
  usage?: OpenAI.Chat.Completions.ChatCompletion["usage"];
  error?: AllPrimitiveTypes;
}

export class ObservabilityRequest<
  TProviderType extends Provider | unknown = unknown
> {
  timestamp: string;
  @Type((opts) =>
    opts?.object["provider"] === Provider.OpenAI
      ? OpenAIObservabilityRequestBody
      : GenericObservabilityRequestResponseBody
  )
  body: TProviderType extends Provider.OpenAI
    ? OpenAIObservabilityRequestBody
    : GenericObservabilityRequestResponseBody;
}

export class ObservabilityResponse<
  TProviderType extends Provider | unknown = unknown
> {
  timestamp: string;
  @Type((opts) =>
    opts?.object["provider"] === Provider.OpenAI
      ? OpenAIObservabilityResponseBody
      : GenericObservabilityRequestResponseBody
  )
  body: TProviderType extends Provider.OpenAI
    ? OpenAIObservabilityResponseBody
    : GenericObservabilityRequestResponseBody;
  status: number;
}

export interface ObservabilityResponseBody {
  usage: string;
  [key: string]: AllPrimitiveTypes;
}
