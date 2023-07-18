import { IsEnum, IsObject, IsOptional } from "class-validator";
import {
  Provider,
  PromptExecutionType,
  ObservabilityReportProperties,
  ObservabilityReportMetadata,
  ObservabilityRequest,
  ObservabilityResponse,
} from "@pezzo/types";

export class ReportRequestDto<
  TProviderType extends Provider | unknown = unknown
> {
  @IsEnum(Provider)
  provider: Provider;

  @IsEnum(PromptExecutionType)
  type: PromptExecutionType;

  @IsObject()
  @IsOptional()
  properties?: ObservabilityReportProperties;

  @IsObject()
  @IsOptional()
  metadata?: ObservabilityReportMetadata;

  @IsObject()
  request: ObservabilityRequest<Provider>;

  @IsObject()
  response: ObservabilityResponse<TProviderType>;
}
