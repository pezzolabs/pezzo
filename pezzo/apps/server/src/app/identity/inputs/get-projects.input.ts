import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetProjectsInput {
  @Field(() => String, { nullable: false })
  organizationId: string;
}
