import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetProjectPromptsInput {
  @Field(() => String, { nullable: false })
  projectId: string;
}
