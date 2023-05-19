import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Environment } from "../../@generated/environment/environment.model";
import { PrismaService } from "../prisma.service";
import {
  ConflictException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { CreateEnvironmentInput } from "./inputs/create-environment.input";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { AuthGuard } from "../auth/auth.guard";
import { GetEnvironmentBySlugInput } from "./inputs/get-environment-by-slug.input";
import { EnvironmentsService } from "./environments.service";
import { GetEnvironmentsInput } from "./inputs/get-environments.input";
import { isProjectMemberOrThrow } from "../identity/identity.utils";

@UseGuards(AuthGuard)
@Resolver(() => Environment)
export class EnvironmentsResolver {
  constructor(
    private prisma: PrismaService,
    private environmentsService: EnvironmentsService
  ) {}

  @Query(() => [Environment])
  async environments(
    @Args("data") data: GetEnvironmentsInput,
    @CurrentUser() user: RequestUser
  ) {
    const environments = await this.prisma.environment.findMany({
      where: {
        projectId: data.projectId,
      },
    });
    return environments;
  }

  @Query(() => Environment)
  async environment(
    @Args("data") data: GetEnvironmentBySlugInput,
    @CurrentUser() user: RequestUser
  ) {
    isProjectMemberOrThrow(user, data.projectId);

    const environment = await this.environmentsService.getBySlug(
      data.slug,
      data.projectId,
    );

    if (!environment) {
      throw new NotFoundException(
        `Environment with slug "${data.slug}" not found`
      );
    }

    return environment;
  }

  @Mutation(() => Environment)
  async createEnvironment(
    @Args("data") data: CreateEnvironmentInput,
    @CurrentUser() user: RequestUser
  ) {
    const exists = await this.environmentsService.getBySlug(
      data.slug,
      data.projectId
    );

    if (exists) {
      throw new ConflictException(
        `Environment with slug "${data.slug}" already exists`
      );
    }

    const environment = await this.prisma.environment.create({
      data: {
        name: data.name,
        slug: data.slug,
        projectId: data.projectId,
      },
    });

    return environment;
  }
}
