import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetFineTunedModelVariantsInput {
  @Field(() => String, { nullable: false })
  modelId: string;
}
