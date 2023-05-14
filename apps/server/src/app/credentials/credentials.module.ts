import { Module } from "@nestjs/common";
import { ProviderApiKeysResolver } from "./provider-api-keys.resolver";
import { PrismaService } from "../prisma.service";
import { ProviderApiKeysService } from "./provider-api-keys.service";
import { IdentityModule } from "../identity/identity.module";

@Module({
  imports: [IdentityModule],
  providers: [PrismaService, ProviderApiKeysResolver, ProviderApiKeysService],
  exports: [ProviderApiKeysService],
})
export class CredentialsModule {}
