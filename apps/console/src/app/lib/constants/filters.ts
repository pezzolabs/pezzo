export const FILTER_FIELDS_LIST = [
  {
    value: "request.timestamp",
    type: "date",
    label: "Timestamp",
  },
  {
    value: "response.status",
    type: "number",
    label: "Status",
  },
  {
    value: "calculated.totalTokens",
    type: "number",
    label: "Total Tokens",
  },
  {
    value: "calculated.totalCost",
    type: "number",
    label: "Total Cost",
  },
  {
    value: "calculated.duration",
    type: "number",
    label: "Duration (ms)",
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
