export class CreatePromptExecutionDto {
  promptVersionSha: string;

  status: "Success" | "Error";

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
