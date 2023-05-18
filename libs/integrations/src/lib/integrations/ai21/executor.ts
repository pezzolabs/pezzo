import axios, { AxiosInstance } from "axios";
import { AI21CompletionResponse, AI21IntegrationSettings } from "./types";
import { BaseExecutor, ExecuteProps, ExecuteResult } from "../base-executor";
import { Pezzo } from "@pezzo/client";
import { ExecutorOptions } from "../types";
import { PromptExecutionStatus } from "../../../@generated/graphql/graphql";

export class AI21Executor extends BaseExecutor {
  private readonly axios: AxiosInstance;

  constructor(pezzoClient: Pezzo, options: ExecutorOptions) {
    super(pezzoClient);
    this.axios = axios.create({
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async execute(
    props: ExecuteProps<AI21IntegrationSettings>
  ): Promise<ExecuteResult<string>> {
    const { settings, content } = props;

    const url = `https://api.ai21.com/studio/v1/${settings.model}/complete`;

    try {
      const result = await this.axios.post<AI21CompletionResponse>(url, {
        prompt: content,
        ...settings.modelSettings,
      });

      const data = result.data;

      const promptTokens = data.prompt.tokens.length;
      const completionTokens = data.completions[0].data.tokens.length;
      const costPer1000Tokens = this.getCostPer1000Tokens(settings.model);

      const promptCost = (promptTokens / 1000) * costPer1000Tokens;
      const completionCost = (completionTokens / 1000) * costPer1000Tokens;

      return {
        status: PromptExecutionStatus.Success,
        promptTokens,
        completionTokens,
        promptCost,
        completionCost,
        result: data.completions[0].data.text,
      };
    } catch (error) {
      const errorResult = error.response.data;
      const statusCode = error.response.status;

      return {
        status: PromptExecutionStatus.Error,
        promptTokens: 0,
        completionTokens: 0,
        promptCost: 0,
        completionCost: 0,
        result: null,
        error: {
          error: errorResult,
          printableError: JSON.stringify(errorResult),
          status: statusCode,
        },
      };
    }
  }

  private getCostPer1000Tokens(model: string) {
    switch (model) {
      case "j2-jumbo-instruct":
        return 0.015;
      case "j2-jumbo":
        return 0.015;
      case "j2-grande-instruct":
        return 0.01;
      case "j2-grande":
        return 0.01;
      default:
        return 0;
    }
  }
}
