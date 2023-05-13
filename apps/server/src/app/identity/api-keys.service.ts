import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class APIKeysService {
  constructor(private readonly prisma: PrismaService) {}
  
  async getApiKeyByOrganizationId(organizationId: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        organizationId: organizationId,
      },
    });

    return apiKey;
  }

  async getApiKey(id: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: {
        id: id,
      },
    });

    return apiKey;
  }
}