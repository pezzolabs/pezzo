import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { InvitationStatus, OrgRole } from "@pezzo/prisma-server";

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvitation(
    email: string,
    organizationId: string,
    inviterId: string
  ) {
    return await this.prisma.invitation.create({
      data: {
        email,
        organizationId,
        role: OrgRole.Member,
        status: InvitationStatus.Pending,
        invitedById: inviterId,
      },
    });
  }

  async getInvitationByEmail(email: string, organizationId: string) {
    return await this.prisma.invitation.findFirst({
      where: {
        organizationId,
        email,
      },
    });
  }

  async getInvitationById(id: string) {
    return await this.prisma.invitation.findUnique({ where: { id } });
  }

  async getAllByOrgId(organizationId: string) {
    return await this.prisma.invitation.findMany({
      where: { organizationId },
    });
  }

  async upsertRoleById(id: string, role: OrgRole) {
    return await this.prisma.invitation.update({
      where: { id },
      data: { role },
    });
  }

  async deleteInvitationById(id: string) {
    return await this.prisma.invitation.delete({ where: { id } });
  }
}
