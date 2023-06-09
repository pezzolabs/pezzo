import { Pezzo } from "@pezzo/client";

import { interpolateVariables } from "../utils/interpolate-variables";
import { PezzoClientError } from "./types";
import type { CreatePromptExecutionDto } from "@pezzo/common";

export interface ExecuteProps<T = unknown> {
  content: string;
  settings: T;
  options?: ExecuteOptions;
}

export interface ExecuteOptions {
  autoParseJSON?: boolean;
}

export interface ExecuteResult<T> {
  status: "Success" | "Error";
  promptTokens: number;
  completionTokens: number;
  promptCost: number;
  completionCost: number;
  error?: {
    error: unknown;
    message?: string;
    printableError: string;
    status: number;
  };
  result?: T;
}

export abstract class BaseExecutor {
  private pezzoClient: Pezzo;

  constructor(pezzoClient: Pezzo) {
    this.pezzoClient = pezzoClient;
  }

  abstract execute(props: ExecuteProps): Promise<ExecuteResult<string>>;

  async run<T = string>(
    promptName: string,
    variables: Record<string, any> = {},
    options: ExecuteOptions = {}
  ) {
    const prompt = await this.pezzoClient.getDeployedPromptVersion(promptName);
    const promptVersion = prompt.deployedVersion;
    const { settings, content } = promptVersion;
    const interpolatedContent = interpolateVariables(content, variables);
    const start = performance.now();

    const executionResult = await this.execute({
      content: interpolatedContent,
      settings: {
        model: settings.model,
        modelSettings: settings.modelSettings,
      },
      options,
    });

    const end = performance.now();
    const duration = Math.ceil(end - start);

    if (executionResult.error) {
      const {
        error: { error, status },
      } = executionResult;

      throw new PezzoClientError(
        `Prompt execution failed. Check the Pezzo History to see what went wrong ${promptName}.`,
        error,
        status
      );
    }

    const data: CreatePromptExecutionDto = {
      environmentName: this.pezzoClient.options.environment,
      promptId: prompt.id,
      promptVersionSha: promptVersion.sha,
      content: content,
      variables: variables,
      interpolatedContent: interpolatedContent,
      settings: settings as any,
      promptTokens: executionResult.promptTokens,
      completionTokens: executionResult.completionTokens,
      totalTokens:
        executionResult.promptTokens + executionResult.completionTokens,
      promptCost: executionResult.promptCost,
      completionCost: executionResult.completionCost,
      totalCost: executionResult.promptCost + executionResult.completionCost,
      duration: duration,
      status: executionResult.status,
      result: executionResult.result,
    };

    if (executionResult.error) {
      data.error = executionResult.error.printableError;
    }

    await this.pezzoClient.reportPromptExecution<T>(
      data,
      options.autoParseJSON
    );

    return executionResult;
  }
}
