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

@UseGuards(AuthGuard)
@Resolver(() => Environment)
export class EnvironmentsResolver {
  constructor(
    private prisma: PrismaService,
    private environmentsService: EnvironmentsService
  ) {}

  @Query(() => [Environment])
  async environments(@CurrentUser() user: RequestUser) {
    const environments = await this.prisma.environment.findMany({
      where: {
        organizationId: user.orgMemberships[0].organizationId,
      },
    });
    return environments;
  }

  @Query(() => Environment)
  async environment(
    @Args("data") data: GetEnvironmentBySlugInput,
    @CurrentUser() user: RequestUser
  ) {
    const environment = await this.environmentsService.getBySlug(
      data.slug,
      user.orgMemberships[0].organizationId
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
      user.orgMemberships[0].organizationId
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
        organizationId: user.orgMemberships[0].organizationId,
      },
    });

    return environment;
  }
}
