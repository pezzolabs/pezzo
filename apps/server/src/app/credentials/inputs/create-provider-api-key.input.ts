import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateProviderAPIKeyInput {
  @Field(() => String, { nullable: false })
  provider: string;

  @Field(() => String, { nullable: false })
  value: string;
}
