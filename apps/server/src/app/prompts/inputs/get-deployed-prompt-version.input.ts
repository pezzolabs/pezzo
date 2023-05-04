import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetDeployedPromptVersionInput {
  @Field(() => String, { nullable: false })
  environmentSlug: string;

  @Field(() => String, { nullable: false })
  promptId: string;
}