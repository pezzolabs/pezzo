import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import {
  FilterOperator,
  FilterType,
  SortDirection,
} from "../../../@generated/graphql/graphql";

const extractSortAndFiltersFromSearchParams = (
  searchParams: URLSearchParams
) => {
  const filterParams: (string | null)[] | null = searchParams.getAll("f");
  const filters = filterParams?.map((filterParam) => {
    const [field, operator, value, secondValue] = (filterParam ?? ":").split(
      ":"
    );
    return {
      type: FilterType.Filter,
      field,
      operator: operator as FilterOperator,
      value,
      secondValue,
    };
  });

  const sortParam = searchParams.get("sort");
  // eslint-disable-next-line no-unsafe-optional-chaining
  const [sortField, sortDirection] = sortParam?.split(":") ?? [];

  return {
    filters,
    sort: sortField &&
      sortDirection && {
        type: FilterType.Sort,
        field: sortField,
        direction: (sortDirection as SortDirection) ?? SortDirection.Desc,
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

  return {
    filters,
    sort,
  };
};
