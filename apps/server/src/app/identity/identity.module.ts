import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma.service";
import { OrganizationsService } from "./organizations.service";
import { APIKeysService } from "./api-keys.service";
import { ApiKeysResolver } from "./api-keys.resolver";

@Module({
  providers: [
    PrismaService,
    UsersService,
    OrganizationsService,
    APIKeysService,
    ApiKeysResolver,
  ],
  exports: [UsersService, OrganizationsService, APIKeysService],
})
export class IdentityModule {}
