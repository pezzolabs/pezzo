import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateProjectInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  organizationId: string;
}
