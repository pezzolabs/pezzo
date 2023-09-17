import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { EncryptionService } from "../encryption/encryption.service";
import { ProviderApiKey } from "@prisma/client";

@Injectable()
export class ProviderApiKeysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService
  ) {}

  async getByProvider(provider: string, organizationId: string) {
    const key = await this.prisma.providerApiKey.findFirst({
      where: { provider, organizationId },
    });
    return key;
  }

  async decryptProviderApiKey(key: ProviderApiKey): Promise<string> {
    const decrypted = await this.encryptionService.decrypt(
      key.encryptedData,
      key.encryptedDataKey
    );
    return decrypted;
  }

  async getAllProviderApiKeys(organizationId: string) {
    const keys = await this.prisma.providerApiKey.findMany({
      where: { organizationId },
    });
    return keys;
  }

  async upsertProviderApiKey(
    provider: string,
    value: string,
    organizationId: string
  ) {
    const exists = await this.prisma.providerApiKey.findFirst({
      where: { provider, organizationId },
    });

    const { encryptedData, encryptedDataKey } =
      await this.encryptionService.encrypt(value);

    const censoredValue = this.censorApiKey(value);

    if (exists) {
      const key = await this.prisma.providerApiKey.update({
        where: {
          id: exists.id,
        },
        data: {
          encryptedData,
          encryptedDataKey,
          censoredValue,
        },
      });

      return key;
    }

    const key = await this.prisma.providerApiKey.create({
      data: {
        provider,
        encryptedData,
        encryptedDataKey,
        censoredValue,
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

  private censorApiKey(value: string) {
    return value.substring(value.length - 4);
  }
}
