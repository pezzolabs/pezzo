import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetDatasetsInput {
  @Field(() => String, { nullable: false })
  projectId: string;
}
