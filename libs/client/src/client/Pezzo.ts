import { FIND_PROMPT, GET_DEPLOYED_PROMPT_VERSION } from "../graphql/queries";
import { REPORT_PROMPT_EXECUTION } from "../graphql/mutations";

import { type Prisma } from "@prisma/client";
import { GraphQLClient } from "graphql-request";

export interface PezzoClientOptions {
  pezzoServerURL: string;
  environment: string;
}

export class Pezzo {
  options: PezzoClientOptions;
  private readonly gqlClient: GraphQLClient;

  constructor(options: PezzoClientOptions) {
    this.options = options;
    this.gqlClient = new GraphQLClient(`${options.pezzoServerURL}/graphql`);
  }

  async findPrompt(name: string) {
    const result = await this.gqlClient.request(FIND_PROMPT, {
      data: {
        name: {
          equals: name,
        },
      },
    });

    return result.findPrompt;
  }

  async reportPromptExecution(data: Prisma.PromptExecutionCreateInput) {
    const result = await this.gqlClient.request(REPORT_PROMPT_EXECUTION, {
      data: data as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    });

    return result.reportPromptExecution;
  }

  async getDeployedPromptVersion(promptId: string) {
    const result = await this.gqlClient.request(GET_DEPLOYED_PROMPT_VERSION, {
      data: {
        promptId,
        environmentSlug: this.options.environment,
      },
    });
    return result.deployedPromptVersion;
  }
}
