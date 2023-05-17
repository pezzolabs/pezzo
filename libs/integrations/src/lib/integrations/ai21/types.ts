import { IntegrationBaseSettings } from "../types";

export interface AI21ServiceOptions {
  apiKey: string;
}

export interface AI21CompleteOptions {
  autoParse?: boolean;
}

export interface AI21CompletionResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prompt: { tokens: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  completions: { data: { tokens: any[]; text: string } }[];
}

export type AI21IntegrationSettings = IntegrationBaseSettings<{
  numResults: number;
  maxTokens: number;
  temperature: number;
  topKReturn: number;
  topP: number;
  countPenalty: {
    scale: number;
    applyToNumbers: boolean;
    applyToPunctuations: boolean;
    applyToStopwords: boolean;
    applyToWhitespaces: boolean;
    applyToEmojis: boolean;
  };
  frequencyPenalty: {
    scale: number;
    applyToNumbers: boolean;
    applyToPunctuations: boolean;
    applyToStopwords: boolean;
    applyToWhitespaces: boolean;
    applyToEmojis: boolean;
  };
  presencePenalty: {
    scale: number;
    applyToNumbers: boolean;
    applyToPunctuations: boolean;
    applyToStopwords: boolean;
    applyToWhitespaces: boolean;
    applyToEmojis: boolean;
  };
  stopSequences: string[];
}> & {
  model: "j2-jumbo-instruct" | "j2-grande-instruct" | "j2-jumbo" | "j2-grande";
};
