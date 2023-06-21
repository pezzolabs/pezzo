import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";

@InputType()
export class CreateOrgInvitationInput {
  @Field(() => String, { nullable: false })
  organizationId: string;

  @Field(() => String, { nullable: false })
  @IsEmail()
  email: string;
}
