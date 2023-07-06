import axios, { AxiosInstance } from "axios";
import { IntegrationBaseSettings, ProviderType, ReportData } from "../types";
import type { CreatePromptExecutionDto } from "./create-prompt-execution.dto";
import {
  Prompt,
  getPromptSettings,
  ReportPromptExecutionResult,
} from "../types/prompts";
import { interpolateVariables } from "../utils";
import { PezzoOpenAIApi } from "./PezzoOpenAI";

export interface PezzoClientOptions {
  serverUrl?: string;
  apiKey: string;
  environment: string;
  projectId: string;
}

export interface GetPromptOptions {
  variables?: Record<string, boolean | number | string>;
}

const defaultOptions: Partial<PezzoClientOptions> = {
  serverUrl: "https://api.pezzo.ai",
};

export class Pezzo {
  OpenAIApi: PezzoOpenAIApi;

  options: PezzoClientOptions;
  private readonly axios: AxiosInstance;

  constructor(options: PezzoClientOptions) {
    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.axios = axios.create({
      baseURL: `${this.options.serverUrl}/api`,
      headers: {
        "x-pezzo-api-key": this.options.apiKey,
      },
    });
  }

  async reportPromptExecution<TResult>(
    dto: CreatePromptExecutionDto,
    autoParseJSON?: boolean
  ): Promise<ReportPromptExecutionResult<TResult>> {
    const { data } = await this.axios.post(`prompts/execution`, {
      ...dto,
    });

    if (data.result) {
      const report = {
        ...data,
        result: autoParseJSON
          ? (JSON.parse(data.result) as TResult)
          : (data.result as TResult),
      };

      return report;
    } else {
      return data;
    }
  }

  /**
   * @deprecated Use `getPrompt` instead
   */
  async getDeployedPromptVersion<T>(promptName: string) {
    const url = new URL(`${this.options.serverUrl}/api/prompts/deployment`);
    url.searchParams.append("name", promptName);
    url.searchParams.append("environmentName", this.options.environment);

    const { data } = await this.axios.get(url.toString());

    return {
      id: data.promptId,
      deployedVersion: {
        sha: data.sha,
        content: data.content,
        settings: data.settings as IntegrationBaseSettings<T>,
      },
    };
  }

  async getPrompt<TProviderType extends ProviderType>(
    promptName: string,
    options?: GetPromptOptions
  ): Promise<Prompt<TProviderType>> {
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


    if (data?.statusCode === 404) {
      throw new Error(
        `Prompt "${promptName}" not found in environment "${this.options.environment}"`
      );
    }


    if (!response.ok) {
      throw new Error(
        `Error while fetching prompt "${promptName}" in environment "${this.options.environment}"`
      );
    }

    const content = data.settings.messages[0].content;

    let interpolatedMessages = data.settings.messages;

    if (options?.variables) {
      interpolatedMessages = data.settings.messages.map((message) => ({ ...message, content: interpolateVariables(message.content, options.variables) }))
    }

    if (interpolatedMessages.some((message) => /{\s*(\w+)\s*}/g.test(message.content))) {
      throw new Error(`Invalid or missing variables provided for prompt "${promptName}"`)
    }

    const prompt = {
      id: data.promptId,
      deployedVersion: data.sha,
      ...getPromptSettings({
        settings: data.settings as Record<string, unknown>,
        content,
        _pezzo: {
          environmentName: this.options.environment,
          promptId: data.promptId,
          promptVersionSha: data.sha,
          variables: options?.variables,
          content,
          interpolatedMessages,
        },
        interpolatedMessages,
      }),
    };


    return prompt;
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

  async getOpenAiPrompt(promptName: string, options?: GetPromptOptions) {
    return this.getPrompt<ProviderType.OpenAI>(promptName, options);
  }
}
