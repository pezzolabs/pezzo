import fetch from "cross-fetch";
import { GetModelsResult, GetPromptCompletionInput, GetPromptCompletionResult } from "../types/prompts";

export interface GaiClientOptions {
  apiKey?: string;
  projectId?: string;
  environment?: string;
  serverUrl?: string;
}

const defaultOptions: Partial<GaiClientOptions> = {
  serverUrl: "http://sn-gai-api.ai.smartnews.net",
};

export class GaiPlatform {
  options: GaiClientOptions;

  constructor(options: GaiClientOptions) {
    this.options = {
      serverUrl: defaultOptions.serverUrl,
      apiKey: options.apiKey || process.env["PEZZO_API_KEY"],
      projectId: options.projectId || process.env["PEZZO_PROJECT_ID"],
      environment: options.environment || process.env["PEZZO_ENVIRONMENT"],
      ...options,
    };
  }

  async getModels(): Promise<GetModelsResult> {
    const url = new URL(`${this.options.serverUrl}/v3/models`);

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    // console.log("getModels data: " + data.toString());
    if (!response.ok) {
      if (data?.message) {
        throw new Error(data.message);
      } else {
        throw new Error(
          `Error fetching model list for environment "${this.options.environment}" (${data.statusCode}).`
        );
      }
    }

    return {
      models: data.models,
      gai_req_id: data.gai_req_id,
    };
  }

  async getPromptCompletion(dto: GetPromptCompletionInput): Promise<GetPromptCompletionResult> {
    const url = new URL(`${this.options.serverUrl}/v3/text/completion`);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          model: dto.model,
          // project: "llm-ops",
          project: "ai_infra_dev",
          system_hint: dto.system_hint,
          prompt: dto.prompt,
          temperature: dto.temperature,
          max_tokens: dto.max_tokens,
        }
      ),
    });
    // console.log("getPromptCompletion text data: " + await response.text());
    const data = await response.json();
    // if (data) {
    //   console.log("getPromptCompletion data: " + data.toString());
    // }
    if (!response.ok) {
      if (data?.message) {
        throw new Error(data.message);
      } else {
        throw new Error(
          `Error fetching prompt completion for environment "${this.options.environment}" (${data.statusCode}).`
        );
      }
    }

    return {
      gai_req_id: data.gai_req_id,
      model: data.model,
      completion: data.completion,
      prompt_tokens: data.prompt_tokens,
      completion_tokens: data.completion_tokens,
    };
  }

}
