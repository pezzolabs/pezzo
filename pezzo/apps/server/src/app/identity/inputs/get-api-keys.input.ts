import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetApiKeysInput {
  @Field(() => String, { nullable: false })
  organizationId: string;
}
