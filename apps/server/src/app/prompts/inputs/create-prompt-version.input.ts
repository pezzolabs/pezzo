import { Field, InputType } from "@nestjs/graphql";
import { OpenAIChatSettings } from "@pezzo/common";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class CreatePromptVersionInput {
  @Field(() => String, { nullable: false })
  message: string;

  @Field(() => String, { nullable: false })
  content: string;

  @Field(() => String, { nullable: false })
  promptId: string;

  @Field(() => GraphQLJSON, { nullable: false })
  settings: OpenAIChatSettings;
}
