export type FilterDefinition = {
  value: string;
  type: "number" | "string" | "date";
  label: string;
  formatter?: (value: string) => string;
};

export const FILTER_FIELDS_LIST: FilterDefinition[] = [
  {
    value: "calculated.duration",
    type: "number",
    label: "Duration (ms)",
  },
  {
    value: "metadata.environment",
    type: "string",
    label: "Environment",
  },
  {
    value: "response.status",
    type: "number",
    label: "Status",
  },
  {
    value: "request.timestamp",
    type: "date",
    label: "Timestamp",
  },
  {
    value: "calculated.totalCost",
    type: "number",
    label: "Total Cost",
  },
  {
    value: "calculated.totalTokens",
    type: "number",
    label: "Total Tokens",
  },
  {
    value: "property",
    type: "string",
    label: "Custom Property",
  },
];

export const NUMBER_FILTER_OPERATORS: { value: string; label: string }[] = [
  {
    value: "eq",
    label: "=",
  },
  {
    value: "neq",
    label: "!=",
  },
  {
    value: "gt",
    label: ">",
  },
  {
    value: "gte",
    label: ">=",
  },
  {
    value: "lt",
    label: "<",
  },
  {
    value: "lte",
    label: "<=",
  },
];

export const STRING_FILTER_OPERATORS: { value: string; label: string }[] = [
  {
    value: "eq",
    label: "=",
  },
  {
    value: "neq",
    label: "!=",
  },
  {
    value: "contains",
    label: "LIKE",
  },
];
