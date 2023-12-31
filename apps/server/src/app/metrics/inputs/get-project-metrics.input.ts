import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { FilterInput } from "../../common/filters/filter.input";

export enum ProjectMetricType {
  requests = "requests",
  cost = "cost",
  duration = "duration",
  successfulRequests = "successfulRequests",
  erroneousRequests = "erroneousRequests",
  model = "model"
}

registerEnumType(ProjectMetricType, {
  name: "ProjectMetricType",
});

export enum HistogramIdType {
  requestDuration = "requestDuration",
  successErrorRate = "successErrorRate",
  modelUsage = "modelUsage",
}

registerEnumType(HistogramIdType, {
  name: "HistogramIdType",
});

export enum DeltaAggregation {
  sum = "sum",
  avg = "avg",
  min = "min",
  max = "max",
  count = "count",
}

registerEnumType(DeltaAggregation, {
  name: "DeltaAggregation",
});

export enum DeltaMetricType {
  TotalCost = "TotalCost",
  TotalTokens = "TotalTokens",
  TotalRequests = "TotalRequests",
  AverageRequestDuration = "AverageRequestDuration",
  SuccessResponses = "SuccessfulResponses",
  ErrorResponses = "ErroneousResponses",
}

registerEnumType(DeltaMetricType, {
  name: "DeltaMetricType",
});

@InputType()
export class GetProjectMetricInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => ProjectMetricType, { nullable: false })
  metric: ProjectMetricType;

  @Field(() => Date, { nullable: false })
  startDate: Date;

  @Field(() => Date, { nullable: false })
  endDate: Date;

  @Field(() => [FilterInput], { nullable: true })
  filters?: FilterInput[];
}

export enum ProjectMetricHistogramBucketSize {
  minutely = "1m",
  hourly = "1h",
  daily = "1d",
  weekly = "1w",
  monthly = "30d",
  yearly = "1y",
}

registerEnumType(ProjectMetricHistogramBucketSize, {
  name: "ProjectMetricHistogramBucketSize",
});

@InputType()
export class BaseProjectMetricInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => Date, { nullable: false })
  startDate: Date;

  @Field(() => Date, { nullable: false })
  endDate: Date;

  @Field(() => ProjectMetricHistogramBucketSize, { nullable: true })
  bucketSize?: ProjectMetricHistogramBucketSize; // The size of each histogram bucket, e.g., "1d", "1w", "1h"

  @Field(() => [FilterInput], { nullable: true })
  filters?: FilterInput[];
}

@InputType()
export class GetProjectMetricHistogramInput extends BaseProjectMetricInput {
  @Field(() => ProjectMetricType, { nullable: false })
  metric: ProjectMetricType;
}


@InputType()
export class GetProjectGenericHistogramInput extends BaseProjectMetricInput {
  @Field(() => HistogramIdType, { nullable: false })
  histogramId: HistogramIdType;
}

@InputType()
export class GetProjectModelUsageHistogramInput extends BaseProjectMetricInput {
}

@InputType()
export class GetProjectMetricDeltaInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => Date, { nullable: false })
  startDate: Date;

  @Field(() => Date, { nullable: false })
  endDate: Date;

  @Field(() => DeltaMetricType, { nullable: true })
  metric: DeltaMetricType;
}