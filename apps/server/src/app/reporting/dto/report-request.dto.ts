import { IsEnum, IsObject, IsOptional } from "class-validator";
import {
  ProviderType,
  PromptExecutionType,
  ObservabilityReportProperties,
  ObservabilityReportMetadata,
  ObservabilityRequest,
  ObservabilityResponse
} from "@pezzo/types";

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
