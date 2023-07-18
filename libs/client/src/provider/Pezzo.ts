import axios, { AxiosInstance } from "axios";
import { ReportData } from "../types";
import { Prompt } from "../types/prompts";
import { interpolateVariables } from "../utils";
import { PromptType } from "../@generated/graphql/graphql";
import {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
} from "openai";
import { OpenAIChatCompletionProvider } from "./chat-providers/openai";
import { AnthropicChatCompletionProvider } from "./chat-providers/anthropic";

export interface ChatCompletionProviderConfig {
  apiKey: string;
}

export interface ChatCompletionProvider {
  createChatCompletion(
    request: CreateChatCompletionRequest
  ): Promise<{ data: CreateChatCompletionResponse }>;
}

export interface PezzoClientOptions {
  serverUrl?: string;
  apiKey: string;
  environment: string;
  projectId: string;
  providerConfigs: Record<string, ChatCompletionProviderConfig>;
}

export interface GetPromptOptions {
  variables?: Record<string, boolean | number | string>;
}

const defaultOptions: Partial<PezzoClientOptions> = {
  serverUrl: "https://api.pezzo.ai",
};

export class Pezzo {
  private readonly options: PezzoClientOptions;
  private readonly chatCompletionProviders: Map<
    string,
    ChatCompletionProvider
  > = new Map();

  constructor(options: PezzoClientOptions) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  async getPrompt(
    promptName: string,
    options?: GetPromptOptions
  ): Promise<{ pezzo: Prompt }> {
    const url = new URL(`${this.options.serverUrl}/api/prompts/v2/deployment`);
    url.searchParams.append("name", promptName);
    url.searchParams.append("environmentName", this.options.environment);

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "x-pezzo-api-key": this.options.apiKey,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      if (data?.message) {
        throw new Error(data.message);
      } else {
        throw new Error(
          `Error fetching prompt "${promptName}" for environment "${this.options.environment}" (${data.statusCode}).`
        );
      }
    }

    let interpolatedContent: any = {};

    if (options?.variables) {
      if (data.type === PromptType.Prompt) {
        interpolatedContent = {
          prompt: interpolateVariables(data.content.prompt, options?.variables),
        };
      }
    }

    const pezzoPrompt: Prompt = {
      promptId: data.promptId,
      promptVersionSha: data.promptVersionSha,
      type: data.type,
      settings: data.settings,
      content: data.content,
      interpolatedContent,
    };

    return {
      pezzo: pezzoPrompt,
    };
  }

  async reportPromptExecutionV2(dto: ReportData) {
    await axios.post(
      `${this.options.serverUrl}/api/reporting/v2/request`,
      dto,
      {
        headers: {
          "x-pezzo-api-key": this.options.apiKey,
          "x-pezzo-project-id": this.options.projectId,
        },
      }
    );
  }

  async setProviders(providers: Record<string, ChatCompletionProviderConfig>) {
    const configs = Object.entries(providers);

    configs.forEach(([providerName, config]) => {
      if (this.chatCompletionProviders.has(providerName)) return;
      if (providerName === "openai") {
        const provider = new OpenAIChatCompletionProvider(config);
        this.chatCompletionProviders.set(providerName, provider);
        return;
      }

      if (providerName === "anthropic") {
        const provider = new AnthropicChatCompletionProvider(config);
        this.chatCompletionProviders.set(providerName, provider);
        return;
      }

      throw new Error(`Unknown chat completion provider: ${providerName}`);
    });
  }

  async getPromptProvider({ pezzo }: { pezzo: Prompt }) {
    const { providerName } = pezzo;

    if (!this.chatCompletionProviders.size) throw new Error("No providers set");
    if (!providerName && this.chatCompletionProviders.size === 1) {
      return this.chatCompletionProviders.get(
        this.chatCompletionProviders.keys()[0]
      );
    }
    const provider = this.chatCompletionProviders.get(providerName);
    if (!provider) throw new Error(`Unknown provider: ${providerName}`);

    return provider;
  }
}
