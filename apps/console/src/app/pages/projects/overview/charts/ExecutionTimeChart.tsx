import { useTimeframeSelector } from "../../../../lib/providers/TimeframeSelectorContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import colors from "tailwindcss/colors";
import { useProjectMetricControls } from "./ProjectMetricContext";
import { TooltipWithTimestamp } from "./TooltipWithTimestamp";
import { useCurrentProject } from "../../../../lib/hooks/useCurrentProject";
import { useProjectMetricHistogram } from "../../../../graphql/hooks/queries";
import {
  HistogramMetric,
  ProjectMetricType,
} from "../../../../../@generated/graphql/graphql";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useFiltersAndSortParams } from "../../../../lib/hooks/useFiltersAndSortParams";

const histogramToChartData = (requests: HistogramMetric[]) => {
  return requests.map((entry) => ({
    timestamp: entry.date,
    duration: entry.value,
  }));
};

export const ExecutionTimeChart = () => {
  const { project } = useCurrentProject();
  const { startDate, endDate } = useTimeframeSelector();
  const controls = useProjectMetricControls();
  const { filters } = useFiltersAndSortParams();

  const durationHistogram = useProjectMetricHistogram(
    {
      projectId: project?.id,
      metric: ProjectMetricType.Duration,
      bucketSize: controls.bucketSize,
      startDate: startDate,
      endDate: endDate,
      filters,
    },
    {
      enabled: !!project && !!startDate && !!endDate,
    }
  );

  if (durationHistogram.isLoading) {
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

  const data = histogramToChartData(durationHistogram.histogram);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
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
        <YAxis
          domain={["dataMin", "dataMax"]}
          tickFormatter={(value) => `${value / 1000}s`}
        />
        <Tooltip
          cursor={{ opacity: 0.2 }}
          content={TooltipWithTimestamp}
          formatter={(value, key) =>
            key !== "duration" ? value : `${(value as number) / 1000}s`
          }
        />
        <Legend
          payload={[
            {
              id: "duration",
              value: `Duration (seconds)`,
              color: colors.neutral["400"],
            },
          ]}
        />
        <Line
          type="monotone"
          dataKey="error"
          stroke={colors.red["400"]}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="duration"
          stroke={colors.neutral["400"]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
