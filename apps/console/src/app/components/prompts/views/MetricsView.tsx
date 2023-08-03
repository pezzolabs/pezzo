import {
  Aggregation,
  PromptExecutionMetricField,
} from "../../../../@generated/graphql/graphql";
import { Col, Row, theme } from "antd";
import { MetricProvider } from "../../../lib/providers/MetricContext";
import { SimpleChart } from "../metrics/SimpleChart";
import React from "react";
import { trackEvent } from "../../../lib/utils/analytics";

export const MetricsView = () => {
  const { token } = theme.useToken();

  React.useEffect(() => {
    trackEvent("prompt_metrics_view");
  }, []);

  return (
    <div style={{ marginTop: token.marginMD }}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <MetricProvider
            aggregation={Aggregation.Sum}
            title="Total Cost"
            field={PromptExecutionMetricField.TotalCost}
          >
            <SimpleChart
              lineLabel="Cost"
              tooltipFormatter={(v) => `$${Number(v).toFixed(3)}`}
            />
          </MetricProvider>
        </Col>
        <Col span={12}>
          <MetricProvider
            aggregation={Aggregation.Sum}
            title="Total Tokens"
            field={PromptExecutionMetricField.TotalTokens}
          >
            <SimpleChart lineLabel="Tokens" />
          </MetricProvider>
        </Col>
        <Col span={12}>
          <MetricProvider
            aggregation={Aggregation.Count}
            title="Total Executions"
          >
            <SimpleChart lineLabel="Executions" />
          </MetricProvider>
        </Col>
        <Col span={12}>
          <MetricProvider
            aggregation={Aggregation.Avg}
            title="Avg. Execution Duration"
            field={PromptExecutionMetricField.Duration}
          >
            <SimpleChart
              lineLabel="Duration"
              tooltipFormatter={(v) => `${(Number(v) / 1000).toFixed(2)}s`}
            />
          </MetricProvider>
        </Col>
      </Row>
    </div>
  );
};
