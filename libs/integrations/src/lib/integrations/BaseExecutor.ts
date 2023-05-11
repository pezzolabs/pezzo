import { Pezzo } from "@pezzo/client";
import { interpolateVariables } from "@pezzo/common";
import { PromptExecutionStatus } from "@pezzo/graphql";

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

export abstract class BaseExecutor {
  constructor(private readonly pezzo: Pezzo) {}

  abstract execute<T>(props: ExecuteProps<unknown>): Promise<ExecuteResult<T>>;

  async run<T = string>(
    promptName: string,
    variables: Record<string, any> = {},
    options: ExecuteOptions = {}
  ) {
    const prompt = await this.pezzo.findPrompt(promptName);
    const promptVersion = await this.pezzo.getDeployedPromptVersion(prompt.id);

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

    const executionReport = await this.pezzo.reportPromptExecution({
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
      totalTokens:
        executionResult.promptTokens + executionResult.completionTokens,
      promptCost: executionResult.promptCost,
      completionCost: executionResult.completionCost,
      totalCost: executionResult.promptCost + executionResult.completionCost,
      duration,
    });

    return executionReport;
  }
}
