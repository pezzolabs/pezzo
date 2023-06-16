import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { OrgRole } from "@prisma/client";

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    return await this.prisma.organization.findUnique({ where: { id } });
  }

  async getAllByUserId(userId: string) {
    return await this.prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async getOrgMemberByOrgId(id: string, userId: string) {
    return await this.prisma.organizationMember.findFirst({
      where: {
        organizationId: id,
        userId,
      },
    });
  }

  async getOrganizationMemberById(id: string) {
    return await this.prisma.organizationMember.findUnique({ where: { id } });
  }

  async getOrgMembers(id: string) {
    return await this.prisma.organizationMember.findMany({
      where: {
        organizationId: id,
      },
      include: {
        user: {
          include: {
            orgMemberships: true,
          },
        },
      },
    });
  }

  async deleteOrgMember(id: string) {
    return await this.prisma.organizationMember.delete({ where: { id } });
  }

  async addMember(organizationId: string, userId: string, role: OrgRole) {
    const member = await this.prisma.organizationMember.create({
      data: {
        organizationId,
        userId,
        role,
      },
    });

    return member;
  }

  async updateMember(id: string, role: OrgRole) {
    const member = await this.prisma.organizationMember.update({
      where: { id },
      data: {
        role,
      },
    });

    return member;
  }

  async isOrgExists(name: string, userId: string) {
    const exists = await this.prisma.organization.findFirst({
      where: {
        members: {
          some: {
            userId,
          },
        },
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    return !!exists;
  }

  async createOrg(name: string, creatorUserId: string) {
    return await this.prisma.organization.create({
      data: {
        name,
        members: {
          create: {
            userId: creatorUserId,
            role: OrgRole.Admin,
          },
        },
      },
    });
  }

  async updateOrg(name: string, id: string) {
    return await this.prisma.organization.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }
}
