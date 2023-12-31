import { Card } from "@pezzo/ui";
import { StatisticBox } from "~/components/metrics/StatisticBox";
import { useProjectOverviewMetrics } from "./useProjectOverviewMetrics";

export const StatisticsSection = () => {
  const metrics = useProjectOverviewMetrics();

  return (
    <div className="grid grid-cols-12 gap-6">
      <Card className="col-span-3 p-6">
        <StatisticBox
          title="Requests"
          currentValue={metrics?.requests?.data?.currentValue}
          previousValue={metrics?.requests?.data?.previousValue}
          numberSeparator=","
          loading={metrics?.requests?.isLoading}
        />
      </Card>
      <Card className="col-span-3 p-6">
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
      <Card className="col-span-3 p-6">
        <StatisticBox
          title="Avg. Request Duration"
          currentValue={metrics?.avgExecutionDuration?.data?.currentValue}
          previousValue={metrics?.avgExecutionDuration?.data?.previousValue}
          numberSuffix="ms"
          numberSeparator=""
          loading={metrics?.avgExecutionDuration?.isLoading}
        />
      </Card>
      <Card className="col-span-3 p-6">
        <StatisticBox
          title="Success Rate"
          currentValue={metrics?.successRate?.data?.currentValue}
          previousValue={metrics?.successRate?.data?.previousValue}
          numberSuffix="%"
          numberSeparator="."
          precision={2}
          loading={metrics?.successRate?.isLoading}
        />
      </Card>
    </div>
  );
};
