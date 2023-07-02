import { InputType } from "@nestjs/graphql";
import { FILTER_FIELDS_ALLOW_LIST } from "../constants/filters";

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

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export interface FilterInput {
  field: string;

  operator: FilterOperator;

  value: string | string[];
}
