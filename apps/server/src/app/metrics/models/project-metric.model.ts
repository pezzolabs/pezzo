import { Field } from "@nestjs/graphql";
import { ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class ProjectMetric {
  @Field(() => Number, { nullable: false })
  currentValue: number;

  @Field(() => Number, { nullable: false })
  previousValue: number;
}

@ObjectType()
export class HistogramMetric {
  @Field(() => String, { nullable: false })
  timestamp: string; // ISO date string for the bucket

  @Field(() => Number, { nullable: false })
  value: number; // Value for the metric at that date
}

@ObjectType()
export class ModelUsageHistogramValue {
  @Field(() => String, { nullable: false })
  model: string;

  @Field(() => String, { nullable: false })
  modelAuthor: string;
 
  @Field(() => Number, { nullable: false })
  value: number;
}

@ObjectType()
export class ModelUsageHistogramBucket {
  @Field(() => String, { nullable: false })
  timestamp: string;
 
  @Field(() => [ModelUsageHistogramValue], { nullable: false })
  values: ModelUsageHistogramValue[]; // Value for the metric at that date
}

@ObjectType()
export class GenericProjectHistogramResult {
  @Field(() => [GraphQLJSON], { nullable: false })
  data: any;
}

@ObjectType()
export class ProjectMetricDeltaResult {
  @Field(() => Number, { nullable: false })
  currentValue: number;

  @Field(() => Number, { nullable: false })
  previousValue: number;
}