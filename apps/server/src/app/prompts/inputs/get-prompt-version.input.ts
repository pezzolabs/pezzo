import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetPromptVersionInput {
  @Field(() => String, { nullable: false })
  promptId: string;

  @Field(() => String, { nullable: false })
  sha: string;
}