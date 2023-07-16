import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class CreatePromptVersionInput {
  @Field(() => String, { nullable: false })
  promptId: string;

  @Field(() => String, { nullable: false })
  message: string;

  @Field(() => GraphQLJSON, { nullable: false })
  content: any;

  @Field(() => GraphQLJSON, { nullable: false })
  settings: any;
}
