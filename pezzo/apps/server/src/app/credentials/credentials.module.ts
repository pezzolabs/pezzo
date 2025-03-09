import { Module } from "@nestjs/common";
import { ProviderApiKeysResolver } from "./provider-api-keys.resolver";
import { PrismaService } from "../prisma.service";
import { ProviderApiKeysService } from "./provider-api-keys.service";
import { IdentityModule } from "../identity/identity.module";
import { EncryptionModule } from "../encryption/encryption.module";

@Module({
  imports: [IdentityModule, EncryptionModule],
  providers: [PrismaService, ProviderApiKeysResolver, ProviderApiKeysService],
  exports: [ProviderApiKeysService],
})
export class CredentialsModule {}
