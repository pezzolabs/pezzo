import { Field, InputType } from "@nestjs/graphql";
import {ApiProperty} from "@nestjs/swagger";
import {IsObject, IsString} from "class-validator";
import {PromptType} from "../../../@generated/prisma/prompt-type.enum";
import {PromptService} from "@pezzo/types";
import GraphQLJSON from "graphql-type-json";

export class CreatePromptVersionWithUserDto {

  @ApiProperty({
    description: "The user email which will create the prompt version",
    type: String,
    example: "user@smartnews.com",
    nullable: false
  })
  @IsString()
  userEmail: string;

  @ApiProperty({
    description: "The prompt id to create a version for",
    type: String,
    example: "clwprr7ci0000640v75clv173",
    nullable: false
  })
  @IsString()
  promptId: string;

  // @Field(() => PromptType, { nullable: false })
  // @ApiProperty({
  //   description: "The prompt type",
  //   type: String,
  //   example: "Prompt",
  //   nullable: false
  // })
  // type: PromptType;

  // @Field(() => PromptService, { nullable: false })
  // service: PromptService;

  @ApiProperty({
    description: "The current prompt-version commit description",
    type: String,
    example: "v1 - Initial commit",
    nullable: false
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: "The prompt content object include system_hint as well",
    type: Object,
    additionalProperties: true,
    example: {
      prompt: "Prompt content, e.g. There is a news {headline} with the content summary: {summary}.",
      messages: [
        {
          content: "system_hint content",
        }
      ]
    },
    nullable: false
  })
  @IsObject()
  content: any;

  @ApiProperty({
    description: "The prompt setting object include prompt model and parameters",
    type: Object,
    additionalProperties: true,
    example: {
      model: "gpt-4-turbo",
      max_tokens: 256,
      temperature: 0
    },
    nullable: false
  })
  @IsObject()
  settings: any;

}
