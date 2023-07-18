import { OpenAILLMProvider } from "./chat-providers/openai";
import { AnthropicLLMProvider } from "./chat-providers/anthropic";
import {
  CreateCompletionRequest,
  CreateCompletionResponse,
  LLMProvider,
  LLMProviderConfig,
} from "./types";

/*
Agnostic chat completion implementation that does not depend on Pezzo backend or any LLM Provider.
*/
export class PezzoChatCompletion {
  private readonly LLMProviders: Map<string, LLMProvider> = new Map();

  constructor(providerConfigs: Record<string, LLMProviderConfig>) {
    this.setProviders(providerConfigs);
  }

  setProviders(providers: Record<string, LLMProviderConfig>) {
    const configs = Object.entries(providers);

    configs.forEach(([providerName, config]) => {
      if (this.LLMProviders.has(providerName)) return;
      if (providerName === "openai") {
        const provider = new OpenAILLMProvider(config);
        this.LLMProviders.set(providerName, provider);
        return;
      }

      if (providerName === "anthropic") {
        const provider = new AnthropicLLMProvider(config);
        this.LLMProviders.set(providerName, provider);
        return;
      }

      throw new Error(`Unknown chat completion provider: ${providerName}`);
    });
  }

  getProviderByProviderName(providerName?: string) {
    if (!this.LLMProviders.size) throw new Error("No providers set");
    if (!providerName && this.LLMProviders.size === 1) {
      return this.LLMProviders.get(this.LLMProviders.keys()[0]);
    }
    if (!providerName)
      throw new Error(`There are multiple providers set, please specify one`);
    const provider = this.LLMProviders.get(providerName);
    if (!provider) throw new Error(`Unknown provider: ${providerName}`);

    return provider;
  }

  async execute(
    request: CreateCompletionRequest
  ): Promise<CreateCompletionResponse> {
    const provider = this.getProviderByProviderName(request.prompt.provider);
    return provider.createCompletion(request);
  }
}
