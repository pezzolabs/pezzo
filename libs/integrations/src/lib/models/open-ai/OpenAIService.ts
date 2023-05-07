import { OpenAIChatSettings } from "@pezzo/common";
import {
  Configuration as OpenAIConfiguration,
  ConfigurationParameters as OpenAIConfigurationParameters,
  OpenAIApi,
} from "openai";
import { CreateChatCompletionResponse } from "openai";

export class OpenAIService {
  private readonly openAI: OpenAIApi;

  constructor(configuration: OpenAIConfigurationParameters) {
    this.openAI = new OpenAIApi(new OpenAIConfiguration(configuration));
  }

  async createChatCompletion(
    settings: OpenAIChatSettings,
    content: string
  ): Promise<CreateChatCompletionResponse> {
    const result = await this.openAI.createChatCompletion({
      model: settings.model,
      top_p: settings.top_p,
      temperature: settings.temperature,
      max_tokens: settings.max_tokens,
      presence_penalty: settings.presence_penalty,
      frequency_penalty: settings.frequency_penalty,
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
    });

    return result.data;
  }
}
