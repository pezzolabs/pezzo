import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetPromptInput {
  @Field(() => String, { nullable: false })
  promptId: string;
}
