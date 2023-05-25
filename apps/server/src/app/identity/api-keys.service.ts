import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async getApiKeyByEnvironmentId(environmentId: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        environmentId,
      },
    });

    return apiKey;
  }

  async getApiKey(value: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        id: value,
      },
      include: {
        environment: true
      }
    });

    return apiKey;
  }
}
