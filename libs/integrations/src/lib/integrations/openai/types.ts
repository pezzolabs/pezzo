import { IntegrationBaseSettings } from "../types";

export interface ExecutorOptions {
  apiKey: string;
}

export interface CompletionOptions {
  autoParse?: boolean;
}

export type OpenAIIntegrationSettings = IntegrationBaseSettings<{
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}> & {
  model: "gpt-3.5-turbo" | "gpt-4";
};
