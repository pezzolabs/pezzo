import fetch from "cross-fetch";
import { GetModelsResult, GetPromptCompletionInput, GetPromptCompletionResult } from "../types/prompts";
import { interpolateVariablesRecursively } from "../utils";

export interface GaiClientOptions {
  apiKey?: string;
  projectId?: string;
  environment?: string;
  serverUrl?: string;
}

export interface ManagedMessages {
  role: "user" | "system";
  content: string;
}

const defaultOptions: Partial<GaiClientOptions> = {
  serverUrl: "http://sn-gai-api.ai.smartnews.net",
};

export class GaiPlatform {
  options: GaiClientOptions;

  constructor(options: GaiClientOptions) {
    this.options = {
      serverUrl: process.env["NX_GAI_PLATFORM_URL"] || defaultOptions.serverUrl,
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
    let covert_prompt = dto.prompt;
    // console.log("dto.variables: " + JSON.stringify(dto.variables));
    if (Object.keys(dto.variables).length > 0) {
      const managedMessages: ManagedMessages[] = [
        { role: "user", content: dto.prompt },
      ];
      covert_prompt = interpolateVariablesRecursively<ManagedMessages[]>(managedMessages, dto.variables)[0].content;
    }
    // console.log("covert_prompt: " + JSON.stringify(covert_prompt));
    const requestTimestamp = new Date();
    // console.log("===requestTimestamp: " + requestTimestamp);

    const url = new URL(`${this.options.serverUrl}/v3/text/completion`);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          model: dto.model,
          project: "ai_infra_dev",
          system_hint: dto.system_hint,
          prompt: covert_prompt,
          temperature: dto.temperature,
          max_tokens: dto.max_tokens,
          extra: dto.extra
        }
      ),
    });
    const responseTimestamp = new Date();
    // console.log("===responseTimestamp: " + new Date());
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
          `Error fetching prompt completion. Response from GAI Platform = ${JSON.stringify(data)}`
        );
      }
    }

    return {
      gai_req_id: data.gai_req_id,
      model: data.model,
      completion: data.completion,
      prompt_tokens: data.prompt_tokens,
      completion_tokens: data.completion_tokens,
      requestTimestamp: requestTimestamp,
      responseTimestamp: responseTimestamp,
    };
  }

}
