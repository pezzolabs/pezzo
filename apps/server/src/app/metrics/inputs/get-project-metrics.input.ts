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

export enum ProjectMetricTimeframe {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
}

registerEnumType(ProjectMetricTimeframe, {
  name: "ProjectMetricTimeframe",
});

@InputType()
export class GetProjectMetricInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => ProjectMetricType, { nullable: false })
  metric: ProjectMetricType;

  @Field(() => ProjectMetricTimeframe, { nullable: false })
  timeframe: ProjectMetricTimeframe;
}
