import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ApiKey } from "@pezzo/prisma-server";

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async getApiKeysByOrganizationId(organizationId: string): Promise<ApiKey[]> {
    const apiKeys = await this.prisma.apiKey.findMany({
      where: {
        organizationId,
      },
    });

    return apiKeys;
  }

  async getApiKey(value: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        id: value,
      },
      include: {
        organization: true,
      },
    });

    return apiKey;
  }
}
