import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Project } from "../../@generated/project/project.model";
import { CreateProjectInput } from "./inputs/create-project.input";
import { ProjectsService } from "./projects.service";
import { AuthGuard } from "../auth/auth.guard";
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { isOrgAdminOrThrow, isOrgMemberOrThrow } from "./identity.utils";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { slugify } from "@pezzo/common";
import { ProjectWhereUniqueInput } from "../../@generated/project/project-where-unique.input";
import { PinoLogger } from "../logger/pino-logger";
import { AnalyticsService } from "../analytics/analytics.service";

@UseGuards(AuthGuard)
@Resolver(() => Project)
export class ProjectsResolver {
  constructor(
    private projectsService: ProjectsService,
    private logger: PinoLogger,
    private analytics: AnalyticsService
  ) {}

  @Query(() => Project)
  async project(
    @Args("data") data: ProjectWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const { id: projectId } = data;
    let project: Project;
    this.logger.assign({ projectId }).info("Getting project");

    try {
      project = await this.projectsService.getProjectById(projectId);
    } catch (error) {
      this.logger.error({ error }, "Error getting project");
      throw new InternalServerErrorException();
    }

    if (!project) {
      throw new NotFoundException();
    }

    isOrgMemberOrThrow(user, project.organizationId);
    return project;
  }

  @Query(() => [Project])
  async projects(@CurrentUser() user: RequestUser) {
    const orgId = user.orgMemberships[0].organizationId;
    this.logger.assign({ orgId }).info("Getting projects");

    try {
      return this.projectsService.getProjectsByOrgId(orgId);
    } catch (error) {
      this.logger.error({ error }, "Error getting projects");
      throw new InternalServerErrorException();
    }
  }

  @Mutation(() => Project)
  async createProject(
    @Args("data") data: CreateProjectInput,
    @CurrentUser() user: RequestUser
  ) {
    const { organizationId, name } = data;
    isOrgAdminOrThrow(user, organizationId);
    this.logger.assign({ organizationId, name }).info("Creating project");

    const slug = slugify(data.name);
    let exists: Project;

    try {
      exists = await this.projectsService.getProjectBySlug(
        slug,
        data.organizationId
      );
    } catch (error) {
      this.logger.error({ error }, "Error checking for existing project");
      throw new InternalServerErrorException();
    }

    if (exists) {
      throw new ConflictException(`Project with slug "${slug}" already exists`);
    }

    try {
      const project = await this.projectsService.createProject(
        data.name,
        slug,
        data.organizationId,
        user.id
      );

      this.analytics.track("PROJECT:CREATED", user.id, {
        projectId: project.id,
        name,
      });

      return project;
    } catch (error) {
      this.logger.error({ error }, "Error creating project");
      throw new InternalServerErrorException();
    }
  }
}
