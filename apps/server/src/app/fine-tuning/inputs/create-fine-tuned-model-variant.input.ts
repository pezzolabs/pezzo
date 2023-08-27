import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateFineTunedModelVariantInput {
  @Field(() => String, { nullable: false })
  modelId: string;

  @Field(() => String, { nullable: false })
  slug: string;

  @Field(() => String, { nullable: false })
  datasetId: string;
}
