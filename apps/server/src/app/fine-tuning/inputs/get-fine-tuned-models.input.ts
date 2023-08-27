import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetFineTunedModelsInput {
  @Field(() => String, { nullable: false })
  projectId: string;
}
