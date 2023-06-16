import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { OrgRole } from "@prisma/client";

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    return await this.prisma.organization.findUnique({ where: { id } });
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
}
