import { createContext, useContext, useState } from "react";
import { useCurrentPrompt } from "./CurrentPromptContext";
import {
  Aggregation,
  GetMetricsQuery,
  Granularity,
  PromptExecutionMetricField,
} from "../../../@generated/graphql/graphql";
import { useGetPromptExecutionMetric } from "../hooks/useGetPromptExecutionMetric";
import { format } from "date-fns";
import { Card, Col, Empty, Radio, Row, Select, Typography, theme } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import ms from "ms";

interface MetricContextValue {
  data: GetMetricsQuery["metrics"];
  formatTimestamp: (timestamp: number) => string;
}

export const MetricContext = createContext<MetricContextValue>({
  data: undefined,
  formatTimestamp: () => void 0,
});

export const useMetric = () => useContext(MetricContext);

const calculateStartDate = (start: string): Date => {
  const startDate = new Date();
  const subtractMs = ms(start);
  startDate.setMilliseconds(startDate.getMilliseconds() + subtractMs);
  return startDate;
};

interface Props {
  children: React.ReactNode;
  title: string;
  field?: PromptExecutionMetricField;
  aggregation: Aggregation;
}

export const MetricProvider = ({
  children,
  title,
  field = null,
  aggregation,
}: Props) => {
  const { token } = theme.useToken();
  const { prompt } = useCurrentPrompt();
  const [granularity, setGranularity] = useState<Granularity>(Granularity.Day);
  const [start, setStart] = useState<string>("-7d");
  const startDate = calculateStartDate(start);

  const { data: metricsData, isLoading } = useGetPromptExecutionMetric(
    [prompt.id, "metrics", title, granularity, start],
    {
      promptId: prompt.id,
      field,
      aggregation,
      start: startDate.toISOString(),
      stop: new Date().toISOString(),
      granularity,
    }
  );

  if (!startDate || isLoading || !metricsData) {
    return <Loading3QuartersOutlined spin />;
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
        <div style={{ marginBottom: token.marginMD }}>
          <Typography.Title level={4}>{title}</Typography.Title>
          <Row style={{ marginBottom: token.marginLG }}>
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
          {metricsData.metrics.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No executions"
            />
          ) : (
            <div>{children}</div>
          )}
        </div>
      </Card>
    </MetricContext.Provider>
  );
};
