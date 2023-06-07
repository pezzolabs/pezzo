import axios, { AxiosInstance } from "axios";
import { IntegrationBaseSettings, PromptExecutionStatus } from "../types";
import type { CreatePromptExecutionDto } from "@pezzo/common";

export interface PezzoClientOptions {
  serverUrl?: string;
  apiKey: string;
}

const defaultOptions: Partial<PezzoClientOptions> = {
  serverUrl: "https://api.pezzo.ai",
};

export class Pezzo {
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

  async reportPromptExecution<T>(
    dto: CreatePromptExecutionDto,
    autoParseJSON?: boolean
  ): Promise<{
    id: string;
    promptId: string;
    status: PromptExecutionStatus;
    result?: T;
    totalCost: number;
    totalTokens: number;
    duration: number;
  }> {
    const { data } = await this.axios.post(`prompts/execution`, {
      ...dto,
    });

    if (data.result) {
      const report = {
        ...data,
        result: autoParseJSON
          ? (JSON.parse(data.result) as T)
          : (data.result as T),
      };

      return report;
    } else {
      return data;
    }
  }

  async getDeployedPromptVersion<T>(promptName: string) {
    const { data } = await this.axios.get(`prompts/${promptName}/deployment`);

    return {
      id: data.promptId,
      deployedVersion: {
        sha: data.sha,
        content: data.content,
        settings: data.settings as IntegrationBaseSettings<T>,
      },
    };
  }
}
