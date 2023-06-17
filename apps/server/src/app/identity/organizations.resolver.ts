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
import {
  ConflictException,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { CreateOrganizationInput } from "./inputs/create-organization.input";
import { OrganizationWhereUniqueInput } from "../../@generated/organization/organization-where-unique.input";
import { isOrgAdminOrThrow, isOrgMemberOrThrow } from "./identity.utils";
import { OrganizationMember } from "../../@generated/organization-member/organization-member.model";
import { UsersService } from "./users.service";
import { Invitation } from "../../@generated/invitation/invitation.model";
import { UpdateOrgSettingsInput } from "./inputs/update-org-settings.input";
import { PinoLogger } from "../logger/pino-logger";
import { OrganizationsService } from "./organizations.service";

@UseGuards(AuthGuard)
@Resolver(() => Organization)
export class OrganizationsResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
    private readonly organizationService: OrganizationsService,
    private readonly usersService: UsersService
  ) {}

  @Query(() => [Organization])
  async organizations(@CurrentUser() user: RequestUser) {
    this.logger.assign({ userId: user.id });
    try {
      this.logger.info("Getting all orgs");
      const orgs = await this.organizationService.getAllByUserId(user.id);
      return orgs;
    } catch (error) {
      this.logger.error({ error }, "Failed to get orgs");
    }
  }

  @Query(() => Organization)
  async organization(
    @CurrentUser() user: RequestUser,
    @Args("data") data: OrganizationWhereUniqueInput
  ) {
    this.logger.assign({ userId: user.id, organizationId: data.id });

    let org: Organization;
    try {
      this.logger.info("Getting org");
      org = await this.organizationService.getById(data.id);
    } catch (error) {
      this.logger.error({ error }, "Failed to get org");
    }

    if (!org) {
      throw new NotFoundException();
    }

    isOrgMemberOrThrow(user, org.id);

    return org;
  }

  @Mutation(() => Organization)
  async createOrganization(
    @Args("data") data: CreateOrganizationInput,
    @CurrentUser() user: RequestUser
  ) {
    const { name } = data;
    this.logger.assign({
      userId: user.id,
      organizationName: name,
    });

    let exists: boolean;
    try {
      this.logger.info("Checking if org available");
      exists = await this.organizationService.isOrgExists(name, user.id);
    } catch (error) {
      this.logger.error({ error }, "Failed to check if org available");
    }
    if (exists) {
      throw new ConflictException(
        "You already have an organization with this name"
      );
    }

    let org: Organization;

    try {
      this.logger.info("Creating org");
      org = await this.organizationService.createOrg(name, user.id);
    } catch (error) {
      this.logger.error({ error }, "Failed to create org");
    }

    return org;
  }

  @ResolveField(() => [OrganizationMember])
  async members(@Parent() organization: Organization) {
    try {
      this.logger.assign({ organizationId: organization.id });
      this.logger.info("Getting all org members");
      const members = await this.organizationService.getOrgMembers(
        organization.id
      );

      return members.map((member) => ({
        ...member,
        user: this.usersService.serializeExtendedUser(member.user),
      }));
    } catch (error) {
      this.logger.error({ error }, "Failed to get org members");
    }
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
    this.logger.assign({
      organizationId: data.organizationId,
      userId: user.id,
    });
    let org: Organization;

    try {
      this.logger.info("Getting org");
      org = await this.organizationService.getById(data.organizationId);
    } catch (error) {
      this.logger.error({ error }, "Failed to get org");
    }
    if (!org) {
      throw new ConflictException("Organization not found");
    }

    isOrgAdminOrThrow(user, organizationId);

    try {
      this.logger.info("Updating org");
      const updatedOrganization = await this.organizationService.updateOrg(
        name,
        organizationId
      );
      return updatedOrganization;
    } catch (error) {
      this.logger.error({ error }, "Failed to update organization");
    }
  }
}
