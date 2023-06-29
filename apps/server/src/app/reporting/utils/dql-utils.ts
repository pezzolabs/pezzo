import { FilterInput, FilterOperator } from "../../common/filters/filter.input";
import { SortInput } from "../../common/filters/sort.input";
import bodybuilder from "bodybuilder";

const exampleReport = {
  ownership: {
    organizationId: "cljdau1v50005e7a28awk3o6n",
    projectId: "cljizf1or0253q1a2rhq197uz",
  },
  reportId: "7e639915-54d1-4a6e-9a7e-98f94e270876",
  calculated: {
    promptCost: 0.000098,
    completionCost: 0.000124,
    totalCost: 0.000222,
    totalTokens: 127,
    duration: 2600,
  },
  provider: "OpenAI",
  type: "ChatCompletion",
  metadata: { conversationId: "task-generator" },
  request: {
    timestamp: "2023-06-30T20:00:59.437Z",
    body: {
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 1000,
      messages: [],
    },
  },
  response: {
    timestamp: "2023-06-30T20:01:02.037Z",
    body: {
      id: "chatcmpl-7XEaZV94h0bdNGr9p5FaMGj2MWiZ0",
      object: "chat.completion",
      created: 1688155259,
      model: "gpt-3.5-turbo-0613",
      choices: [],
      usage: {},
    },
    status: 200,
  },
};

export function validateKey(obj, key) {
  const keys = key.split(".");
  let currentObj = obj;

  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];

    // eslint-disable-next-line no-prototype-builtins
    if (!currentObj.hasOwnProperty(currentKey)) {
      return false;
    }

    currentObj = currentObj[currentKey];
  }

  return true;
}

export const mapFiltersToDql = ({
  projectId,
  organizationId,
  filters,
  sort,
}: {
  projectId: string;
  organizationId: string;
  filters?: FilterInput[];
  sort?: SortInput;
}) => {
  let body = bodybuilder()
    .query("match", "ownership.projectId", projectId)
    .query("match", "ownership.organizationId", organizationId);

  if (sort) {
    body = body.sort(sort.field, sort.direction);
  } else {
    body = body.sort("request.timestamp", "desc");
  }

  filters.forEach((filter) => {
    if (!validateKey(exampleReport, filter.field)) return;

    switch (filter.operator) {
      case FilterOperator.eq:
        body = body.filter("term", filter.field, filter.value);
        break;
      case FilterOperator.neq:
        body = body.notFilter("term", filter.field, filter.value);
        break;
      case FilterOperator.in:
        // Ensure that filter.value is an array for 'in' operator
        if (!Array.isArray(filter.value)) {
          throw new Error(`Operator 'in' requires an array of values.`);
        }
        body = body.filter("terms", filter.field, filter.value);
        break;
      case FilterOperator.nin:
        // Ensure that filter.value is an array for 'nin' operator
        if (!Array.isArray(filter.value)) {
          throw new Error(`Operator 'nin' requires an array of values.`);
        }
        body = body.notFilter("terms", filter.field, filter.value);
        break;
      case FilterOperator.contains:
        body = body.query("match", filter.field, filter.value);
        break;
      case FilterOperator.gt:
      case FilterOperator.gte:
      case FilterOperator.lt:
      case FilterOperator.lte:
        body = body.filter("range", filter.field, {
          [filter.operator]: filter.value,
        });
        break;
      default:
        throw new Error(`Unknown filter operator: ${filter.operator}`);
    }
  });

  return body.build();
};
