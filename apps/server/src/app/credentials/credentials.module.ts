import { Module } from "@nestjs/common";
import { ProviderAPIKeysResolver } from "./provider-api-keys.resolver";
import { PrismaService } from "../prisma.service";
import { ProviderAPIKeysService } from "./provider-api-keys.service";

@Module({
  providers: [PrismaService, ProviderAPIKeysResolver, ProviderAPIKeysService],
})
export class CredentialsModule {}
