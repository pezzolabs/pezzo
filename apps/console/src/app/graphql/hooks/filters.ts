import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { FilterOperator, SortOrder } from "../../../@generated/graphql/graphql";

const extractSortAndFiltersFromSearchParams = (
  searchParams: URLSearchParams
) => {
  const filterParams: (string | null)[] | null = searchParams.getAll("f");
  const filters = filterParams?.map((filterParam) => {
    const [field, operator, value, secondValue] = (filterParam ?? ":").split(
      ":"
    );
    return {
      field,
      operator: operator as FilterOperator,
      value,
      secondValue,
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

  return {
    filters,
    sort,
  };
};
