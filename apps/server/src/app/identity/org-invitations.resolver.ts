import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Invitation } from "../../@generated/invitation/invitation.model";
import { GetOrgInvitationsInput } from "./inputs/get-org-invitations.input";
import { PrismaService } from "../prisma.service";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { isOrgAdminOrThrow, isOrgMember } from "./identity.utils";
import {
  ConflictException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CreateOrgInvitationInput } from "./inputs/create-org-invitation.input";
import { InvitationStatus, OrgRole } from "@prisma/client";
import { UsersService } from "./users.service";
import { ExtendedUser } from "./models/extended-user.model";
import { InvitationWhereUniqueInput } from "../../@generated/invitation/invitation-where-unique.input";
import { Organization } from "../../@generated/organization/organization.model";
import { KafkaProducerService } from "@pezzo/kafka";
import { UpdateOrgInvitationInput } from "./inputs/update-org-invitation.input";

@UseGuards(AuthGuard)
@Resolver(() => Invitation)
export class OrgInvitationsResolver {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private kafkaProducer: KafkaProducerService
  ) {}

  @Mutation(() => Invitation)
  async createOrgInvitation(
    @Args("data") data: CreateOrgInvitationInput,
    @CurrentUser() user: RequestUser
  ): Promise<Invitation> {
    const { organizationId, email } = data;
    isOrgAdminOrThrow(user, organizationId);

    const organization = await this.prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    const exists = await this.prisma.invitation.findFirst({
      where: {
        organizationId,
        email,
      },
    });

    if (exists) {
      throw new ConflictException("Invitation to this email already exists");
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        email,
        organizationId,
        role: OrgRole.Member,
        status: InvitationStatus.Pending,
        invitedById: user.id,
      },
    });

    await this.kafkaProducer.produce({
      topic: "org-invitation-created",
      messages: [
        {
          key: invitation.id,
          value: JSON.stringify({
            invitationid: invitation.id,
            email,
            role: invitation.role,
            organizationId,
            organizationName: organization.name,
          }),
        },
      ],
    });

    return invitation;
  }

  @Mutation(() => Invitation)
  async updateOrgInvitation(
    @Args("data") data: UpdateOrgInvitationInput,
    @CurrentUser() user: RequestUser
  ): Promise<Invitation> {
    const { invitationId, role } = data;

    const invitation = await this.prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    isOrgAdminOrThrow(user, invitation.organizationId);

    const organization = await this.prisma.organization.findUnique({
      where: {
        id: invitation.organizationId,
      },
    });

    const updatedInvitation = await this.prisma.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        role,
      },
    });

    await this.kafkaProducer.produce({
      topic: "org-invitation-edited",
      messages: [
        {
          key: invitation.id,
          value: JSON.stringify({
            invitationId: invitation.id,
            role,
            organizationId: invitation.organizationId,
            organizationName: organization.name,
          }),
        },
      ],
    });

    return updatedInvitation;
  }

  @Query(() => [Invitation])
  async orgInvitations(
    @Args("data") data: GetOrgInvitationsInput,
    @CurrentUser() user: RequestUser
  ): Promise<Invitation[]> {
    const { organizationId } = data;
    isOrgAdminOrThrow(user, organizationId);

    const organization = await this.prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    const invitations = await this.prisma.invitation.findMany({
      where: {
        organizationId: data.organizationId,
      },
    });

    return invitations;
  }

  @Mutation(() => Invitation)
  async deleteOrgInvitation(
    @Args("data") data: InvitationWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ): Promise<Invitation> {
    const { id } = data;

    const invitation = await this.prisma.invitation.findUnique({
      where: {
        id,
      },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    isOrgAdminOrThrow(user, invitation.organizationId);

    await this.prisma.invitation.delete({
      where: {
        id,
      },
    });

    return invitation;
  }

  @Mutation(() => Organization)
  async acceptOrgInvitation(
    @Args("data") data: InvitationWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ): Promise<Organization> {
    const { id } = data;

    const invitation = await this.prisma.invitation.findUnique({
      where: {
        id,
      },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    const isMemberAlready = isOrgMember(user, invitation.organizationId);

    if (isMemberAlready) {
      throw new ConflictException(
        "You are already a member of this organization"
      );
    }

    const organization = await this.prisma.organization.findUnique({
      where: {
        id: invitation.organizationId,
      },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    await this.prisma.organizationMember.create({
      data: {
        organizationId: invitation.organizationId,
        userId: user.id,
        role: invitation.role,
      },
    });

    await this.prisma.invitation.delete({
      where: {
        id,
      },
    });

    return organization;
  }

  @ResolveField(() => ExtendedUser)
  async invitedBy(@Parent() invitation: Invitation): Promise<ExtendedUser> {
    const user = await this.usersService.getById(invitation.invitedById);
    return this.usersService.serializeExtendedUser(user);
  }
}
