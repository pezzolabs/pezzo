import { PromptExecutionStatus } from "../types";
export class CreatePromptExecutionDto {
  timestamp: string;

  environmentId: string;

  promptVersionSha: string;

  status: PromptExecutionStatus;

  settings: Record<string, unknown>;

  variables: Record<string, unknown>;

  content: string;

  interpolatedContent: string;

  result?: string;

  error?: string;

  duration: number;

  completionCost: number;

  completionTokens: number;

  promptCost: number;

  promptTokens: number;

  totalTokens: number;

  totalCost: number;
}
