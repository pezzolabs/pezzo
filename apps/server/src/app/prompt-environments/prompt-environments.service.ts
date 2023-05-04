import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PromptEnvironmentsService {
  constructor(private prisma: PrismaService) {}

  async createPromptEnvironment(promptId: string, environmentSlug: string, promptVersionSha: string) {
    const promptEnvironment = await this.prisma.promptEnvironment.upsert({
      create: {
        id: `${environmentSlug}_${promptId}`,
        promptId,
        environmentSlug,
        promptVersionSha,
      },
      update: {
        id: `${environmentSlug}_${promptId}`,
        promptId,
        environmentSlug,
        promptVersionSha,
      },
      where: {
        id: `${environmentSlug}_${promptId}`,
      }
    });

    return promptEnvironment;
  };

  async getPromptEnvironment(promptId: string, environmentSlug: string) {
    const promptEnvironment = await this.prisma.promptEnvironment.findFirst({
      where: {
        promptId,
        environmentSlug,
      }
    });

    return promptEnvironment;
  }
}
