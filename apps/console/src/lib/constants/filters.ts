export type FilterDefinition = {
  value: string;
  type: "number" | "string" | "date";
  label: string;
  formatter?: (value: string) => string;
};

export const FILTER_FIELDS_LIST: FilterDefinition[] = [
  {
    value: "duration",
    type: "number",
    label: "Duration (ms)",
  },
  // {
  //   value: "environment",
  //   type: "string",
  //   label: "Environment",
  // },
  {
    value: "responseStatusCode",
    type: "number",
    label: "Status",
  },
  {
    value: "timestamp",
    type: "date",
    label: "Timestamp",
  },
  // {
  //   value: "totalCost",
  //   type: "number",
  //   label: "Total Cost",
  // },
  {
    value: "totalTokens",
    type: "number",
    label: "Total Tokens",
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
    value: "like",
    label: "LIKE",
  },
];
