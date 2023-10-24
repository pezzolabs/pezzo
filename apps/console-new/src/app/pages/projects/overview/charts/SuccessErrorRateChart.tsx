import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import colors from "tailwindcss/colors";
import { useProjectMetricHistogram } from "../../../../graphql/hooks/queries";
import {
  HistogramMetric,
  ProjectMetricType,
} from "../../../../../@generated/graphql/graphql";
import { useCurrentProject } from "../../../../lib/hooks/useCurrentProject";
import { useTimeframeSelector } from "../../../../lib/providers/TimeframeSelectorContext";
import { useProjectMetricControls } from "./ProjectMetricContext";
import { TooltipWithTimestamp } from "./TooltipWithTimestamp";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useFiltersAndSortParams } from "../../../../lib/hooks/useFiltersAndSortParams";

const histogramToChartData = (
  totalRequests: HistogramMetric[],
  erroneousRequests: HistogramMetric[]
) => {
  return totalRequests.map((entry) => {
    const errorEntry = erroneousRequests.find((e) => e.date === entry.date);

    return {
      timestamp: entry.date,
      requests: entry.value,
      errors: errorEntry ? errorEntry.value : 0,
    };
  });
};

export const SuccessErrorRateChart = () => {
  const { startDate, endDate } = useTimeframeSelector();
  const controls = useProjectMetricControls();
  const { filters } = useFiltersAndSortParams();

  const { project } = useCurrentProject();
  const totalRequestsHistogram = useProjectMetricHistogram(
    {
      projectId: project?.id,
      metric: ProjectMetricType.Requests,
      bucketSize: controls.bucketSize,
      startDate: startDate,
      endDate: endDate,
      filters,
    },
    {
      enabled: !!project && !!startDate && !!endDate,
    }
  );

  const erroneousRequestsHistogram = useProjectMetricHistogram(
    {
      projectId: project?.id,
      metric: ProjectMetricType.ErroneousRequests,
      bucketSize: controls.bucketSize,
      startDate: startDate,
      endDate: endDate,
    },
    {
      enabled: !!project && !!startDate && !!endDate,
    }
  );

  if (
    totalRequestsHistogram.isLoading ||
    erroneousRequestsHistogram.isLoading
  ) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin
          spinning
          indicator={<LoadingOutlined style={{ fontSize: 60 }} />}
        />
      </div>
    );
  }

  const data = histogramToChartData(
    totalRequestsHistogram.histogram,
    erroneousRequestsHistogram.histogram
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral["600"]} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(v) => controls.formatTimestamp(v)}
        />
        <YAxis />
        <Tooltip cursor={{ opacity: 0.2 }} content={TooltipWithTimestamp} />
        <Legend
          payload={[
            {
              id: "requests",
              value: `Requests`,
              color: colors.neutral["400"],
            },
            {
              id: "errors",
              value: `Errors`,
              color: colors.red["400"],
            },
          ]}
        />
        <Bar dataKey="errors" stackId="a" fill={colors.red["400"]} />
        <Bar
          dataKey="requests"
          stackId="a"
          stroke={colors.neutral["700"]}
          fill={colors.neutral["800"]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
