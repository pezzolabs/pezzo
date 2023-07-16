import { ValueType, PromptExecutionType, ProviderType } from "../types";

export type ObservabilityReportProperties = Record<string, ValueType>;
export type ObservabilityReportMetadata = {
  conversationId?: string;
  [key: string]: ValueType;
};

export interface ReportData {
  provider: ProviderType;
  type: PromptExecutionType;
  metadata?: ObservabilityReportMetadata;
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
