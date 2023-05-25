import { GET_DEPLOYED_PROMPT_VERSION } from "../graphql/queries";
import { REPORT_PROMPT_EXECUTION } from "../graphql/mutations";
import { GraphQLClient } from "graphql-request";
import { IntegrationBaseSettings, PromptExecutionStatus } from "../types";

export interface PezzoClientOptions {
  serverUrl: string;
  apiKey: string;
  environment: string;
}

const defaultOptions: Partial<PezzoClientOptions> = {
  serverUrl: "https://api.pezzo.ai"
};

export class Pezzo {
  options: PezzoClientOptions;
  private readonly gqlClient: GraphQLClient;

  constructor(options: PezzoClientOptions) {
    this.options = { 
      ...defaultOptions,
      ...options 
    };

    this.gqlClient = new GraphQLClient(`${this.options.serverUrl}/graphql`, {
      headers: {
        "x-api-key": this.options.apiKey,
      },
    });
  }

  async reportPromptExecution<T>(
    data: unknown,
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
    const result = await this.gqlClient.request(REPORT_PROMPT_EXECUTION, {
      data: data as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    });

    const { result: resultString, ...rest } =
      result.reportPromptExecutionWithApiKey;

    const report = { ...rest };

    if (result) {
      return {
        ...report,
        result: autoParseJSON
          ? (JSON.parse(resultString) as T)
          : (resultString as T),
      };
    }
    return report;
  }

  async getDeployedPromptVersion<T>(promptName: string) {
    const result = await this.gqlClient.request(GET_DEPLOYED_PROMPT_VERSION, {
      data: {
        name: promptName,
      },
      deployedVersionData: {
        environmentSlug: this.options.environment,
      },
    });

    const prompt = result.findPromptWithApiKey;

    return {
      id: prompt.id,
      deployedVersion: {
        sha: prompt.deployedVersion.sha,
        content: prompt.deployedVersion.content,
        settings: prompt.deployedVersion.settings as IntegrationBaseSettings<T>,
      },
    };
  }
}
