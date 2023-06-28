export class CreatePromptExecutionDto {
  environmentName: string;

  promptId: string;

  promptVersionSha: string;

  status: "Success" | "Error";

  settings: unknown;

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

export class NewCreatePromptExecutionDto {
  environmentName: string;

  promptId: string;

  promptVersionSha: string;

  status: "Success" | "Error";

  settings: unknown;

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
