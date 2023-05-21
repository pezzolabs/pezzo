import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetEnvironmentsInput {
  @Field(() => String, { nullable: false })
  projectId: string;
}
