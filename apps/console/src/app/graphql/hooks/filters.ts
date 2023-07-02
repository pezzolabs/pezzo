import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo } from "react";
import {
  FilterInput,
  FilterOperator,
  SortOrder,
} from "../../lib/types/filters";

const extractSortAndFiltersFromSearchParams = (
  searchParams: URLSearchParams
) => {
  const filterParams: (string | null)[] | null = searchParams.getAll("f");
  const filters = filterParams?.map((filterParam) => {
    const [field, operator, value] = (filterParam ?? ":").split(":");
    return {
      field,
      operator: operator as FilterOperator,
      value,
    };
  });

  const sortParam = searchParams.get("sort");
  // eslint-disable-next-line no-unsafe-optional-chaining
  const [sortField, sortOrder] = sortParam?.split(":") ?? [];

  return {
    filters,
    sort: sortField &&
      sortOrder && {
        field: sortField,
        order: (sortOrder as SortOrder) ?? SortOrder.Desc,
      },
  };
};

export const useFiltersAndSortParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { filters, sort } = useMemo(
    () => extractSortAndFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  useEffect(() => {
    if (!sort) setSearchParams({ sort: "request.timestamp:desc" });
  }, [setSearchParams, sort]);

  const addFilter = useCallback(
    ({ field, operator, value }: FilterInput) => {
      searchParams.append("f", `${field}:${operator}:${value}`);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const removeFilter = useCallback(
    (filterToRemove: FilterInput) => {
      // Get all instances of the parameter
      const allParams = searchParams.getAll("f");

      // Remove the specified instance
      const newParams = allParams.filter(
        (filter) =>
          filter !==
          `${filterToRemove.field}:${filterToRemove.operator}:${filterToRemove.value}`
      );

      // Delete all instances of the parameter from searchParams
      searchParams.delete("f");

      // Append the remaining instances to searchParams
      for (const newValue of newParams) {
        searchParams.append("f", newValue);
      }

      // Update the search parameters in the URL
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  return {
    filters,
    sort,
    removeFilter,
    addFilter,
  };
};
