import { Configuration, OpenAIApi } from "openai";
import { LLMProvider, LLMProviderConfig } from "../types";

export class OpenAILLMProvider implements LLMProvider {
  constructor(private LLMProviderConfig: LLMProviderConfig) {}

  async createCompletion(request) {
    const configuration = new Configuration({
      apiKey: this.LLMProviderConfig.apiKey,
    });
    const openai = new OpenAIApi(configuration);
    const { data } = await openai.createChatCompletion(request);
    return { data };
  }
}
