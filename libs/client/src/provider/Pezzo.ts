import axios from "axios";
import { ReportData } from "../types";
import { Prompt } from "../types/prompts";
import { interpolateVariables } from "../utils";
import { PromptType } from "../@generated/graphql/graphql";
import { PezzoChatCompletion } from "./PezzoChatCompletion";
import {
  CreateCompletionRequest,
  CreateCompletionResponse,
  LLMProvider,
  LLMProviderConfig,
} from "./types";

export interface PezzoClientOptions {
  serverUrl?: string;
  apiKey: string;
  environment: string;
  projectId: string;
  providerConfigs: Record<string, LLMProviderConfig>;
}

export interface GetPromptOptions {
  variables?: Record<string, boolean | number | string>;
}

const defaultOptions: Partial<PezzoClientOptions> = {
  serverUrl: "https://api.pezzo.ai",
};

export class Pezzo {
  private readonly options: PezzoClientOptions;
  private readonly pezzoChatCompletion: PezzoChatCompletion;

  constructor(options: PezzoClientOptions) {
    this.options = { ...defaultOptions, ...options };
    this.pezzoChatCompletion = new PezzoChatCompletion(
      this.options.providerConfigs
    );
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

  getProvider(providerName: string): LLMProvider {
    return this.pezzoChatCompletion.getProviderByProviderName(providerName);
  }

  async mockReport(data: any) {
    console.log("mockReport", data);
  }

  async execute(
    request: CreateCompletionRequest
  ): Promise<CreateCompletionResponse> {
    const response = this.pezzoChatCompletion.execute(request);
    this.mockReport({
      meta: this.options,
      request,
      response,
    });
    return response;
  }
}
