import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsOptional } from "class-validator";

@InputType()
export class OrganizationIncludeInput {
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  members = false;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  invitations = false;
}
