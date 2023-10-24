import { Space } from "antd";
import { AddFilterItem, FilterItem } from "./filters/FilterItem";
import { useFiltersAndSortParams } from "../../lib/hooks/useFiltersAndSortParams";
import {
  NUMBER_FILTER_OPERATORS,
  STRING_FILTER_OPERATORS,
} from "../../lib/constants/filters";

export const RequestFilters = () => {
  const { filters, removeFilter, addFilter } = useFiltersAndSortParams();

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <AddFilterItem onAdd={addFilter} />
      <Space direction="horizontal" style={{ width: "100%", flexWrap: "wrap" }}>
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
      </Space>
    </Space>
  );
};
