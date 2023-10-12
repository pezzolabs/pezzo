import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateProviderApiKeyInput {
  @Field(() => String, { nullable: false })
  provider: string;

  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  value: string;

  @Field(() => String, { nullable: false })
  organizationId: string;
}
