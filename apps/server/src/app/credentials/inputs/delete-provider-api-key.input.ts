import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteProviderApiKeyInput {
  @Field(() => String, { nullable: false })
  provider: string;

  @Field(() => String, { nullable: false })
  organizationId: string;
}
