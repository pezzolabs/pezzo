import fetch from "cross-fetch";
import { FetchCachedRequestResult, ReportData } from "../types";
import { Prompt } from "../types/prompts";

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

  constructor(options: PezzoClientOptions) {
    const serverUrl =
      options.serverUrl ||
      process.env["PEZZO_SERVER_URL"] ||
      defaultOptions.serverUrl;

    this.options = {
      serverUrl,
      ...options,
    };
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
    const response = await fetch(
      `${this.options.serverUrl}/api/reporting/v2/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pezzo-api-key": this.options.apiKey,
          "x-pezzo-project-id": this.options.projectId,
        },
        body: JSON.stringify(dto),
      }
    );

    if (!response.ok) {
      const json = await response.json();
      console.warn("Could not report prompt execution", json);
    }
  }

  async fetchCachedRequest(
    request: object
  ): Promise<FetchCachedRequestResult | null> {
    const url = new URL(`${this.options.serverUrl}/api/cache/v1/request`);
    url.searchParams.append(
      "request",
      Buffer.from(JSON.stringify(request)).toString("base64")
    );

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "x-pezzo-api-key": this.options.apiKey,
        "x-pezzo-project-id": this.options.projectId,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      const json = await response.json();
      console.warn("Could not fetch request fro mcache", json);
    }

    return data;
  }

  async cacheRequest(request: object, _response: object): Promise<void> {
    const response = await fetch(
      `${this.options.serverUrl}/api/cache/v1/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pezzo-api-key": this.options.apiKey,
          "x-pezzo-project-id": this.options.projectId,
        },
        body: JSON.stringify({
          request,
          response: _response,
        }),
      }
    );

    if (!response.ok) {
      const json = await response.json();
      console.warn("Could not cache request", json);
    }
  }
}
