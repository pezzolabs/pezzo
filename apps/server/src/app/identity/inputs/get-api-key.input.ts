import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetApiKeyInput {
  @Field(() => String, { nullable: false })
  environmentId: string;
}
