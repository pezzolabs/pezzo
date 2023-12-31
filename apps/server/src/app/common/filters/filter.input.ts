import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { RequestReportFilterFields } from "./shared";

export enum FilterOperator {
  eq = "eq",
  neq = "neq",
  in = "in",
  nin = "nin",
  like = "like",
  gt = "gt",
  gte = "gte",
  lt = "lt",
  lte = "lte",
}
registerEnumType(FilterOperator, {
  name: "FilterOperator",
});

export const getSQLOperatorByFilterOperator = (
  operator: FilterOperator
): string => {
  switch (operator) {
    case FilterOperator.eq:
      return "=";
    case FilterOperator.neq:
      return "!=";
    case FilterOperator.in:
      return "IN";
    case FilterOperator.nin:
      return "NOT IN";
    case FilterOperator.like:
      return "LIKE";
    case FilterOperator.gt:
      return ">";
    case FilterOperator.gte:
      return ">=";
    case FilterOperator.lt:
      return "<";
    case FilterOperator.lte:
      return "<=";
    default:
      throw new Error(`Unknown filter operator: ${operator}`);
  }
};

@InputType()
export class FilterInput {
  @Field(() => String, { nullable: false })
  field: RequestReportFilterFields;

  @Field(() => FilterOperator, { nullable: false })
  operator: FilterOperator;

  @Field(() => String, { nullable: false })
  value: string | string[];
}
