import { Configuration, OpenAIApi } from "openai";
import { ChatCompletionProvider, ChatCompletionProviderConfig } from "../Pezzo";

export class OpenAIChatCompletionProvider implements ChatCompletionProvider {
  constructor(
    private chatCompletionProviderConfig: ChatCompletionProviderConfig
  ) {}

  async createChatCompletion(request) {
    const configuration = new Configuration({
      apiKey: this.chatCompletionProviderConfig.apiKey,
    });
    const openai: ChatCompletionProvider = new OpenAIApi(configuration);
    return openai.createChatCompletion(request);
  }
}
