import { FilterInput, FilterOperator } from "../../common/filters/filter.input";
import { SortInput } from "../../common/filters/sort.input";
import bodybuilder from "bodybuilder";

const FILTER_FIELDS_ALLOW_LIST = new Set([
  "reportId",
  "calculated.*",
  "provider",
  "type",
  "properties.*",
  "metadata.*",
  "request.timestamp",
  "response.timestamp",
  "response.status",
]);

function isValidFilterField(field: string): boolean {
  // Check if the field is directly in the allow list
  if (FILTER_FIELDS_ALLOW_LIST.has(field)) {
    return true;
  }

  // If the field is not directly in the allow list, check for wildcard matches
  const fieldParts = field.split(".");

  // Build a filter field to check against the allow list, starting with the first part of the field
  let checkField = fieldParts[0];

  for (let i = 1; i < fieldParts.length; i++) {
    // Add a wildcard to the checkField and see if it's in the allow list
    checkField += ".*";
    if (FILTER_FIELDS_ALLOW_LIST.has(checkField)) {
      return true;
    }

    // If we didn't find a match with the wildcard, add the next part of the field to checkField and continue
    checkField = `${checkField.slice(0, -1)}.${fieldParts[i]}`;
  }

  // If we've gone through all parts of the field and didn't find a match in the allow list, the field is not allowed
  return false;
}

export const mapFiltersToDql = ({
  restrictions,
  filters,
  sort,
}: {
  restrictions: Record<string, unknown>;
  filters?: FilterInput[];
  sort?: SortInput;
}) => {
  let body = bodybuilder();

  for (const key in restrictions) {
    body = body.query("match", key, restrictions[key]);
  }

  if (sort != null) {
    body = body.sort(sort.field, sort.order);
  } else {
    body = body.sort("request.timestamp", "desc");
  }

  filters?.forEach((filter) => {
    if (!isValidFilterField(filter.field)) return;

    switch (filter.operator.toLowerCase()) {
      case FilterOperator.eq:
        body = body.filter(
          "term",
          filter.field,
          String(filter.value).toLowerCase()
        );
        break;
      case FilterOperator.neq:
        body = body.notFilter("term", filter.field, filter.value);
        break;
      case FilterOperator.in:
        // Ensure that filter.value is an array for 'in' operator
        if (!Array.isArray(filter.value)) {
          throw new Error(`Operator 'in' requires an array of values.`);
        }
        body = body.filter(
          "terms",
          filter.field,
          filter.value.map((value) => String(value).toLowerCase())
        );
        break;
      case FilterOperator.nin:
        // Ensure that filter.value is an array for 'nin' operator
        if (!Array.isArray(filter.value)) {
          throw new Error(`Operator 'nin' requires an array of values.`);
        }
        body = body.notFilter(
          "terms",
          filter.field,
          filter.value.map((value) => String(value).toLowerCase())
        );
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

  return body;
};
