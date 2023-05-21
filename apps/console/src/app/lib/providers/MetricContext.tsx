import { createContext, useContext, useState } from "react";
import { useCurrentPrompt } from "./CurrentPromptContext";
import {
  Aggregation,
  GetMetricsQuery,
  Granularity,
  PromptExecutionMetricField,
} from "@pezzo/graphql";
import { usePromptExecutionMetric } from "../hooks/usePromptExecutionMetric";
import { format } from "date-fns";
import { Card, Col, Radio, Row, Select, Typography } from "antd";

interface MetricContextValue {
  data: GetMetricsQuery["metrics"];
  formatTimestamp: (timestamp: number) => string;
}

export const MetricContext = createContext<MetricContextValue>({
  data: undefined,
  formatTimestamp: () => void 0,
});

export const useMetric = () => useContext(MetricContext);

interface Props {
  children: React.ReactNode;
  title: string;
  field: PromptExecutionMetricField;
  fillEmpty?: string;
  aggregation: Aggregation;
}

export const MetricProvider = ({
  children,
  title,
  field,
  fillEmpty,
  aggregation,
}: Props) => {
  const { prompt } = useCurrentPrompt();
  const [granularity, setGranularity] = useState<Granularity>(Granularity.Day);
  const [start, setStart] = useState<string>("-7d");

  const { data: metricsData, isLoading } = usePromptExecutionMetric(
    [prompt.id, "metrics", title, granularity, start],
    {
      promptId: prompt.id,
      start,
      stop: "now()",
      field,
      granularity,
      aggregation,
      fillEmpty,
    }
  );

  if (isLoading || !metricsData) {
    return <div>Loading...</div>;
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    switch (granularity) {
      case Granularity.Hour:
        return format(date, "yyyy-MM-dd HH:mm");
      case Granularity.Day:
        return format(date, "yyyy-MM-dd");
      case Granularity.Week:
        return format(date, "yyyy-MM-dd");
      case Granularity.Month:
        return format(date, "MMM yyyy");
    }
  };

  return (
    <MetricContext.Provider
      value={{
        data: metricsData.metrics,
        formatTimestamp,
      }}
    >
      <Card style={{ width: "100%" }}>
        <div style={{ marginBottom: 20 }}>
          <Typography.Title level={4}>{title}</Typography.Title>
          <Row>
            <Col span={12}>
              <Select
                defaultValue={start}
                style={{ width: 140 }}
                onSelect={setStart}
              >
                <Select.Option value="-1h">Past Hour</Select.Option>
                <Select.Option value="-1d">Past Day</Select.Option>
                <Select.Option value="-7d">Past 7 days</Select.Option>
                <Select.Option value="-30d">Past 30 days</Select.Option>
                <Select.Option value="-1y">Past year</Select.Option>
              </Select>
            </Col>
            <Col
              span={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Radio.Group
                value={granularity}
                onChange={(e) => setGranularity(e.target.value)}
              >
                <Radio.Button value={Granularity.Hour}>Hour</Radio.Button>
                <Radio.Button value={Granularity.Day}>Day</Radio.Button>
                <Radio.Button value={Granularity.Week}>Week</Radio.Button>
                <Radio.Button value={Granularity.Month}>Month</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </div>
        <div>
          {children}
        </div>
      </Card>
    </MetricContext.Provider>
  );
};
