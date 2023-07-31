import { ValueType, PromptExecutionType, ProviderType } from "../types";

export type ObservabilityReportProperties = Record<string, ValueType>;
export type ObservabilityReportMetadata = {
  provider: ProviderType;
  type: PromptExecutionType;
  [key: string]: ValueType;
};

export interface ReportData {
  metadata: ObservabilityReportMetadata;
  properties?: ObservabilityReportProperties;
  request: {
    timestamp: string;
    body: unknown;
  };
  response: {
    timestamp: string;
    body: unknown;
    status: number;
  };
}
