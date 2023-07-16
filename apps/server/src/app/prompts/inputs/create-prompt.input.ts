import { Field, InputType } from "@nestjs/graphql";
import { PromptType } from "../../../@generated/prisma/prompt-type.enum";

@InputType()
export class CreatePromptInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => PromptType, { nullable: false })
  type: PromptType;
}
