import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
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
import { slugify } from "pezzo/libs/common/src";
import { ProjectWhereUniqueInput } from "../../@generated/project/project-where-unique.input";
import { PinoLogger } from "../logger/pino-logger";
import { AnalyticsService } from "../analytics/analytics.service";
import { Organization } from "../../@generated/organization/organization.model";
import { GetProjectsInput } from "./inputs/get-projects.input";
import { UpdateProjectSettingsInput } from "./inputs/update-project-settings.input";

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
  async projects(
    @Args("data") data: GetProjectsInput,
    @CurrentUser() user: RequestUser
  ) {
    const { organizationId } = data;
    isOrgMemberOrThrow(user, organizationId);
    this.logger.assign({ organizationId }).info("Getting projects");

    try {
      return await this.projectsService.getProjectsByOrgId(organizationId);
    } catch (error) {
      this.logger.error({ error }, "Error getting projects");
      throw new InternalServerErrorException();
    }
  }

  @Mutation(() => Project)
  async createProject(@Args("data") data: CreateProjectInput) {
    const { organizationId, name } = data;

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
        data.organizationId
      );

      this.analytics.trackEvent("project_created", {
        projectId: project.id,
        name,
      });

      return project;
    } catch (error) {
      this.logger.error({ error }, "Error creating project");
      throw new InternalServerErrorException();
    }
  }

  @Mutation(() => Project)
  async updateProjectSettings(
    @Args("data") data: UpdateProjectSettingsInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign(data);

    let project: Project;

    try {
      project = await this.projectsService.getProjectById(data.projectId);
    } catch (error) {
      this.logger.error({ error }, "Error checking for existing project");
      throw new InternalServerErrorException();
    }

    if (!project) {
      throw new NotFoundException(`Project does not exist`);
    }

    isOrgAdminOrThrow(user, project.organizationId);

    this.logger.info("Updating project settings");

    try {
      const project = await this.projectsService.updateProjectSettings(data);
      this.logger.info("Project settings updated");

      this.analytics.trackEvent("project_settings_updated", {
        projectId: project.id,
        name: project.name,
      });

      return project;
    } catch (error) {
      this.logger.error({ error }, "Error updating project settings");
      throw new InternalServerErrorException();
    }
  }

  @Mutation(() => Project)
  async deleteProject(
    @Args("data") data: ProjectWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const { id } = data;
    this.logger.assign({ id });

    let project: Project;

    try {
      project = await this.projectsService.getProjectById(id);
    } catch (error) {
      this.logger.error({ error }, "Error checking for existing project");
      throw new InternalServerErrorException();
    }

    if (!project) {
      throw new NotFoundException(`Project does not exist`);
    }

    isOrgAdminOrThrow(user, project.organizationId);

    this.logger.info("Deleting project");

    try {
      const project = await this.projectsService.deleteProject(id);
      this.logger.info("Project deleted");

      this.analytics.trackEvent("project_deleted", {
        projectId: project.id,
      });

      return project;
    } catch (error) {
      this.logger.error({ error }, "Error deleting project");
      throw new InternalServerErrorException();
    }
  }

  @ResolveField(() => Organization)
  async oganization(@Parent() project: Project) {
    return project.organization;
  }
}
