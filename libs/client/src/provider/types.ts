export enum PromptType {
  Chat = "Chat",
  Prompt = "Prompt",
}

type PrompContent =
  | { prompt: string }
  | { messages: { role: "user" | "assistant"; content: string }[] };

export interface Prompt<TSettings = unknown> {
  promptId: string;
  promptVersionSha: string;
  type: PromptType;
  settings: TSettings;
  content: PrompContent;
  provider?: string;
}

export interface LLMProviderConfig {
  apiKey: string;
}

export interface CreateCompletionRequest {
  prompt: Prompt;
  properties?: Record<string, never>;
  variables?: Record<string, boolean | number | string>;
}

export interface CreateCompletionResponse {
  data: any;
  meta?: any;
}

export interface LLMProvider {
  createCompletion(
    request: CreateCompletionRequest
  ): Promise<CreateCompletionResponse>;
}
