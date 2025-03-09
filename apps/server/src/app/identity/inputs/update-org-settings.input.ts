import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class UpdateOrgSettingsInput {
  @Field(() => String, { nullable: false })
  @IsString()
  organizationId: string;

  @Field(() => String, { nullable: false })
  name: string;
}
