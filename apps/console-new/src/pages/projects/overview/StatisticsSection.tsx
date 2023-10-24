import { Card, Col, Row } from "antd";
import { StatisticBox } from "~/components/metrics/StatisticBox";
import { useProjectOverviewMetrics } from "./useProjectOverviewMetrics";

export const StatisticsSection = () => {
  const metrics = useProjectOverviewMetrics();

  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 26 }}>
      <Col span={6}>
        <Card style={{ width: "100%", minWidth: 200 }}>
          <StatisticBox
            title="Requests"
            currentValue={metrics?.requests?.data?.currentValue}
            previousValue={metrics?.requests?.data?.previousValue}
            numberSeparator=","
            loading={metrics?.requests?.isLoading}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ width: "100%", minWidth: 200 }}>
          <StatisticBox
            title="Cost"
            currentValue={metrics?.cost?.data?.currentValue}
            previousValue={metrics?.cost?.data?.previousValue}
            numberPrefix="$"
            numberSeparator="."
            loading={metrics?.cost?.isLoading}
            precision={4}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ width: "100%", minWidth: 200 }}>
          <StatisticBox
            title="Avg. Request Duration"
            currentValue={metrics?.avgExecutionDuration?.data?.currentValue}
            previousValue={metrics?.avgExecutionDuration?.data?.previousValue}
            numberSuffix="ms"
            numberSeparator=""
            loading={metrics?.avgExecutionDuration?.isLoading}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ width: "100%", minWidth: 200 }}>
          <StatisticBox
            title="Success Rate"
            currentValue={metrics?.successRate?.data?.currentValue}
            previousValue={metrics?.successRate?.data?.previousValue}
            numberSuffix="%"
            numberSeparator=""
            loading={metrics?.successRate?.isLoading}
          />
        </Card>
      </Col>
    </Row>
  );
};
