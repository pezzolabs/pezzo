import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PromptEnvironmentsService {
  constructor(private prisma: PrismaService) {}

  async createPromptEnvironment(
    promptId: string,
    environmentId: string,
    promptVersionSha: string,
    publishedByUserId: string
  ) {
    const promptEnvironment = await this.prisma.promptEnvironment.upsert({
      create: {
        id: `${environmentId}_${promptId}`,
        promptId,
        environmentId,
        promptVersionSha,
        publishedById: publishedByUserId,
      },
      update: {
        promptId,
        environmentId,
        promptVersionSha,
      },
      where: {
        id: `${environmentId}_${promptId}`,
      },
    });

    return promptEnvironment;
  }

  async getPromptEnvironment(promptId: string, environmentId: string) {
    const promptEnvironment = await this.prisma.promptEnvironment.findUnique({
      where: { id: `${environmentId}_${promptId}` },
    });

    return promptEnvironment;
  }
}
