import { OpenAIChatSettings } from "@pezzo/common";

export interface TestPromptResult {
  success: boolean;
  result: string | null;
  error: string | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptCost: number;
  completionCost: number;
  totalCost: number;
  duration: number;
  content: string;
  interpolatedContent: string;
  settings: OpenAIChatSettings;
  variables: Record<string, boolean | number | string>;
}
