import {PrismaService} from "../prisma.service";
import sha256 from "sha256";
import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {CreatePromptVersionInput} from "./inputs/create-prompt-version.input";
import {CreatePromptInput} from "./inputs/create-prompt.input";
import {GaiPlatform} from "@pezzo/client";
import {PinoLogger} from "../logger/pino-logger";

@Injectable()
export class PromptsService {
  constructor(
    private prisma: PrismaService,
    private logger: PinoLogger
  ) {}

  async getPrompt(promptId: string) {
    const prompt = await this.prisma.prompt.findUnique({
      where: {
        id: promptId,
      },
    });
    return prompt;
  }

  async getPromptByName(name: string, projectId: string) {
    const prompt = await this.prisma.prompt.findFirst({
      where: {
        name,
        projectId,
      },
    });
    return prompt;
  }

  async createPrompt(data: CreatePromptInput) {
    const { name, projectId } = data;
    const prompt = await this.prisma.prompt.create({
      data: {
        projectId,
        name,
        versions: {
          create: [],
        },
      },
    });
    return prompt;
  }

  async deletePrompt(id: string) {
    return this.prisma.prompt.delete({
      where: {
        id,
      },
    });
  }

  async createPromptVersion(
    data: CreatePromptVersionInput,
    createdByUserId: string
  ) {
    const { promptId, type, service, content, settings, message } = data;

    const sha = sha256(
      `${JSON.stringify({ content, settings })}-${promptId}-${Date.now()}`
    ) as string;

    const version = await this.prisma.promptVersion.create({
      data: {
        sha,
        type,
        service,
        content,
        settings: settings as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        promptId,
        createdById: createdByUserId,
        message,
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

  async getModels() {
    const gaiPlatform = new GaiPlatform({});
    return await gaiPlatform.getModels();
  }

  async getAllPrompts(projectId: string) {
    try {
      const prompts = await this.prisma.prompt.findMany({
        where: {
          projectId: projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return prompts;
    } catch (error) {
      this.logger.error({ error }, "Error getting prompts");
      throw new InternalServerErrorException();
    }
  }
}
