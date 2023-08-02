import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class TestPromptInput {
  @Field(() => String, { nullable: false })
  promptId: string;

  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => GraphQLJSON, { nullable: false })
  content: any;

  @Field(() => GraphQLJSON, { nullable: false })
  settings: { model: string; modelSettings: unknown };

  @Field(() => GraphQLJSON, { nullable: true })
  variables: Record<string, string>;
}
