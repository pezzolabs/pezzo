import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateOrganizationInput {
  @Field(() => String, { nullable: false })
  name: string;
}
