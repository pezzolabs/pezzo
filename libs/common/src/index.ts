import * as versionJson from "./version.json";

export const version = versionJson.version;

export interface OpenAIChatSettings {
  model: "gpt-3.5-turbo" | "gpt-4";
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export const defaultOpenAIChatSettings: OpenAIChatSettings = {
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};