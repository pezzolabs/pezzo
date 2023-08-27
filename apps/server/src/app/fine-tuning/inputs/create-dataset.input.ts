import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateDatasetInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => String, { nullable: false })
  name: string;
}
