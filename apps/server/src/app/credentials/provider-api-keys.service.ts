import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ProviderAPIKey } from "@prisma/client";

@Injectable()
export class ProviderAPIKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async getByProvider(provider: string) {
    const keys = await this.prisma.providerAPIKey.findFirst({
      where: { provider },
    });
    return keys;
  }

  async getAllProviderAPIKeys() {
    const keys = await this.prisma.providerAPIKey.findMany();
    return keys;
  }

  async createProviderAPIKey(provider: string, value: string) {
    const key = await this.prisma.providerAPIKey.create({
      data: {
        provider,
        value,
      },
    });

    return key;
  }

  async upsertProviderAPIKey(provider: string, value: string) {
    const exists = await this.prisma.providerAPIKey.findFirst({
      where: { provider },
    });

    if (exists) {
      const key = await this.prisma.providerAPIKey.update({
        where: {
          id: exists.id,
        },
        data: {
          value,
        },
      });

      return key;
    }

    const key = await this.prisma.providerAPIKey.create({
      data: {
        provider,
        value,
      },
    });

    return key;
  }

  async deleteProviderAPIKey(id: string) {
    await this.prisma.providerAPIKey.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
