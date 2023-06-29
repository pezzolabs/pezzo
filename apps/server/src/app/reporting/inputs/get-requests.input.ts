import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetRequestsInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => String, { nullable: false })
  organizationId: string;
}
