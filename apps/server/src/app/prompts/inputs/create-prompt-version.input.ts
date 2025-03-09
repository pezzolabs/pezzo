import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { PromptService } from "../models/prompt-version-service.enum";
import { PromptType } from "../../../@generated/prisma/prompt-type.enum";

@InputType()
export class CreatePromptVersionInput {
  @Field(() => String, { nullable: false })
  promptId: string;

  @Field(() => PromptType, { nullable: false })
  type: PromptType;

  @Field(() => PromptService, { nullable: false })
  service: PromptService;

  @Field(() => String, { nullable: false })
  message: string;

  @Field(() => GraphQLJSON, { nullable: false })
  content: any;

  @Field(() => GraphQLJSON, { nullable: false })
  settings: any;
}
