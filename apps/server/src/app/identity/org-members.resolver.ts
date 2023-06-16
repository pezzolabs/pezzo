import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { OrganizationMember } from "../../@generated/organization-member/organization-member.model";
import { OrganizationMemberWhereUniqueInput } from "../../@generated/organization-member/organization-member-where-unique.input";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { PrismaService } from "../prisma.service";
import { isOrgAdminOrThrow, isOrgMemberOrThrow } from "./identity.utils";
import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { GetUserOrgMembershipInput } from "./inputs/get-user-org-membership.input";
import { UpdateOrgMemberRoleInput } from "./inputs/update-org-member-role.input";
import { OrganizationsService } from "./organizations.service";
import { PinoLogger } from "../logger/pino-logger";

@UseGuards(AuthGuard)
@Resolver(OrganizationMember)
export class OrganizationMembersResolver {
  constructor(
    private logger: PinoLogger,
    private readonly organizationService: OrganizationsService
  ) {}

  @Query(() => OrganizationMember)
  async userOrgMembership(
    @Args("data") data: GetUserOrgMembershipInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign({ userId: user.id });
    let member: OrganizationMember;

    try {
      this.logger.info({ data }, "Getting user org membership");
      member = await this.organizationService.getOrgMemberByOrgId(
        data.organizationId,
        user.id
      );
    } catch (error) {
      this.logger.error({ error }, "Failed to get user org membership");
    }

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    isOrgMemberOrThrow(user, member.organizationId);
    return member;
  }

  @Mutation(() => OrganizationMember)
  async deleteOrgMember(
    @Args("data") data: OrganizationMemberWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign({ userId: user.id, orgMemberId: data.id });
    let member: OrganizationMember;

    try {
      this.logger.info("Getting user org membership");
      member = await this.organizationService.getOrganizationMemberById(
        data.id
      );
    } catch (error) {
      this.logger.error({ error }, "Failed to get user org membership");
    }

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    isOrgAdminOrThrow(user, member.organizationId);

    if (member.userId === user.id) {
      throw new ForbiddenException(
        "You cannot remove yourself from the organization"
      );
    }

    try {
      this.logger.info("Deleting org member");
      return await this.organizationService.deleteOrgMember(data.id);
    } catch (error) {
      this.logger.error({ error }, "Failed to delete org member");
    }
  }

  @Mutation(() => OrganizationMember)
  async updateOrgMemberRole(
    @Args("data") data: UpdateOrgMemberRoleInput,
    @CurrentUser() user: RequestUser
  ) {
    this.logger.assign({
      userId: user.id,
      orgMemberId: data.id,
    });

    let member: OrganizationMember;

    try {
      member = await this.organizationService.getOrganizationMemberById(
        data.id
      );
    } catch (error) {
      this.logger.error({ error }, "Failed to get org member");
    }

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    isOrgAdminOrThrow(user, member.organizationId);

    let updatedMember: OrganizationMember;
    try {
      this.logger.info("Updating org member role");
      updatedMember = await this.organizationService.updateMember(
        data.id,
        data.role
      );
    } catch (error) {
      this.logger.error({ error }, "Failed to update org member role");
    }

    return updatedMember;
  }
}
