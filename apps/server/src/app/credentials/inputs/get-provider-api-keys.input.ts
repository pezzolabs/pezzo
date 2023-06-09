import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetProviderApiKeysInput {
  @Field(() => String, { nullable: false })
  organizationId: string;
}
