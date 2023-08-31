import { Card, Col, Row, Space, Typography, Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { SuccessErrorRateChart } from "./charts/SuccessErrorRateChart";
import { GenericChartControls } from "./charts/GenericChartControls";
import { ExecutionTimeChart } from "./charts/ExecutionTimeChart";
import { TotalCostChart } from "./charts/TotalCostChart";
import { StatisticBox } from "./charts/StatisticBox";
import { useProjectOverviewMetrics } from "./useProjectOverviewMetrics";
import { useState } from "react";
import { ProjectMetricTimeframe } from "../../../../@generated/graphql/graphql";
import { DownOutlined } from "@ant-design/icons";
import colors from "tailwindcss/colors";

const timeframeToLabelMapping = {
  [ProjectMetricTimeframe.Daily]: "Today",
  [ProjectMetricTimeframe.Weekly]: "This Week",
  [ProjectMetricTimeframe.Monthly]: "This Month",
};

export const OverviewPage = () => {
  const [timeframe, setTimeframe] = useState<ProjectMetricTimeframe>(
    ProjectMetricTimeframe.Daily
  );

  const metrics = useProjectOverviewMetrics(timeframe);

  const menuItems: MenuProps["items"] = [
    {
      key: ProjectMetricTimeframe.Daily,
      label: timeframeToLabelMapping[ProjectMetricTimeframe.Daily],
      onClick: () => setTimeframe(ProjectMetricTimeframe.Daily),
    },
    {
      key: ProjectMetricTimeframe.Weekly,
      label: timeframeToLabelMapping[ProjectMetricTimeframe.Weekly],
      onClick: () => setTimeframe(ProjectMetricTimeframe.Weekly),
    },
    {
      key: ProjectMetricTimeframe.Monthly,
      label: timeframeToLabelMapping[ProjectMetricTimeframe.Monthly],
      onClick: () => setTimeframe(ProjectMetricTimeframe.Monthly),
    },
  ];

  return (
    <>
      <Space>
        <Typography.Title level={2}>Overview</Typography.Title>
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Button type="text" style={{ marginBottom: 10, marginLeft: 10, color: colors.stone[400] }}>
            <Space>
              {timeframeToLabelMapping[timeframe]}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
      <Row gutter={[24, 24]} style={{ marginBottom: 26 }}>
        <Col span={6}>
          <Card style={{ width: "100%", minWidth: 200 }}>
            <StatisticBox
              title="Request (Daily)"
              currentValue={metrics?.requests?.currentValue}
              previousValue={metrics?.requests?.previousValue}
              numberSeparator=","
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: "100%", minWidth: 200 }}>
            <StatisticBox
              title="Cost (Daily)"
              currentValue={metrics?.cost?.currentValue}
              previousValue={metrics?.cost?.previousValue}
              numberPrefix="$"
              numberSeparator=","
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: "100%", minWidth: 200 }}>
            <StatisticBox
              title="Avg. Request Duration (Daily)"
              currentValue={metrics?.avgExecutionDuration?.currentValue}
              previousValue={metrics?.avgExecutionDuration?.previousValue}
              numberSuffix="ms"
              numberSeparator=""
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: "100%", minWidth: 200 }}>
            <StatisticBox
              title="Success Rate (Daily)"
              currentValue={metrics?.successRate?.currentValue}
              previousValue={metrics?.successRate?.previousValue}
              numberSuffix="%"
              numberSeparator=""
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        {/* Success/Error Rate */}
        <Col span={12} style={{ height: 540 }}>
          <Card style={{ width: "100%" }}>
            <div style={{ marginBottom: 12 }}>
              <Typography.Title level={4}>Success/Error Rate</Typography.Title>
              <GenericChartControls />
              <div style={{ height: 360 }}>
                <SuccessErrorRateChart />
              </div>
            </div>
          </Card>
        </Col>
        {/* Average Execution Time */}
        <Col span={12} style={{ height: 540 }}>
          <Card style={{ width: "100%" }}>
            <div style={{ marginBottom: 12 }}>
              <Typography.Title level={4}>
                Execution Duration (Average)
              </Typography.Title>
              <GenericChartControls />
              <div style={{ height: 360 }}>
                <ExecutionTimeChart />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        {/* Total Cost Chart */}
        <Col span={24} style={{ height: 540 }}>
          <Card style={{ width: "100%" }}>
            <div style={{ marginBottom: 12 }}>
              <Typography.Title level={4}>
                Total Cost (Per Provider)
              </Typography.Title>
              <GenericChartControls />
              <div style={{ height: 360 }}>
                <TotalCostChart />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};
