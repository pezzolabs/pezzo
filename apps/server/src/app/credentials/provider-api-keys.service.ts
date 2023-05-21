import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ProviderApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async getByProvider(provider: string, projectId: string) {
    const keys = await this.prisma.providerApiKey.findFirst({
      where: { provider, projectId },
    });
    return keys;
  }

  async getAllProviderApiKeys(projectId: string) {
    const keys = await this.prisma.providerApiKey.findMany({
      where: { projectId },
    });
    return keys;
  }

  async createProviderApiKey(
    provider: string,
    value: string,
    projectId: string
  ) {
    const key = await this.prisma.providerApiKey.create({
      data: {
        provider,
        value,
        projectId,
      },
    });

    return key;
  }

  async upsertProviderApiKey(
    provider: string,
    value: string,
    projectId: string
  ) {
    const exists = await this.prisma.providerApiKey.findFirst({
      where: { provider },
    });

    if (exists) {
      const key = await this.prisma.providerApiKey.update({
        where: {
          id: exists.id,
        },
        data: {
          value,
        },
      });

      return key;
    }

    const key = await this.prisma.providerApiKey.create({
      data: {
        provider,
        value,
        projectId,
      },
    });

    return key;
  }

  async deleteProviderApiKey(id: string) {
    await this.prisma.providerApiKey.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
