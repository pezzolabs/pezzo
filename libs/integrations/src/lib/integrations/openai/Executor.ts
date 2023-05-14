import { BaseExecutor, ExecuteProps, ExecuteResult } from "../BaseExecutor";
import { Pezzo } from "@pezzo/client";
import { IntegrationSettings } from "./types";
import { Configuration, OpenAIApi } from "openai";

interface ExecutorOptions {
  apiKey: string;
}

export class Executor extends BaseExecutor {
  private readonly openai: OpenAIApi;

  constructor(pezzo: Pezzo, options: ExecutorOptions) {
    super(pezzo);

    const configuration = new Configuration({
      apiKey: options.apiKey,
    });

    this.openai = new OpenAIApi(configuration);
  }

  async execute<T>(
    props: ExecuteProps<IntegrationSettings>
  ): Promise<ExecuteResult<T>> {
    const { settings, content } = props;

    try {
      const result = await this.openai.createChatCompletion({
        model: settings.model,
        temperature: settings.modelSettings.temperature,
        top_p: settings.modelSettings.top_p,
        max_tokens: settings.modelSettings.max_tokens,
        presence_penalty: settings.modelSettings.presence_penalty,
        frequency_penalty: settings.modelSettings.frequency_penalty,
        messages: [
          {
            role: "user",
            content,
          },
        ],
      });

      const data = result.data as any;
      const { usage } = data;

      const promptTokens = usage.prompt_tokens;
      const completionTokens = usage.completion_tokens;

      const { promptCost, completionCost } = this.calculateCost(
        settings.model,
        promptTokens,
        completionTokens
      );

      return {
        status: "Success",
        promptTokens,
        completionTokens,
        promptCost,
        completionCost,
        result: data.choices[0].message.content,
      };
    } catch (error) {
      const errorResult = error.response.data.error;
      const statusCode = error.response.status;
      console.log("statusCOde", statusCode);

      return {
        status: "Error",
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

  private calculateCost(
    model: string,
    promptTokens: number,
    completionTokens: number
  ) {
    const costPer1000TokensPrompt = model === "gpt-4" ? 0.03 : 0.002;
    const costPer1000TokensCompletions =
      model === "gpt-3.5-turbo" ? 0.06 : 0.002;

    const promptCost = (promptTokens / 1000) * costPer1000TokensPrompt;
    const completionCost =
      (completionTokens / 1000) * costPer1000TokensCompletions;

    return {
      promptCost,
      completionCost,
    };
  }
}
