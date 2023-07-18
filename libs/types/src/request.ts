import { OpenAIToolkit } from "@pezzo/llm-toolkit";
import { Provider } from "./provider.types";
import { Type } from "class-transformer";
import { AllPrimitiveTypes, Primitive, RecursiveObject } from "./ts-helpers";
import {
  CreateChatCompletionResponse,
  CreateChatCompletionResponseChoicesInner,
  CreateCompletionResponseUsage,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessage,
} from "openai";

type ExtractModelNames<T> = T extends { model: infer M } ? M : never;
export type AcceptedModels = ExtractModelNames<
  Parameters<typeof OpenAIToolkit.calculateGptCost>[0]
>;

export type ObservabilityReportProperties = RecursiveObject<Primitive>;
export type ObservabilityReportMetadata = {
  conversationId: string;
  [key: string]: AllPrimitiveTypes;
};

export class GenericObservabilityRequestResponseBody {
  [key: string]: AllPrimitiveTypes;
}

export class OpenAIObservabilityRequestBody
  implements Partial<CreateChatCompletionRequest>
{
  model: AcceptedModels;
  messages: ChatCompletionRequestMessage[];
  max_tokens: number;
  temperature: number;
  top_p: number;
}

export class OpenAIObservabilityResponseBody
  implements CreateChatCompletionResponse
{
  id: string;
  object: string;
  created: number;
  model: AcceptedModels;
  choices: CreateChatCompletionResponseChoicesInner[];
  completion: string;
  stream: boolean;
  stop: string;
  usage?: CreateCompletionResponseUsage;
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
