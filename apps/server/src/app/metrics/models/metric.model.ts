import { Field } from "@nestjs/graphql";
import { ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class Metric {
  @Field(() => Date, { nullable: false })
  time: Date;

  @Field(() => Number, { nullable: false })
  value: number;

  @Field(() => GraphQLJSON, { nullable: true, defaultValue: {} })
  metadata = {};
}
