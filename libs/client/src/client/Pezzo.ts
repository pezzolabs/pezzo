import axios, { AxiosInstance } from "axios";
import { ReportData } from "../types";
import { Prompt } from "../types/prompts";
import { interpolateVariables } from "../utils";
import { PromptType } from "../@generated/graphql/graphql";

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
  options: PezzoClientOptions;
  private readonly axios: AxiosInstance; // TODO: swap with fetch for Vercel AI

  constructor(options: PezzoClientOptions) {
    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.axios = axios.create({
      baseURL: `${this.options.serverUrl}/api`,
      headers: {
        "x-pezzo-api-key": this.options.apiKey,
        "x-pezzo-client-version": "0.0.1", // TODO: make dynamic, handdle in backend
      },
    });
  }

  async getPrompt(promptName: string): Promise<{ pezzo: Prompt }> {
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

    const pezzoPrompt: Prompt = {
      metadata: {
        promptId: data.promptId,
        promptVersionSha: data.promptVersionSha,
        type: data.type,
      },
      settings: data.settings,
      content: data.content,
    };

    return {
      pezzo: pezzoPrompt,
    };
  }

  async reportPromptExecution(dto: ReportData) {
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
}
