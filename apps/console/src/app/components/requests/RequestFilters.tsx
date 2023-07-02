import { RequestReportItem } from "../../pages/requests/types";
import { Card } from "antd";
import styled from "@emotion/styled";
import { AddFilterItem, FilterItem } from "./filters/FilterItem";
import { Typography } from "antd";
import { useFiltersAndSortParams } from "../../graphql/hooks/filters";

const { Title } = Typography;

const Box = styled.div`
  padding: 10px 0;
`;

const FiltersList = styled.div`
  display: flex;
`;

interface Props {
  requests: RequestReportItem[];
}

export const RequestFilters = (props: Props) => {
  const { filters, removeFilter, addFilter } = useFiltersAndSortParams();

  return (
    <Box>
      <Card
        style={{ width: "100%" }}
        bodyStyle={{ display: "flex", alignItems: "center" }}
      >
        <Title level={4} style={{ margin: 0, marginRight: 5 }}>
          Filters:
        </Title>
        <FiltersList>
          {filters.map((filter) => (
            <FilterItem
              key={`${filter.field}-${filter.operator}-${filter.value}`}
              field={filter.field}
              operator={filter.operator}
              value={filter.value}
              onRemoveFilter={() => removeFilter(filter)}
            />
          ))}
          <AddFilterItem onAdd={addFilter} />
        </FiltersList>
      </Card>
    </Box>
  );
};
