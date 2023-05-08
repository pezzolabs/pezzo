import {
  ConfigurationParameters as OpenAIConfigurationParameters,
  CreateChatCompletionResponse,
} from "openai";
import { OpenAIChatSettings } from "@pezzo/common";
import { interpolateVariables } from "./utils/interpolate-variables";
import { PromptExecutionStatus } from "../@generated/graphql/graphql";
import * as tiktoken from "@dqbd/tiktoken";
import { OpenAIChatCompletion } from "./models/OpenAIChatCompletion";
import { PezzoAPIClient } from "./PezzoAPIClient";
import { TestPromptResult } from "./types/client.types";

interface PezzoClientOptions {
  pezzoServerUrl: string;
  environment: string;
  openAIConfiguration: OpenAIConfigurationParameters;
}

export class Pezzo {
  private readonly openAIChatCompletion: OpenAIChatCompletion;
  private readonly options: PezzoClientOptions;
  private readonly pezzoAPIClient: PezzoAPIClient;

  constructor(options: PezzoClientOptions) {
    this.options = options;
    this.openAIChatCompletion = new OpenAIChatCompletion(
      options.openAIConfiguration
    );
    this.pezzoAPIClient = new PezzoAPIClient({
      graphqlEndpoint: `${options.pezzoServerUrl}/graphql`,
    });
  }

  async runPrompt(
    promptName: string,
    variables: Record<string, boolean | number | string> = {},
    options: { autoAdjustMaxTokens: boolean } = { autoAdjustMaxTokens: false }
  ) {
    const prompt = await this.pezzoAPIClient.findPrompt(promptName);
    const promptVersion = await this.pezzoAPIClient.getDeployedPromptVersion(
      prompt.id,
      this.options.environment
    );

    const settings = promptVersion.settings as OpenAIChatSettings;
    const start = performance.now();
    const content = promptVersion.content;
    const interpolatedContent = interpolateVariables(content, variables);

    let completion: CreateChatCompletionResponse;
    let max_tokens: number = settings.max_tokens;

    // TODO: move over to OpenAI integration
    if (options.autoAdjustMaxTokens) {
      const encoder = tiktoken.encoding_for_model(settings.model);
      const modelMaxTokens = settings.model === "gpt-4" ? 4097 : 2048;
      const encodedContent = encoder.encode(interpolatedContent);
      const numTokens = Math.ceil(encodedContent.length);
      const maxResponseTokens = Math.floor((modelMaxTokens - numTokens) * 0.95);
      max_tokens = maxResponseTokens;
    }

    try {
      completion = await this.openAIChatCompletion.createChatCompletion(
        {
          model: settings.model,
          top_p: settings.top_p,
          temperature: settings.temperature,
          max_tokens,
          presence_penalty: settings.presence_penalty,
          frequency_penalty: settings.frequency_penalty,
        },
        interpolatedContent
      );
    } catch (error) {
      const end = performance.now();
      const duration = Math.ceil(end - start);

      await this.pezzoAPIClient.reportPromptExecution({
        prompt: {
          connect: {
            id: prompt.id as string,
          },
        },
        promptVersionSha: promptVersion.sha,
        status: PromptExecutionStatus.Error,
        content,
        interpolatedContent,
        settings: settings as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        result: null,
        error: JSON.stringify(error.response.data.error),
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        promptCost: 0,
        completionCost: 0,
        totalCost: 0,
        duration,
        variables,
      });

      // Throw original error
      throw error;
    }

    const end = performance.now();
    const duration = Math.ceil(end - start);

    const result = completion.choices[0].message.content;

    const promptTokens = completion.usage.prompt_tokens;
    const completionTokens = completion.usage.completion_tokens;
    const totalTokens = completion.usage.total_tokens;

    const promptCost = (promptTokens / 1000) * 0.002;
    const completionCost = (completionTokens / 1000) * 0.002;
    const totalCost = promptCost + completionCost;

    const executionReport = await this.pezzoAPIClient.reportPromptExecution({
      prompt: {
        connect: {
          id: prompt.id,
        },
      },
      promptVersionSha: promptVersion.sha,
      status: PromptExecutionStatus.Success,
      content,
      interpolatedContent,
      settings: settings as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      result,
      error: null,
      promptTokens,
      completionTokens,
      totalTokens,
      promptCost,
      completionCost,
      totalCost,
      duration,
      variables,
    });

    return executionReport;
  }

  async testPrompt(
    content: string,
    settings: OpenAIChatSettings,
    variables: Record<string, boolean | number | string> = {}
  ): Promise<TestPromptResult> {
    const start = performance.now();

    const interpolatedContent = interpolateVariables(content, variables);
    let completion: CreateChatCompletionResponse;

    try {
      completion = await this.openAIChatCompletion.createChatCompletion(
        {
          model: settings.model,
          top_p: settings.top_p,
          temperature: settings.temperature,
          max_tokens: settings.max_tokens,
          presence_penalty: settings.presence_penalty,
          frequency_penalty: settings.frequency_penalty,
        },
        interpolatedContent
      );
    } catch (error) {
      const end = performance.now();
      const duration = Math.ceil(end - start);

      return {
        success: false,
        result: null,
        error: JSON.stringify(error.response.data.error),
        content,
        interpolatedContent,
        settings,
        duration,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        promptCost: 0,
        completionCost: 0,
        totalCost: 0,
        variables,
      };
    }

    const end = performance.now();
    const duration = Math.ceil(end - start);

    const result = completion.choices[0].message.content;
    const promptTokens = completion.usage.prompt_tokens;
    const completionTokens = completion.usage.completion_tokens;
    const totalTokens = completion.usage.total_tokens;

    const promptCost = (promptTokens / 1000) * 0.002;
    const completionCost = (completionTokens / 1000) * 0.002;
    const totalCost = promptCost + completionCost;

    return {
      success: true,
      result,
      error: null,
      content,
      interpolatedContent,
      settings,
      duration,
      promptTokens,
      completionTokens,
      totalTokens,
      promptCost,
      completionCost,
      totalCost,
      variables,
    };
  }
}
