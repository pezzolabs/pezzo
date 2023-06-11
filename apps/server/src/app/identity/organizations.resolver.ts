import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Organization } from "../../@generated/organization/organization.model";
import { PrismaService } from "../prisma.service";
import { ConflictException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { CreateOrganizationInput } from "./inputs/create-organization.input";
import { OrgRole } from "@prisma/client";
import { OrganizationWhereUniqueInput } from "../../@generated/organization/organization-where-unique.input";
import { isOrgMemberOrThrow } from "./identity.utils";

@UseGuards(AuthGuard)
@Resolver(() => Organization)
export class OrganizationsResolver {
  constructor(private prisma: PrismaService) {}

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
    @Args("data") data: OrganizationWhereUniqueInput,
    @CurrentUser() user: RequestUser
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
}
