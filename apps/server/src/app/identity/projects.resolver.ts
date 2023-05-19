import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Project } from "../../@generated/project/project.model";
import { CreateProjectInput } from "./inputs/create-project.input";
import { ProjectsService } from "./projects.service";
import { AuthGuard } from "../auth/auth.guard";
import {
  ConflictException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { isOrgAdminOrThrow, isOrgMemberOrThrow } from "./identity.utils";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { slugify } from "@pezzo/common";
import { ProjectWhereUniqueInput } from "../../@generated/project/project-where-unique.input";

@UseGuards(AuthGuard)
@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => Project)
  async project(
    @Args("data") data: ProjectWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const project = await this.projectsService.getProjectById(data.id);

    if (!project) {
      throw new NotFoundException();
    }

    isOrgMemberOrThrow(user, project.organizationId);
    return project;
  }

  @Query(() => [Project])
  async projects(@CurrentUser() user: RequestUser) {
    const orgId = user.orgMemberships[0].organizationId;
    return this.projectsService.getProjectsByOrgId(orgId);
  }

  @Mutation(() => Project)
  async createProject(
    @Args("data") data: CreateProjectInput,
    @CurrentUser() user: RequestUser
  ) {
    isOrgAdminOrThrow(user, data.organizationId);
    const slug = slugify(data.name);
    const exists = await this.projectsService.getProjectBySlug(
      slug,
      data.organizationId
    );

    if (exists) {
      throw new ConflictException(`Project with slug "${slug}" already exists`);
    }

    return this.projectsService.createProject(
      data.name,
      slug,
      data.organizationId,
      user.id
    );
  }
}
