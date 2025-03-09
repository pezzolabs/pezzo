import { AllPrimitiveTypes } from "pezzo/libs/types/src";

export interface RequestReportItem {
  reportId: string;
  timestamp: string;
  status: number;
  duration: number;
  totalTokens: number;
  cost: number;
  promptId: AllPrimitiveTypes | null;
  isTestPrompt: boolean;
  cacheEnabled: boolean;
  cacheHit: boolean;
  model: string;
  modelAuthor: string;
  provider: string;
}
