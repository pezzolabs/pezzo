import { Field, InputType } from "@nestjs/graphql";
import { OpenAIChatSettings } from "@pezzo/common";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class TestPromptInput {
  @Field(() => String, { nullable: false })
  content: string;

  @Field(() => GraphQLJSON, { nullable: false })
  settings: OpenAIChatSettings;

  @Field(() => GraphQLJSON, { nullable: true })
  variables?: Record<string, string>;
}
