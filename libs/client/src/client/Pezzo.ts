import { FIND_PROMPT, GET_DEPLOYED_PROMPT_VERSION } from "../graphql/queries";
import { REPORT_PROMPT_EXECUTION } from "../graphql/mutations";
import { GraphQLClient } from "graphql-request";
// import { PromptExecution, PromptExecutionCreateInput } from "@pezzo/graphql"; --> This needs to be fixed
import { IntegrationBaseSettings, PromptExecutionStatus } from "../types";

export interface PezzoClientOptions {
  serverUrl: string;
  apiKey: string;
  environment: string;
}

export class Pezzo {
  options: PezzoClientOptions;
  private readonly gqlClient: GraphQLClient;

  constructor(options: PezzoClientOptions) {
    this.options = options;
    this.gqlClient = new GraphQLClient(`${options.serverUrl}/graphql`, {
      headers: {
        "x-api-key": options.apiKey,
      },
    });
  }

  async findPrompt(name: string) {
    const result = await this.gqlClient.request(FIND_PROMPT, {
      data: {
        name,
      },
    });

    return result.findPromptWithApiKey;
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
      data: data as unknown,
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

  async getDeployedPromptVersion<T>(promptId: string) {
    const result = await this.gqlClient.request(GET_DEPLOYED_PROMPT_VERSION, {
      data: {
        promptId,
        environmentSlug: this.options.environment,
      },
    });

    const { settings, ...rest } = result.deployedPromptVersionWithApiKey;

    return { ...rest, settings: settings as IntegrationBaseSettings<T> };
  }
}
