import { AllPrimitiveTypes } from "@pezzo/types";

export interface RequestReportItem {
  key: string;
  timestamp: string;
  status: JSX.Element;
  duration: string;
  totalTokens?: number;
  cost?: string;
  promptId?: AllPrimitiveTypes;
  isTestPrompt?: boolean;
  cacheEnabled?: boolean;
  cacheHit?: boolean;
}
