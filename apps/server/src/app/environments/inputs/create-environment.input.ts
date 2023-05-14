import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateEnvironmentInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  slug: string;
}
