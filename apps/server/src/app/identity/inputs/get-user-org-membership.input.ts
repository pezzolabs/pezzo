import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetUserOrgMembershipInput {
  @Field(() => String, { nullable: false })
  organizationId: string;

  @Field(() => String, { nullable: false })
  userId: string;
}
