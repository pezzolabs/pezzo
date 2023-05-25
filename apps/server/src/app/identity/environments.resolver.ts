import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Environment } from "../../@generated/environment/environment.model";
import {
  ConflictException,
  InternalServerErrorException,
  UseGuards,
} from "@nestjs/common";
import { CreateEnvironmentInput } from "./inputs/create-environment.input";
import { CurrentUser } from "../identity/current-user.decorator";
import { RequestUser } from "../identity/users.types";
import { AuthGuard } from "../auth/auth.guard";
import { EnvironmentsService } from "./environments.service";
import { GetEnvironmentsInput } from "./inputs/get-environments.input";
import { isProjectMemberOrThrow } from "../identity/identity.utils";
import { PinoLogger } from "../logger/pino-logger";
import { AnalyticsService } from "../analytics/analytics.service";
import { ApiKeysService } from "./api-keys.service";

@UseGuards(AuthGuard)
@Resolver(() => Environment)
export class EnvironmentsResolver {
  constructor(
    private environmentsService: EnvironmentsService,
    private logger: PinoLogger,
    private analytics: AnalyticsService,
    private apiKeysService: ApiKeysService,
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

  @ResolveField(() => Environment)
  async apiKey (@Parent() environment: Environment) {
    return this.apiKeysService.getApiKeyByEnvironmentId(environment.id);
  }

  @Mutation(() => Environment)
  async createEnvironment(
    @Args("data") data: CreateEnvironmentInput,
    @CurrentUser() user: RequestUser
  ) {
    const { projectId, name } = data;
    this.logger.assign({ projectId, name });
    isProjectMemberOrThrow(user, projectId);
    let exists: Environment;

    try {
      exists = await this.environmentsService.getByName(name, projectId);
    } catch (error) {
      this.logger.error({ error }, "Error checking for existing environment");
      throw new InternalServerErrorException();
    }

    if (exists) {
      throw new ConflictException(
        `Environment "${name}" already exists`
      );
    }

    try {
      this.logger.info("Creating environment");
      const environment = await this.environmentsService.createEnvironment(
        name,
        projectId
      );
      this.analytics.track("ENVIRONMENT:CREATED", user.id, {
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
}
