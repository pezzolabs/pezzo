import { Field, InputType } from "@nestjs/graphql";
import { OrgRole } from "../../../@generated/prisma/org-role.enum";

@InputType()
export class UpdateOrgInvitationInput {
  @Field(() => String, { nullable: false })
  invitationId: string;

  @Field(() => OrgRole, { nullable: false })
  role: OrgRole;
}
