import { Aggregation, PromptExecutionMetricField } from "@pezzo/graphql";
import { Col, Row, theme } from "antd";
import { MetricProvider } from "../../../lib/providers/MetricContext";
import { SimpleChart } from "../metrics/SimpleChart";

export const DashboardView = () => {
  const { token } = theme.useToken();

  return (
    <div style={{ marginTop: token.marginMD }}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <MetricProvider
            aggregation={Aggregation.Sum}
            title="Total Cost"
            field={PromptExecutionMetricField.TotalCost}
            fillEmpty="0.0"
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
            fillEmpty="0"
          >
            <SimpleChart lineLabel="Tokens" />
          </MetricProvider>
        </Col>
        <Col span={12}>
          <MetricProvider
            aggregation={Aggregation.Count}
            title="Total Executions"
            fillEmpty={"0"}
            field={PromptExecutionMetricField.Status}
          >
            <SimpleChart lineLabel="Executions" />
          </MetricProvider>
        </Col>
        <Col span={12}>
          <MetricProvider
            aggregation={Aggregation.Mean}
            title="Avg. Execution Duration"
            fillEmpty={"0.0"}
            field={PromptExecutionMetricField.Duration}
          >
            <SimpleChart
              lineLabel="Duration"
              tooltipFormatter={(v) => `${Number(v).toFixed(2)}s`}
            />
          </MetricProvider>
        </Col>
      </Row>
    </div>
  );
};
