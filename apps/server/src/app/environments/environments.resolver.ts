import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Environment } from "../../@generated/environment/environment.model";
import { PrismaService } from "../prisma.service";
import {
  ConflictException,
  InternalServerErrorException,
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
import { PinoLogger } from "../logger/pino-logger";

@UseGuards(AuthGuard)
@Resolver(() => Environment)
export class EnvironmentsResolver {
  constructor(
    private prisma: PrismaService,
    private environmentsService: EnvironmentsService,
    private logger: PinoLogger
  ) {}

  @Query(() => [Environment])
  async environments(
    @Args("data") data: GetEnvironmentsInput,
    @CurrentUser() user: RequestUser
  ) {
    const { projectId } = data;
    isProjectMemberOrThrow(user, projectId);

    try {
      this.logger.assign({ projectId }).info("Getting environments");
      return this.environmentsService.getAll(projectId);
    } catch (error) {
      this.logger.error({ error }, "Error getting environments");
      throw new InternalServerErrorException();
    }
  }

  @Query(() => Environment)
  async environment(
    @Args("data") data: GetEnvironmentBySlugInput,
    @CurrentUser() user: RequestUser
  ) {
    const { slug, projectId } = data;
    isProjectMemberOrThrow(user, projectId);
    let environment: Environment;

    try {
      this.logger.assign({ slug, projectId }).info("Getting environment");
      environment = await this.environmentsService.getBySlug(slug, projectId);
    } catch (error) {
      this.logger.error({ error }, "Error getting environment");
      throw new InternalServerErrorException();
    }

    if (!environment) {
      throw new NotFoundException(`Environment with slug "${slug}" not found`);
    }

    return environment;
  }

  @Mutation(() => Environment)
  async createEnvironment(
    @Args("data") data: CreateEnvironmentInput,
    @CurrentUser() user: RequestUser
  ) {
    const { projectId, slug, name } = data;
    this.logger.assign({ projectId, slug });
    isProjectMemberOrThrow(user, projectId);
    let exists: Environment;

    try {
      exists = await this.environmentsService.getBySlug(slug, projectId);
    } catch (error) {
      this.logger.error({ error }, "Error checking for existing environment");
      throw new InternalServerErrorException();
    }

    if (exists) {
      throw new ConflictException(
        `Environment with slug "${slug}" already exists`
      );
    }

    try {
      this.logger.info("Creating environment");
      return this.environmentsService.createEnvironment(name, slug, projectId);
    } catch (error) {
      this.logger.error({ error }, "Error creating environment");
      throw new InternalServerErrorException();
    }
  }
}
