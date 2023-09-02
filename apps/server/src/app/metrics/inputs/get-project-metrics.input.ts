import { Field, InputType, registerEnumType } from "@nestjs/graphql";

export enum ProjectMetricType {
  requests = "requests",
  cost = "cost",
  duration = "duration",
  successfulRequests = "successfulRequests",
  erroneousRequests = "erroneousRequests",
}

registerEnumType(ProjectMetricType, {
  name: "ProjectMetricType",
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
}

export enum ProjectMetricHistogramBucketSize {
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
export class GetProjectMetricHistogramInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => ProjectMetricType, { nullable: false })
  metric: ProjectMetricType;

  @Field(() => Date, { nullable: false })
  startDate: Date;

  @Field(() => Date, { nullable: false })
  endDate: Date;

  @Field(() => ProjectMetricHistogramBucketSize, { nullable: true })
  bucketSize?: ProjectMetricHistogramBucketSize; // The size of each histogram bucket, e.g., "1d", "1w", "1h"
}
