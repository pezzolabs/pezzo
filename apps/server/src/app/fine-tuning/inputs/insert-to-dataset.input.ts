import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class InsertToDatasetInput {
  @Field(() => String, { nullable: false })
  datasetId: string;

  @Field(() => GraphQLJSON, { nullable: false })
  data: any;
}
