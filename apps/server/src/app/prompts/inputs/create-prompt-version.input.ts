import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { PromptService } from "../models/prompt-version-service.enum";

@InputType()
export class CreatePromptVersionInput {
  @Field(() => String, { nullable: false })
  promptId: string;

  @Field(() => PromptService, { nullable: false })
  service: PromptService;

  @Field(() => String, { nullable: false })
  message: string;

  @Field(() => GraphQLJSON, { nullable: false })
  content: any;

  @Field(() => GraphQLJSON, { nullable: false })
  settings: any;
}
