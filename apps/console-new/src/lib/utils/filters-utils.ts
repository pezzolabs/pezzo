import { FilterOperator, SortOrder } from "../../../@generated/graphql/graphql";

export const extractSortAndFiltersFromSearchParams = (
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
