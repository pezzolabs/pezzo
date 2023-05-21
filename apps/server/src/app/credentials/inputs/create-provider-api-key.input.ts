import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateProviderApiKeyInput {
  @Field(() => String, { nullable: false })
  provider: string;

  @Field(() => String, { nullable: false })
  value: string;

  @Field(() => String, { nullable: false })
  projectId: string;
}
