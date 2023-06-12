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

@UseGuards(AuthGuard)
@Resolver(OrganizationMember)
export class OrganizationMembersResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => OrganizationMember)
  async userOrgMembership(
    @Args("data") data: GetUserOrgMembershipInput,
    @CurrentUser() user: RequestUser
  ) {
    const member = await this.prisma.organizationMember.findFirst({
      where: {
        userId: data.userId,
        organizationId: data.organizationId,
      },
    });

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
    const member = await this.prisma.organizationMember.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    isOrgAdminOrThrow(user, member.organizationId);

    if (member.userId === user.id) {
      throw new ForbiddenException(
        "You cannot remove yourself from the organization"
      );
    }

    return this.prisma.organizationMember.delete({
      where: {
        id: data.id,
      },
    });
  }

  @Mutation(() => OrganizationMember)
  async updateOrgMemberRole(
    @Args("data") data: UpdateOrgMemberRoleInput,
    @CurrentUser() user: RequestUser
  ) {
    const member = await this.prisma.organizationMember.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!member) {
      throw new NotFoundException("Member not found");
    }

    isOrgAdminOrThrow(user, member.organizationId);

    return this.prisma.organizationMember.update({
      where: {
        id: data.id,
      },
      data: {
        role: data.role,
      },
    });
  }
}
