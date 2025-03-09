import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Environment } from "../../@generated/environment/environment.model";
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { CreateEnvironmentInput } from "./inputs/create-environment.input";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { AuthGuard } from "../auth/auth.guard";
import { EnvironmentsService } from "./environments.service";
import { GetEnvironmentsInput } from "./inputs/get-environments.input";
import {
  isOrgAdminOrThrow,
  isOrgMemberOrThrow,
} from "./identity.utils";
import { PinoLogger } from "../logger/pino-logger";
import { AnalyticsService } from "../analytics/analytics.service";
import { PrismaService } from "../prisma.service";
import { EnvironmentWhereUniqueInput } from "../../@generated/environment/environment-where-unique.input";
import { ProjectsService } from "./projects.service";

@UseGuards(AuthGuard)
@Resolver(() => Environment)
export class EnvironmentsResolver {
  constructor(
    private environmentsService: EnvironmentsService,
    private projectsService: ProjectsService,
    private logger: PinoLogger,
    private analytics: AnalyticsService,
    private prisma: PrismaService
  ) {}

  @Query(() => [Environment])
  async environments(
    @Args("data") data: GetEnvironmentsInput,
    @CurrentUser() user: RequestUser
  ) {
    const { projectId } = data;

    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    try {
      this.logger.assign({ projectId }).info("Getting environments");
      return this.environmentsService.getAll(projectId);
    } catch (error) {
      this.logger.error({ error }, "Error getting environments");
      throw new InternalServerErrorException();
    }
  }

  @Mutation(() => Environment)
  async createEnvironment(
    @Args("data") data: CreateEnvironmentInput,
    @CurrentUser() user: RequestUser
  ) {
    const { projectId, name } = data;
    this.logger.assign({ projectId, name });

    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    isOrgMemberOrThrow(user, project.organizationId);

    let exists: Environment;

    try {
      exists = await this.environmentsService.getByName(name, projectId);
    } catch (error) {
      this.logger.error({ error }, "Error checking for existing environment");
      throw new InternalServerErrorException();
    }

    if (exists) {
      throw new ConflictException(`Environment "${name}" already exists`);
    }

    try {
      this.logger.info("Creating environment");
      const environment = await this.environmentsService.createEnvironment(
        name,
        projectId
      );
      this.analytics.trackEvent("environment_created", {
        projectId,
        name,
        environmentId: environment.id,
      });
      return environment;
    } catch (error) {
      this.logger.error({ error }, "Error creating environment");
      throw new InternalServerErrorException();
    }
  }

  @Mutation(() => Environment)
  async deleteEnvironment(
    @Args("data") data: EnvironmentWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const { id } = data;
    this.logger.assign({ environmentId: id });
    this.logger.info("Deleting environment");

    const environment = await this.environmentsService.getById(id);

    if (!environment) {
      throw new NotFoundException(`Environment with id "${id}" not found`);
    }

    const project = await this.projectsService.getProjectById(
      environment.projectId
    );

    isOrgAdminOrThrow(user, project.organizationId);

    await this.environmentsService.deleteEnvironment(id);
    return environment;
  }
}
