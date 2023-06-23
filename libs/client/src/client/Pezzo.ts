import axios, { AxiosInstance } from "axios";
import { IntegrationBaseSettings } from "../types";
import type { CreatePromptExecutionDto } from "./create-prompt-execution.dto";
import {
  ProviderType,
  Prompt,
  getPromptSettings,
  ReportPromptExecutionResult,
} from "../types/prompts";
import { PromptVersion } from "../@generated/graphql/graphql";
import { interpolateVariables } from "../utils";
import { PezzoOpenAIApi } from "./PezzoOpenAI";

export interface PezzoClientOptions {
  serverUrl?: string;
  apiKey: string;
  environment: string;
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
        "x-api-key": this.options.apiKey,
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
    const url = new URL(`${this.options.serverUrl}/api/v2/prompts/deployment`);
    url.searchParams.append("name", promptName);
    url.searchParams.append("environmentName", this.options.environment);

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.options.apiKey,
      }
    });
    const data = await response.json();
    const content = data.content;
    let interpolatedContent = data.content;

    if (options?.variables) {
      interpolatedContent = interpolateVariables(
        data.content,
        options.variables
      );
    }

    return {
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
          interpolatedContent,
        },
        interpolatedContent,
      }),
    };
  }

  async reportPromptExecutionV2<TResult>(
    dto: CreatePromptExecutionDto,
    autoParseJSON?: boolean
  ): Promise<ReportPromptExecutionResult<TResult>> {
    const response = await fetch(`${this.options.serverUrl}/api/v2/prompts/execution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.options.apiKey,
      },
      body: JSON.stringify(dto),
    });
    const data = await response.json();

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

  async getOpenAiPrompt(promptName: string) {
    return this.getPrompt<ProviderType.OpenAI>(promptName);
  }
}
