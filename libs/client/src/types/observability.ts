import { PromptExecutionType, ProviderType } from "./providers";
import { AllPrimitiveTypes, Primitive, RecursiveObject } from "../types";

export type ObservabilityReportProperties = RecursiveObject<Primitive>;
export type ObservabilityReportMetadata = {
  conversationId?: string;
  [key: string]: AllPrimitiveTypes;
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
