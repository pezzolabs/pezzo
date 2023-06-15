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
  InternalServerErrorException,
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
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "../logger/pino-logger";
import { OrganizationsService } from "./organizations.service";
import { InvitationsService } from "./invitations.service";

@UseGuards(AuthGuard)
@Resolver(() => Invitation)
export class OrgInvitationsResolver {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private kafkaProducer: KafkaProducerService,
    private organizationService: OrganizationsService,
    private invitationService: InvitationsService,
    private logger: PinoLogger,
    private config: ConfigService
  ) {}

  @Mutation(() => Invitation)
  async createOrgInvitation(
    @Args("data") data: CreateOrgInvitationInput,
    @CurrentUser() user: RequestUser
  ): Promise<Invitation> {
    this.logger
      .assign({ userId: user.id })
      .info("Creating organization invitation");

    const { organizationId, email } = data;
    isOrgAdminOrThrow(user, organizationId);

    let organization: Organization;
    try {
      organization = await this.organizationService.getById(organizationId);
    } catch (error) {
      this.logger
        .assign({ userId: user.id })
        .error({ error }, "Failed to get organization");
      throw new InternalServerErrorException();
    }

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    let exists: boolean;
    try {
      exists = !!(await this.invitationService.getInvitationByEmail(
        email,
        organizationId
      ));
    } catch (error) {
      this.logger.error({ error }, "Failed to get invitation");
      throw new InternalServerErrorException();
    }

    if (exists) {
      throw new ConflictException("Invitation to this email already exists");
    }

    let invitation: Invitation;
    try {
      invitation = await this.invitationService.createInvitation(
        email,
        organizationId,
        user.id
      );
    } catch (error) {
      this.logger.error({ error }, "Error getting environments");
      throw new InternalServerErrorException();
    }

    const consoleHost = this.config.get("CONSOLE_HOST");
    const invitationUrl = new URL(consoleHost);
    invitationUrl.pathname = `/invitations/${invitation.id}/accept`;

    const topic = "org-invitation-created";

    this.logger
      .assign({ topic })
      .info("Sending kafka invitation created event");

    await this.kafkaProducer.produce({
      topic: "org-invitation-created",
      messages: [
        {
          key: invitation.id,
          value: JSON.stringify({
            invitationUrl: invitationUrl.toString(),
            invitationId: invitation.id,
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

    this.logger
      .assign({ userId: user.id, invitationId: data.invitationId })
      .info("Updating org invitation");
    let invitation: Invitation;
    try {
      invitation = await this.invitationService.getInvitationById(invitationId);
    } catch (error) {
      this.logger.error({ error }, "Error getting invitation");
      throw new InternalServerErrorException();
    }
    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    isOrgAdminOrThrow(user, invitation.organizationId);

    let organization: Organization;

    try {
      organization = await this.organizationService.getById(
        invitation.organizationId
      );
    } catch (error) {
      this.logger.error({ error }, "Error getting organization");
      throw new InternalServerErrorException();
    }

    let updatedInvitation: Invitation;
    try {
      updatedInvitation = await this.invitationService.upsertRoleById(
        invitationId,
        role
      );
    } catch (error) {
      this.logger.error({ error }, "Error updating invitation");
      throw new InternalServerErrorException();
    }

    const topic = "org-invitation-edited";
    this.logger.assign({ topic }).info("Sending kafka invitation edited event");

    await this.kafkaProducer.produce({
      topic,
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

    let organization: Organization;
    try {
      this.logger
        .assign({ userId: user.id, organizationId: organization.id })
        .info("Getting organization");
      organization = await this.organizationService.getById(organizationId);
    } catch (error) {
      this.logger.error({ error }, "Error getting organization");
      throw new InternalServerErrorException();
    }

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    let invitations: Invitation[];
    try {
      this.logger.info("Getting invitations for organization");
      invitations = await this.invitationService.getAllByOrgId(organizationId);
    } catch (error) {
      this.logger.error({ error }, "Error getting invitations");
      throw new InternalServerErrorException();
    }

    return invitations;
  }

  @Mutation(() => Invitation)
  async deleteOrgInvitation(
    @Args("data") data: InvitationWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ): Promise<Invitation> {
    const { id } = data;

    this.logger.assign({ userId: user.id, invitationId: id });

    let invitation: Invitation;
    try {
      this.logger.info("Getting invitation");
      invitation = await this.invitationService.getInvitationById(id);
    } catch (error) {
      this.logger.error({ error }, "Error getting invitation");
      throw new InternalServerErrorException();
    }

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    isOrgAdminOrThrow(user, invitation.organizationId);

    try {
      this.logger.info("Deleting invitation");
      await this.invitationService.deleteInvitationById(id);
    } catch (error) {
      this.logger.error({ error }, "Error deleting invitation");
      throw new InternalServerErrorException();
    }

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
