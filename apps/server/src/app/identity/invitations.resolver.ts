import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Invitation } from "../../@generated/invitation/invitation.model";
import { PrismaService } from "../prisma.service";
import { InvitationWhereUniqueInput } from "../../@generated/invitation/invitation-where-unique.input";
import { CurrentUser } from "./current-user.decorator";
import { RequestUser } from "./users.types";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { isOrgAdminOrThrow } from "./identity.utils";

@UseGuards(AuthGuard)
@Resolver(() => Invitation)
export class InvitationsResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => Invitation)
  async deleteInvitation(
    @Args("data") data: InvitationWhereUniqueInput,
    @CurrentUser() user: RequestUser
  ) {
    const invitation = await this.prisma.invitation.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    isOrgAdminOrThrow(user, invitation.organizationId);

    return this.prisma.invitation.delete({
      where: {
        id: data.id,
      },
    });
  }
}
