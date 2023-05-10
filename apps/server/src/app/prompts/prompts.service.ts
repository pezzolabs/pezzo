import { PrismaService } from "../prisma.service";
import sha256 from "sha256";
import { Injectable } from "@nestjs/common";
import { CreatePromptVersionInput } from "./inputs/create-prompt-version.input";
import { OpenAIChatSettings, interpolateVariables } from "@pezzo/common";
import { CreateChatCompletionResponse } from "openai";
import { IntegrationService } from "../common/integration.service";
import { TestPromptResult } from "./types";

@Injectable()
export class PromptsService {
  constructor(
    private prisma: PrismaService,
    private integrationService: IntegrationService
  ) {}

  async runTestPrompt(
    content: string,
    settings: OpenAIChatSettings,
    variables: Record<string, boolean | number | string> = {}
  ): Promise<TestPromptResult> {
    const start = performance.now();

    const interpolatedContent = interpolateVariables(content, variables);
    let completion: CreateChatCompletionResponse;

    try {
      completion = await this.integrationService.openAI.createChatCompletion(
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
  async createPrompt(name: string, integrationId: string) {
    const prompt = await this.prisma.prompt.create({
      data: {
        integrationId,
        name,
        versions: {
          create: [],
        },
      },
    });
    return prompt;
  }

  async createPromptVersion(data: CreatePromptVersionInput) {
    const { mode, content, settings, promptId } = data;

    const sha = sha256(
      `${JSON.stringify({ mode, content, settings })}-${promptId}-${Date.now()}`
    ) as string;

    const version = await this.prisma.promptVersion.create({
      data: {
        sha,
        content,
        settings: settings as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        promptId,
      },
    });

    return version;
  }

  async getPromptVersions(promptId: string) {
    const promptVersions = await this.prisma.promptVersion.findMany({
      where: {
        promptId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return promptVersions;
  }

  async getPromptVersion(sha: string) {
    const promptVersion = await this.prisma.promptVersion.findUnique({
      where: {
        sha,
      },
    });
    return promptVersion;
  }

  async getLatestPromptVersion(promptId: string) {
    const promptVersion = await this.prisma.promptVersion.findFirst({
      where: {
        promptId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return promptVersion;
  }

  async getPromptVersionBySha(sha: string) {
    const promptVersion = await this.prisma.promptVersion.findUnique({
      where: {
        sha,
      },
    });
    return promptVersion;
  }
}
