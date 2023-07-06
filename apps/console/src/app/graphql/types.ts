import { ObservabilityReportMetadata, ObservabilityReportProperties, ObservabilityRequest, ObservabilityResponse, PromptExecutionType, ProviderType } from "@pezzo/types";
import { GraphQLError } from "graphql-request/build/esm/types";

export interface GraphQLErrorResponse {
  response:
  | {
    errors: GraphQLError[];
  }
  | undefined;
}

export interface ReportRequestResponse<
  TProviderType extends ProviderType | unknown = unknown
> {
  provider: ProviderType;
  type: PromptExecutionType;
  properties?: ObservabilityReportProperties;
  metadata?: ObservabilityReportMetadata;
  request: ObservabilityRequest<TProviderType>;
  response: ObservabilityResponse<TProviderType>;
  reportId: string;
  calculated: Record<string, number>;
}
