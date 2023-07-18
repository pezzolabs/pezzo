import { LLMProvider, LLMProviderConfig } from "../types";

const bodyExample = {
  model: "claude-2",
  prompt: "\n\nHuman: Hello, world!\n\nAssistant:",
  max_tokens_to_sample: 256,
  stop_sequences: ["stop1", "stop2"],
  metadata: {
    user_id: "fdsfdsfds",
  },
};

export class AnthropicLLMProvider implements LLMProvider {
  constructor(private LLMProviderConfig: LLMProviderConfig) {}

  async createCompletion(request) {
    const url = "https://api.anthropic.com/v1/complete";
    const headers = {
      accept: "application/json",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "x-api-key": this.LLMProviderConfig.apiKey,
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
