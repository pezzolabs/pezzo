import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo } from "react";
import { extractSortAndFiltersFromSearchParams } from "../utils/filters-utils";
import { FilterInput } from "../../../@generated/graphql/graphql";

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
