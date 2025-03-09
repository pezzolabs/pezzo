import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateProfileInput {
  @Field(() => String, { nullable: false })
  name: string;
}
