import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Organization } from "../../@generated/organization/organization.model";
import { PrismaService } from "../prisma.service";
import { ConflictException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { CreateOrganizationInput } from "./inputs/create-organization.input";
import { OrgRole } from "@prisma/client";
import { OrganizationWhereUniqueInput } from "../../@generated/organization/organization-where-unique.input";
import { isOrgAdminOrThrow, isOrgMemberOrThrow } from "./identity.utils";
import { OrganizationMember } from "../../@generated/organization-member/organization-member.model";
import { UsersService } from "./users.service";
import { Invitation } from "../../@generated/invitation/invitation.model";
import { UpdateOrgSettingsInput } from "./inputs/update-org-settings.input";

@UseGuards(AuthGuard)
@Resolver(() => Organization)
export class OrganizationsResolver {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService
  ) {}

  @Query(() => [Organization])
  organizations(@CurrentUser() user: RequestUser) {
    return this.prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    });
  }

  @Query(() => Organization)
  organization(
    @CurrentUser() user: RequestUser,
    @Args("data") data: OrganizationWhereUniqueInput
  ) {
    isOrgMemberOrThrow(user, data.id);
    return this.prisma.organization.findFirst({
      where: {
        id: data.id,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    });
  }

  @Mutation(() => Organization)
  async createOrganization(
    @Args("data") data: CreateOrganizationInput,
    @CurrentUser() user: RequestUser
  ) {
    const { name } = data;

    const exists = await this.prisma.organization.findFirst({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (exists) {
      throw new ConflictException(
        "You already have an organization with this name"
      );
    }

    const org = await this.prisma.organization.create({
      data: {
        name,
        members: {
          create: {
            userId: user.id,
            role: OrgRole.Admin,
          },
        },
      },
    });

    return org;
  }

  @ResolveField(() => [OrganizationMember])
  async members(@Parent() organization: Organization) {
    const members = await this.prisma.organizationMember.findMany({
      where: {
        organizationId: organization.id,
      },
      include: {
        user: {
          include: {
            orgMemberships: true,
          },
        },
      },
    });

    return members.map((member) => ({
      ...member,
      user: this.usersService.serializeExtendedUser(member.user),
    }));
  }

  @ResolveField(() => [Invitation])
  async invitations(@Parent() organization: Organization) {
    const invitations = await this.prisma.invitation.findMany({
      where: {
        organizationId: organization.id,
      },
    });

    return invitations.map((invitation) => ({
      ...invitation,
    }));
  }

  @Mutation(() => Organization)
  async updateOrgSettings(
    @Args("data") data: UpdateOrgSettingsInput,
    @CurrentUser() user: RequestUser
  ) {
    const { organizationId, name } = data;

    const org = await this.prisma.organization.findFirst({
      where: {
        id: organizationId,
      },
    });

    if (!org) {
      throw new ConflictException("Organization not found");
    }

    isOrgAdminOrThrow(user, organizationId);

    return this.prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        name,
      },
    });
  }
}
