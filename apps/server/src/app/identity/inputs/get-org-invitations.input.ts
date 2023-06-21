import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetOrgInvitationsInput {
  @Field(() => String, { nullable: false })
  organizationId: string;
}
