import { RequestReportItem } from "../../pages/requests/types";
import { Card, Space } from "antd";
import styled from "@emotion/styled";
import { AddFilterItem, FilterItem } from "./filters/FilterItem";
import { useFiltersAndSortParams } from "../../lib/hooks/useFiltersAndSortParams";
import {
  NUMBER_FILTER_OPERATORS,
  STRING_FILTER_OPERATORS,
} from "../../lib/constants/filters";

const Box = styled.div`
  padding: 10px 0;
`;

interface Props {
  requests: RequestReportItem[];
}

export const RequestFilters = (props: Props) => {
  const { filters, removeFilter, addFilter } = useFiltersAndSortParams();

  return (
    <Box>
      <Card style={{ width: "100%" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <AddFilterItem onAdd={addFilter} />
          <Space
            direction="horizontal"
            style={{ width: "100%", flexWrap: "wrap" }}
          >
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
      </Card>
    </Box>
  );
};
