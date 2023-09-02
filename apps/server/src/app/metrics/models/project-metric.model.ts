import { Field } from "@nestjs/graphql";
import { ObjectType } from "@nestjs/graphql";

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
  date: string; // ISO date string for the bucket

  @Field(() => Number, { nullable: false })
  value: number; // Value for the metric at that date
}
