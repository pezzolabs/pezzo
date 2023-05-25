import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma.service";
import { OrganizationsService } from "./organizations.service";
import { ProjectsResolver } from "./projects.resolver";
import { ProjectsService } from "./projects.service";
import { UsersResolver } from "./users.resolver";
import { EnvironmentsResolver } from "./environments.resolver";
import { EnvironmentsService } from "./environments.service";
import { ApiKeysResolver } from "./api-keys.resolver";
import { ApiKeysService } from "./api-keys.service";

@Module({
  providers: [
    OrganizationsService,
    ProjectsResolver,
    UsersResolver,
    PrismaService,
    UsersService,
    ProjectsService,
    EnvironmentsResolver,
    EnvironmentsService,
    ApiKeysService,
    ApiKeysResolver,
  ],
  exports: [
    UsersService,
    OrganizationsService,
    ProjectsService,
    ApiKeysService,
    ApiKeysResolver,
    EnvironmentsService,
  ],
})
export class IdentityModule {}
