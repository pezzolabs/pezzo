import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SignupUserInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  name: string;
}
