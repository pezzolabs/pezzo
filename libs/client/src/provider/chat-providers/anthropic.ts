import { ChatCompletionProvider, ChatCompletionProviderConfig } from "../Pezzo";

export class AnthropicChatCompletionProvider implements ChatCompletionProvider {
  constructor(
    private chatCompletionProviderConfig: ChatCompletionProviderConfig
  ) {}

  async createChatCompletion(request) {
    const url = "https://api.anthropic.com/v1/complete";
    const headers = {
      accept: "application/json",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "x-api-key": this.chatCompletionProviderConfig.apiKey,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      return { data: jsonResponse };
      // Process the response data
    } else {
      // Handle the error
      console.error("Request failed with status:", response.status);
      throw new Error(response.statusText);
    }
  }
}
