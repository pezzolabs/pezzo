import { AddFilterItem, FilterItem } from "./filters/FilterItem";
import { useFiltersAndSortParams } from "~/lib/hooks/useFiltersAndSortParams";
import {
  NUMBER_FILTER_OPERATORS,
  STRING_FILTER_OPERATORS,
} from "~/lib/constants/filters";

export const RequestFilters = () => {
  const { filters, removeFilter, addFilter } = useFiltersAndSortParams();

  return (
    <div className="flex flex-col gap-4">
      <AddFilterItem onAdd={addFilter} />

      {filters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-4">
          {filters.map((filter) => (
            <FilterItem
              key={`${filter.field}-${filter.operator}-${filter.value}`}
              field={filter.field}
              operator={
                [...STRING_FILTER_OPERATORS, ...NUMBER_FILTER_OPERATORS].find(
                  (op) => op.value === filter.operator
                )?.label
              }
              value={filter.value}
              onRemoveFilter={() => removeFilter(filter)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
