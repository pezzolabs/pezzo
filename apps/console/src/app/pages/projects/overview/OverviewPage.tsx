import { Card, Col, Row, Statistic, Typography } from "antd";
import { SuccessErrorRateChart } from "./charts/SuccessErrorRateChart";
import { GenericChartControls } from "./charts/GenericChartControls";
import { ExecutionTimeChart } from "./charts/ExecutionTimeChart";
import { TotalCostChart } from "./charts/TotalCostChart";
import colors from "tailwindcss/colors";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

export const OverviewPage = () => {
  return (
    <>
      <Typography.Title level={2}>Overview</Typography.Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 26 }}>
        <Col span={6}>
          <Card style={{ width: "100%", minWidth: 200 }}>
            <Statistic
              title="Monthly Usage"
              value={9.12}
              precision={2}
              valueStyle={{ color: colors.green[400] }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: "100%", minWidth: 200 }}>
            <Statistic
              title="Cost Saving"
              value={248}
              precision={2}
              valueStyle={{ color: colors.green[400] }}
              prefix={"$"}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: "100%", minWidth: 200 }}>
            <Statistic
              title="Average Respnose Time"
              value={1.52}
              precision={2}
              valueStyle={{ color: colors.red[400] }}
              prefix={<ArrowUpOutlined />}
              suffix={"ms"}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: "100%", minWidth: 200 }}>
            <Statistic
              title="Error Rate"
              value={14.55}
              precision={2}
              valueStyle={{ color: colors.green[400] }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
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
