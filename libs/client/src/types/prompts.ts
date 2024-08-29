export type PezzoCreateChatCompletionRequest = {
  pezzo: Prompt;
};

type PrompContent =
  | { prompt: string }
  | { messages: { role: "user" | "assistant"; content: string }[] };

export type GetPromptResult<TSettings = unknown> = {
  pezzo: Prompt<TSettings>;
};

export interface Prompt<TSettings = unknown> {
  metadata: {
    promptId: string;
    promptVersionSha: string;
    type: "Prompt" | "Chat";
    isTestPrompt?: boolean;
  };
  settings: TSettings;
  content: PrompContent;
}

export interface ReportPromptExecutionResult<TResult> {
  id: string;
  promptId: string;
  status: PromptExecutionStatus;
  result?: TResult;
  totalCost: number;
  totalTokens: number;
  duration: number;
}

export interface TestPromptResult {
  success: boolean;
  result?: string;
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
  settings: any;
  variables: Record<string, boolean | number | string>;
}

export interface IntegrationBaseSettings<T> {
  model: string;
  modelSettings: T;
}

export enum PromptExecutionStatus {
  Success = "Success",
  Error = "Error",
}

export interface GetModelsResult {
  models: string[];
  gai_req_id: string;
}

export interface GetPromptCompletionInput {
  model: string;
  system_hint: string;
  prompt: string;
  temperature: number;
  max_tokens: number;
  variables: Record<string, boolean | number | string>;
  extra: object;
}

export interface GetPromptCompletionResult {
  gai_req_id: string;
  model: string;
  completion: string;
  prompt_tokens: number;
  completion_tokens: number;
  requestTimestamp?: Date;
  responseTimestamp?: Date;
  isError?: boolean;
}
