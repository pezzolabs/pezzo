import { Field, InputType } from "@nestjs/graphql";
import { CreatePromptVersionInput } from "./create-prompt-version.input";

@InputType()
export class CreatePromptVersionWithUserInput extends CreatePromptVersionInput {
  @Field(() => String, { nullable: false })
  userEmail: string;
}
