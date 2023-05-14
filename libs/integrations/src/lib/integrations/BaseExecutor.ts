import { Pezzo } from "@pezzo/client";
import { interpolateVariables } from "../utils/interpolate-variables";
import { GraphQLFormattedError } from "graphql";
import { PezzoClientError } from "./PezzoClientError";

export interface ExecuteProps<T> {
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
    error;
    printableError: string;
    status: number;
  };
  result?: string;
}

export abstract class BaseExecutor {
  constructor(private readonly pezzo: Pezzo) {}

  abstract execute<T>(props: ExecuteProps<unknown>): Promise<ExecuteResult<T>>;

  async run<T = string>(
    promptName: string,
    variables: Record<string, any> = {},
    options: ExecuteOptions = {}
  ) {
    // let promptVersion;

    let prompt;
    let promptVersion;

    try {
      prompt = await this.pezzo.findPrompt(promptName);
    } catch (_error) {
      const error = _error.response.errors[0] as GraphQLFormattedError;
      throw new PezzoClientError(error.message, error);
    }

    try {
      promptVersion = await this.pezzo.getDeployedPromptVersion(prompt.id);
    } catch (_error) {
      const error = _error.response.errors[0] as GraphQLFormattedError;
      throw new PezzoClientError(error.message, error);
    }

    const settings = promptVersion.settings as any;
    const content = promptVersion.content;
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

    try {
      const executionReport = await this.pezzo.reportPromptExecution({
        prompt: {
          connect: {
            id: prompt.id,
          },
        },
        promptVersionSha: promptVersion.sha,
        status: executionResult.status,
        content,
        variables,
        interpolatedContent,
        settings: settings as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        result: executionResult.result,
        error: executionResult.error.printableError,
        promptTokens: executionResult.promptTokens,
        completionTokens: executionResult.completionTokens,
        totalTokens:
          executionResult.promptTokens + executionResult.completionTokens,
        promptCost: executionResult.promptCost,
        completionCost: executionResult.completionCost,
        totalCost: executionResult.promptCost + executionResult.completionCost,
        duration,
      });

      if (executionResult.error) {
        throw new PezzoClientError(
          "Prompt execution failed. Check the Pezzo History to see what went wrong.",
          executionResult.error.error,
          executionResult.error.status
        );
      }

      return executionReport;
    } catch (error) {
      // We do not want to fail the request, so we just log the error
      console.error(`Failed to report prompt execution to Pezzo`, error);
    }
  }
}
