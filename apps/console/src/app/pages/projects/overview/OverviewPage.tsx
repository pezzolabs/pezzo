import { Card, Col, Row, Typography } from "antd";
import { SuccessErrorRateChart } from "./charts/SuccessErrorRateChart";
import { ProjectMetricControlsProvider } from "./charts/ProjectMetricContext";
import { TimeframeSelector } from "../../../components/metrics/TimeframeSelector";
import { TimeframeSelectorProvider } from "../../../lib/providers/TimeframeSelectorContext";
import { StatisticsSection } from "./StatisticsSection";
import { ExecutionTimeChart } from "./charts/ExecutionTimeChart";

export const OverviewPage = () => {
  return (
    <TimeframeSelectorProvider>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Typography.Title level={2}>Overview</Typography.Title>
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
          <TimeframeSelector />
        </Col>
      </Row>
      <StatisticsSection />
      <Row gutter={[24, 24]}>
        <Col span={12} style={{}}>
          <Card style={{ width: "100%" }}>
            <Typography.Title level={4}>
              Requests/Errors (Total)
            </Typography.Title>
            <div style={{ height: 360 }}>
              <ProjectMetricControlsProvider>
                <SuccessErrorRateChart />
              </ProjectMetricControlsProvider>
            </div>
          </Card>
        </Col>
        <Col span={12} style={{ height: 540 }}>
          <Card style={{ width: "100%" }}>
            <Typography.Title level={4}>
              Request Duration (Average)
            </Typography.Title>

            <div style={{ height: 360 }}>
              <ProjectMetricControlsProvider>
                <ExecutionTimeChart />
              </ProjectMetricControlsProvider>
            </div>
          </Card>
        </Col>
      </Row>
      {/* <Row gutter={[24, 24]}>
        <Col span={24} style={{ height: 540 }}>
          <Card style={{ width: "100%" }}>
            <div style={{ marginBottom: 12 }}>
              <Typography.Title level={4}>
                Total Cost (Per Provider)
              </Typography.Title>
              <div style={{ height: 360 }}>
                <TotalCostChart />
              </div>
            </div>
          </Card>
        </Col>
      </Row> */}
    </TimeframeSelectorProvider>
  );
};
