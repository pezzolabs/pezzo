import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePromptInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  integrationId: string;
}
