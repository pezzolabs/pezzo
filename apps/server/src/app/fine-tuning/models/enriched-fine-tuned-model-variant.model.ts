import { Field, ObjectType } from "@nestjs/graphql";
import { FineTunedModelVariant } from "../../../@generated/fine-tuned-model-variant/fine-tuned-model-variant.model";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class EnrichedFineTuneModelVariant extends FineTunedModelVariant {
  @Field(() => GraphQLJSON, {nullable:true})
  enrichment?: any;
}