import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { RequestReportFilterFields } from "./shared";

export enum FilterOperator {
  eq = "eq",
  neq = "neq",
  in = "in",
  nin = "nin",
  contains = "contains",
  gt = "gt",
  gte = "gte",
  lt = "lt",
  lte = "lte",
}
registerEnumType(FilterOperator, {
  name: "FilterOperator",
});

@InputType()
export class FilterInput {
  @Field(() => String, { nullable: false })
  field: RequestReportFilterFields;

  @Field(() => FilterOperator, { nullable: false })
  operator: FilterOperator;

  @Field(() => String, { nullable: false })
  value: string | string[];

  @Field(() => String, { nullable: true })
  secondValue?: string | string[];
}
