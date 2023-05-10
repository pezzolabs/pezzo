import { exec } from "child_process";
import { PezzoAPIClient } from "../PezzoAPIClient";
import { interpolateVariables } from "@pezzo/common";
import { PromptExecutionStatus } from "@pezzo/graphql";

export interface BaseIntegrationOptions {
  pezzoServerURL: string;
  environment: string;
}

export interface ExecuteProps<T> {
  content: string;
  settings: T;
  options?: ExecuteOptions;
}

export interface ExecuteOptions {
  autoParseJSON?: boolean;
}

export interface ExecuteResult<T> {
  promptTokens: number;
  completionTokens: number;
  promptCost: number;
  completionCost: number;
  result: string;
}

export abstract class BaseIntegration {
  private readonly environment: string;
  private readonly pezzoAPIClient: PezzoAPIClient;

  constructor(options: BaseIntegrationOptions) {
    this.environment = options.environment;
    this.pezzoAPIClient = new PezzoAPIClient({
      graphqlEndpoint: `${options.pezzoServerURL}/graphql`,
    });
  }

  abstract execute<T>(props: ExecuteProps<unknown>): Promise<ExecuteResult<T>>;

  async run<T = string>(
    promptName: string,
    variables: Record<string, any> = {},
    options: ExecuteOptions = {},
  ) {
    // get prompt

    const prompt = await this.pezzoAPIClient.findPrompt(promptName);
    const promptVersion = await this.pezzoAPIClient.getDeployedPromptVersion(
      prompt.id,
      this.environment
    );

    const settings = promptVersion.settings as unknown;
    const content = promptVersion.content;
    const interpolatedContent = interpolateVariables(content, variables);

    const start = performance.now();

    const executionResult = await this.execute({
      content: interpolatedContent,
      settings,
      options,
    });

    const end = performance.now();
    const duration = Math.ceil(end - start);

    const executionReport = await this.pezzoAPIClient.reportPromptExecution({
      prompt: {
        connect: {
          id: prompt.id,
        },
      },
      promptVersionSha: promptVersion.sha,
      status: PromptExecutionStatus.Success,
      content,
      variables,
      interpolatedContent,
      settings: settings as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      result: executionResult.result,
      error: null,
      promptTokens: executionResult.promptTokens,
      completionTokens: executionResult.completionTokens,
      totalTokens: executionResult.promptTokens + executionResult.completionTokens,
      promptCost: executionResult.promptCost,
      completionCost: executionResult.completionCost,
      totalCost: executionResult.promptCost + executionResult.completionCost,
      duration,
    });

    return executionReport;
  }
}
