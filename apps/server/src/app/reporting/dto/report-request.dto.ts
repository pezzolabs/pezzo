import { IsBoolean, IsObject, IsOptional } from "class-validator";
import {
  Provider,
  ObservabilityReportProperties,
  ObservabilityReportMetadata,
  ObservabilityRequest,
  ObservabilityResponse,
} from "@pezzo/types";

export class ReportRequestDto<
  TProviderType extends Provider | unknown = unknown
> {
  @IsObject()
  @IsOptional()
  properties?: ObservabilityReportProperties;

  @IsObject()
  @IsOptional()
  metadata: ObservabilityReportMetadata;

  @IsObject()
  request: ObservabilityRequest<Provider>;

  @IsObject()
  response: ObservabilityResponse<TProviderType>;

  @IsBoolean()
  cacheEnabled: boolean;

  @IsOptional()
  @IsBoolean()
  cacheHit?: boolean = null;
}
