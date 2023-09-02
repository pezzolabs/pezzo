import { Field, InputType, registerEnumType } from "@nestjs/graphql";

export enum PromptExecutionMetricField {
  totalCost = "totalCost",
  totalTokens = "totalTokens",
  duration = "duration",
}

registerEnumType(PromptExecutionMetricField, {
  name: "PromptExecutionMetricField",
});

export enum Aggregation {
  sum = "sum",
  avg = "avg",
  min = "min",
  max = "max",
  count = "count",
}

registerEnumType(Aggregation, {
  name: "Aggregation",
});

export enum Granularity {
  hour = "hour",
  day = "day",
  week = "week",
  month = "month",
}

registerEnumType(Granularity, {
  name: "Granularity",
});

@InputType()
export class GetPromptMetricsInput {
  @Field(() => String, { nullable: false })
  promptId: string;

  @Field(() => PromptExecutionMetricField, { nullable: true })
  field?: PromptExecutionMetricField;

  @Field(() => String, { nullable: false })
  start: string;

  @Field(() => String, { nullable: true, defaultValue: "now()" })
  stop?: string = "now()";

  @Field(() => Aggregation, { nullable: false })
  aggregation: Aggregation;

  @Field(() => Granularity, { nullable: false })
  granularity: Granularity;

  @Field(() => String, { nullable: true })
  fillEmpty?: string = null;
}
