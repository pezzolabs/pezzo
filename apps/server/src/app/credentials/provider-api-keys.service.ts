import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ProviderApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async getByProvider(provider: string, organizationId: string) {
    const keys = await this.prisma.providerApiKey.findFirst({
      where: { provider, organizationId },
    });
    return keys;
  }

  async getAllProviderApiKeys(organizationId: string) {
    const keys = await this.prisma.providerApiKey.findMany({
      where: { organizationId },
    });
    return keys;
  }

  async createProviderApiKey(
    provider: string,
    value: string,
    organizationId: string
  ) {
    const key = await this.prisma.providerApiKey.create({
      data: {
        provider,
        value,
        organizationId,
      },
    });

    return key;
  }

  async upsertProviderApiKey(
    provider: string,
    value: string,
    organizationId: string
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
        organizationId,
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
