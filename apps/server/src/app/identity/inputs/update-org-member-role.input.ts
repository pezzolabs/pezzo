import { Field, InputType } from "@nestjs/graphql";
import { OrgRole } from "../../../@generated/prisma/org-role.enum";

@InputType()
export class UpdateOrgMemberRoleInput {
  @Field(() => String, { nullable: false })
  id: string;

  @Field(() => OrgRole, { nullable: false })
  role: OrgRole;
}
