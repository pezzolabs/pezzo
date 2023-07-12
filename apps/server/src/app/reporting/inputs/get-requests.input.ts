import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetRequestsInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => Number, { nullable: false })
  page: number;

  @Field(() => Number, { nullable: false, defaultValue: 10 })
  size: number;
}
