import { PrismaService } from "../prisma.service";
import sha256 from "sha256";
import { Injectable } from "@nestjs/common";
import { CreatePromptVersionInput } from "./inputs/create-prompt-version.input";
import { OpenAIChatSettings, interpolateVariables } from "@pezzo/common";
import { CreateChatCompletionResponse } from "openai";

@Injectable()
export class PromptsService {
  constructor(private prisma: PrismaService) {}

  async getPrompt(promptId: string) {
    const prompt = await this.prisma.prompt.findUnique({
      where: {
        id: promptId,
      },
    });
    return prompt;
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
