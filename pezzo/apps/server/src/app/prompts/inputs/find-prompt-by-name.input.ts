import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FindPromptByNameInput {
  @Field(() => String, { nullable: false })
  name: string;
}
