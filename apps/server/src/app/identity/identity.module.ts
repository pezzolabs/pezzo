import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma.service";
import { OrganizationsService } from "./organizations.service";
import { APIKeysService } from "./api-keys.service";
import { ApiKeysResolver } from "./api-keys.resolver";
import { ProjectsResolver } from "./projects.resolver";
import { ProjectsService } from "./projects.service";

@Module({
  providers: [
    OrganizationsService,
    ApiKeysResolver,
    ProjectsResolver,
    PrismaService,
    UsersService,
    APIKeysService,
    ProjectsService,
  ],
  exports: [
    UsersService,
    OrganizationsService,
    ProjectsService,
    APIKeysService,
  ],
})
export class IdentityModule {}
