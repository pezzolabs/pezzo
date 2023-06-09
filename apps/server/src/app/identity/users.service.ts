import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { OrganizationMember, User } from "@prisma/client";
import { UserCreateRequest } from "./users.types";
import { ExtendedUser } from "./models/extended-user.model";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import { SupertokensMetadata } from "../auth/auth.types";
import { randomBytes } from "crypto";

export type UserWithOrgMemberships = User & {
  orgMemberships: OrganizationMember[];
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    userCreateRequest: UserCreateRequest
  ): Promise<UserWithOrgMemberships> {
    const user = await this.prisma.user.create({
      data: {
        id: userCreateRequest.id,
        email: userCreateRequest.email,
      },
      include: {
        orgMemberships: true,
      },
    });

    const organization = await this.prisma.organization.create({
      data: {
        name: "Default Organization",
        members: {
          create: {
            userId: userCreateRequest.id,
          },
        },
      },
    });

    const apiKeyValue = `pez_${randomBytes(16).toString("hex")}`;
    await this.prisma.apiKey.create({
      data: {
        id: apiKeyValue,
        organizationId: organization.id,
      },
    });

    return user;
  }

  async getUser(email: string): Promise<UserWithOrgMemberships | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { orgMemberships: true },
    });

    return user;
  }

  async getById(id: string): Promise<UserWithOrgMemberships | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { orgMemberships: true },
    });

    return user;
  }

  async getUserOrgMemberships(email: string): Promise<OrganizationMember[]> {
    const memberships = await this.prisma.organizationMember.findMany({
      where: {
        user: {
          email,
        },
      },
    });
    return memberships;
  }

  async serializeExtendedUser(
    user: UserWithOrgMemberships
  ): Promise<ExtendedUser> {
    const organizationIds = user.orgMemberships.map((m) => m.organizationId);

    const { metadata } = (await UserMetadata.getUserMetadata(
      user.id
    )) as SupertokensMetadata;

    return {
      ...user,
      ...metadata.profile,
      organizationIds,
    };
  }
}
