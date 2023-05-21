import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class APIKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async getApiKeyByProjectId(projectId: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        projectId,
      },
    });

    return apiKey;
  }

  async getApiKey(value: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        id: value,
      },
    });

    return apiKey;
  }
}
