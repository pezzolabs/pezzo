import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PublishPromptInput {
  @Field(() => String, { nullable: false })
  promptId: string;

  @Field(() => String, { nullable: false })
  environmentSlug: string;

  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => String, { nullable: false })
  promptVersionSha: string;
}
