import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class TestPromptInput {
  @Field(() => String, { nullable: false })
  integrationId: string;

  @Field(() => String, { nullable: false })
  content: string;

  @Field(() => GraphQLJSON, { nullable: false })
  settings: { model: string, modelSettings: unknown };

  @Field(() => GraphQLJSON, { nullable: true })
  variables?: Record<string, string>;
}
