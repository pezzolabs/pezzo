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
import { UsersService } from "./users.service";
import { ExtendedUser } from "./models/extended-user.model";
import { InvitationWhereUniqueInput } from "../../@generated/invitation/invitation-where-unique.input";
import { Organization } from "../../@generated/organization/organization.model";
import { UpdateOrgInvitationInput } from "./inputs/update-org-invitation.input";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "../logger/pino-logger";
import { OrganizationsService } from "./organizations.service";
import { InvitationsService } from "./invitations.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { KafkaSchemas } from "@pezzo/kafka";

@UseGuards(AuthGuard)
@Resolver(() => Invitation)
export class OrgInvitationsResolver {
  constructor(
    private eventEmitter: EventEmitter2,
    private usersService: UsersService,
    private organizationService: OrganizationsService,
    private invitationsService: InvitationsService,
    private logger: PinoLogger,
    private config: ConfigService
  ) {}

  @Mutation(() => Invitation)
  async createOrgInvitation(
    @Args("data") data: CreateOrgInvitationInput,
    @CurrentUser() user: RequestUser
  ): Promise<Organization> {
    this.logger.assign({ userId: user.id }).info("Creating org invitation");

    const { organizationId, email } = data;
    isOrgAdminOrThrow(user, organizationId);

    let organization: Organization;
    try {
      this.logger.info("Getting org");
      organization = await this.organizationService.getById(organizationId);
    } catch (error) {
      this.logger.error({ error }, "Failed to get organization");
      throw new InternalServerErrorException();
    }

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    const isMemberAlready = organization.members?.some(
      (member) => member.user?.email === email
    );

    if (isMemberAlready) {
      throw new ConflictException(
        "User is already a member of this organization"
      );
    }

    const member = await this.usersService.getUserByEmail(email);

    // let exists: boolean;
    // try {
    //   this.logger.info("Checking if invitation exists");
    //   exists = !!(await this.invitationsService.getInvitationByEmail(
    //     email,
    //     organizationId
    //   ));
    // } catch (error) {
    //   this.logger.error({ error }, "Failed to get invitation");
    //   throw new InternalServerErrorException();
    // }
    //
    // if (exists) {
    //   throw new ConflictException("Invitation to this email already exists");
    // }

    // let invitation: Invitation;
    // try {
    //   this.logger.info("Creating invitation");
    //   invitation = await this.invitationsService.createInvitation(
    //     email,
    //     organizationId,
    //     user.id
    //   );
    // } catch (error) {
    //   this.logger.error({ error }, "Error getting invitation");
    //   throw new InternalServerErrorException();
    // }

    try {
      await this.organizationService.addMember(
        organizationId,
        member.id,
        "Member" // Member as default role, admin can change it later
      );
    } catch (error) {
      this.logger.error({ error }, "Error adding member to organization");
      throw new InternalServerErrorException();
    }

    // const consoleHost = this.config.get("CONSOLE_HOST");
    // const invitationUrl = new URL(consoleHost);
    // invitationUrl.pathname = `/invitations/${invitation.id}/accept`;

    // const topic = "org-invitation-created";

    // this.logger
    //   .assign({ topic })
    //   .info("Sending kafka invitation created event");

    // const payload: KafkaSchemas["org-invitation-created"] = {
    //   key: invitation.id,
    //   invitationUrl: invitationUrl.toString(),
    //   invitationId: invitation.id,
    //   organizationId,
    //   organizationName: organization.name,
    //   email,
    //   role: invitation.role,
    // };

    // this.eventEmitter.emit("org-invitation-created", payload);

    return organization;
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
      invitation = await this.invitationsService.getInvitationById(
        invitationId
      );
    } catch (error) {
      this.logger.error({ error }, "Error getting invitation");
      throw new InternalServerErrorException();
    }
    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    isOrgAdminOrThrow(user, invitation.organizationId);

    let updatedInvitation: Invitation;
    try {
      updatedInvitation = await this.invitationsService.upsertRoleById(
        invitationId,
        role
      );
    } catch (error) {
      this.logger.error({ error }, "Error updating invitation");
      throw new InternalServerErrorException();
    }

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
        .info("Getting org");
      organization = await this.organizationService.getById(organizationId);
    } catch (error) {
      this.logger.error({ error }, "Error getting org");
      throw new InternalServerErrorException();
    }

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    let invitations: Invitation[];
    try {
      this.logger.info("Getting invitations for organization");
      invitations = await this.invitationsService.getAllByOrgId(organizationId);
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
      invitation = await this.invitationsService.getInvitationById(id);
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
      await this.invitationsService.deleteInvitationById(id);
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

    let invitation: Invitation;
    try {
      invitation = await this.invitationsService.getInvitationById(id);
    } catch (error) {
      this.logger.error({ error }, "Error getting invitation");
      throw new InternalServerErrorException();
    }

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    const isMemberAlready = isOrgMember(user, invitation.organizationId);

    if (isMemberAlready) {
      throw new ConflictException(
        "You are already a member of this organization"
      );
    }

    let organization: Organization;
    try {
      organization = await this.organizationService.getById(
        invitation.organizationId
      );
    } catch (error) {
      this.logger.error({ error }, "Error getting organization");
      throw new InternalServerErrorException();
    }

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    try {
      await this.organizationService.addMember(
        invitation.organizationId,
        user.id,
        invitation.role
      );
    } catch (error) {
      this.logger.error({ error }, "Error adding member to organization");
      throw new InternalServerErrorException();
    }

    try {
      await this.invitationsService.deleteInvitationById(id);
    } catch (error) {
      this.logger.error({ error }, "Error deleting invitation");
      throw new InternalServerErrorException();
    }

    return organization;
  }

  @ResolveField(() => ExtendedUser)
  async invitedBy(@Parent() invitation: Invitation): Promise<ExtendedUser> {
    try {
      this.logger
        .assign({ invitedById: invitation.invitedById })
        .info("Getting invited by user");
      const user = await this.usersService.getById(invitation.invitedById);

      if (!user) {
        throw new NotFoundException("User not found");
      }

      return this.usersService.serializeExtendedUser(user);
    } catch (error) {
      this.logger.error({ error }, "Error getting invited by user");
      throw new InternalServerErrorException();
    }
  }
}
