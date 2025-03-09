import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PublishPromptInput {
  @Field(() => String, { nullable: false })
  promptId: string;

  @Field(() => String, { nullable: false })
  environmentId: string;

  @Field(() => String, { nullable: false })
  promptVersionSha: string;
}
