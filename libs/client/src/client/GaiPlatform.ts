import fetch from "cross-fetch";

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

  async getModels(): Promise<[string]> {
    const url = new URL(`${this.options.serverUrl}/v3/models`);

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      if (data?.message) {
        throw new Error(data.message);
      } else {
        throw new Error(
          `Error fetching model list for environment "${this.options.environment}" (${data.statusCode}).`
        );
      }
    }

    return data.models;
  }

}