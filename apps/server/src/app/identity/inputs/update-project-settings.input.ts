import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class UpdateProjectSettingsInput {
  @Field(() => String, { nullable: false })
  @IsString()
  projectId: string;

  @Field(() => String, { nullable: false })
  name: string;
}
