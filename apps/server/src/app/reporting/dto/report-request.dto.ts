import { IsEnum, IsObject, IsOptional } from "class-validator";
import {
  AllPrimitiveTypes,
  Primitive,
  RecursiveObject,
} from "../../../lib/ts-helpers";
import { Type } from "class-transformer";
import { OpenAIToolkit } from "@pezzo/llm-toolkit";

export enum ProviderType {
  OpenAI = "OpenAI",
  AI21 = "AI21",
}

export enum PromptExecutionType {
  ChatCompletion = "ChatCompletion",
  Completion = "Completion",
}

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

export class OpenAIObservabilityRequestBody extends GenericObservabilityRequestResponseBody {
  model: AcceptedModels;
}

export class OpenAIObservabilityResponseBody extends GenericObservabilityRequestResponseBody {
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export class ObservabilityRequestDto<
  TProviderType extends ProviderType | unknown = unknown
> {
  timestamp: string;
  @Type((opts) =>
    opts?.object.provider === ProviderType.OpenAI
      ? OpenAIObservabilityRequestBody
      : GenericObservabilityRequestResponseBody
  )
  body: TProviderType extends ProviderType.OpenAI
    ? OpenAIObservabilityRequestBody
    : GenericObservabilityRequestResponseBody;
}


export class ObservabilityResponseDto<
  TProviderType extends ProviderType | unknown = unknown
> {
  timestamp: string;
  @Type((opts) =>
    opts?.object.provider === ProviderType.OpenAI
      ? OpenAIObservabilityResponseBody
      : GenericObservabilityRequestResponseBody
  )
  body: TProviderType extends ProviderType.OpenAI
    ? OpenAIObservabilityResponseBody
    : GenericObservabilityRequestResponseBody;
  status: number;
}

export interface ObservabilityResponseBody {
  usage: string;
  [key: string]: AllPrimitiveTypes;
}

export class ReportRequestDto<
  TProviderType extends ProviderType | unknown = unknown
> {
  @IsEnum(ProviderType)
  provider: ProviderType;

  @IsEnum(PromptExecutionType)
  type: PromptExecutionType;

  @IsObject()
  @IsOptional()
  properties?: ObservabilityReportProperties;

  @IsObject()
  @IsOptional()
  metadata?: ObservabilityReportMetadata;

  @IsObject()
  request: ObservabilityRequest<TProviderType>;

  @IsObject()
  response: ObservabilityResponse<TProviderType>;
}
