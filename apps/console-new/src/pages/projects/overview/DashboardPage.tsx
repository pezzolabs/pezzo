import { Card, Col, Row, Typography } from "antd";
import Icon from "@ant-design/icons/lib/components/Icon";
import { SuccessErrorRateChart } from "./charts/SuccessErrorRateChart";
import { ProjectMetricControlsProvider } from "./charts/ProjectMetricContext";
import { TimeframeSelector } from "~/components/metrics/TimeframeSelector";
import { TimeframeSelectorProvider } from "~/lib/providers/TimeframeSelectorContext";
import { StatisticsSection } from "./StatisticsSection";
import { ExecutionTimeChart } from "./charts/ExecutionTimeChart";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import { RequestFilters } from "~/components/requests/RequestFilters";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useFiltersAndSortParams } from "~/lib/hooks/useFiltersAndSortParams";
import { Popover, PopoverContent, PopoverTrigger, Button } from "@pezzo/ui";

export const DashboardPage = () => {
  usePageTitle("Dashboard");
  const { filters } = useFiltersAndSortParams();

  return (
    <TimeframeSelectorProvider>
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Icon
                  style={{ marginRight: 0, fontSize: 16 }}
                  viewBox="0 0 1024 1024"
                >
                  <FunnelIcon style={{ fontSize: 16 }} />
                </Icon>
                Filters {filters.length ? `(${filters.length})` : ""}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <RequestFilters />
            </PopoverContent>
          </Popover>
          <TimeframeSelector />
        </div>
      </div>
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
    </TimeframeSelectorProvider>
  );
};
