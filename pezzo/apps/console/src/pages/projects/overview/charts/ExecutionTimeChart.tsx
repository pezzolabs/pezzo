import { useTimeframeSelector } from "src/lib/providers/TimeframeSelectorContext";
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
import { useCurrentProject } from "src/lib/hooks/useCurrentProject";
import { useGenericProjectMetricHistogram } from "src/graphql/hooks/queries";
import { HistogramIdType } from "~/@generated/graphql/graphql";
import { useFiltersAndSortParams } from "src/lib/hooks/useFiltersAndSortParams";
import { Loader2Icon } from "lucide-react";
import { MetricsTypes } from "pezzo/libs/common/src";

export const ExecutionTimeChart = () => {
  const { project } = useCurrentProject();
  const { startDate, endDate } = useTimeframeSelector();
  const controls = useProjectMetricControls();
  const { filters } = useFiltersAndSortParams();

  const durationHistogram =
    useGenericProjectMetricHistogram<MetricsTypes.ExeceutionTypeChartResultDataType>(
      {
        projectId: project?.id,
        histogramId: HistogramIdType.RequestDuration,
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
        <div className="animate-spin">
          <Loader2Icon className="h-20 w-20 text-primary" />
        </div>
      </div>
    );
  }

  const data = durationHistogram.histogram.data.map((d) => ({
    timestamp: d.timestamp,
    value: d.value,
  }));

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
          tickFormatter={(value) => `${(value / 1000).toFixed(2)}s`}
        />
        <Tooltip
          cursor={{ opacity: 0.2 }}
          content={TooltipWithTimestamp}
          formatter={(value, key) =>
            key !== "value"
              ? value
              : `${((value as number) / 1000).toFixed(2)}s`
          }
        />
        <Legend
          payload={[
            {
              id: "value",
              value: `Duration (seconds)`,
              color: colors.neutral["400"],
            },
          ]}
        />
        <Line
          type="monotone"
          name="Duration"
          dataKey="value"
          stroke={colors.neutral["400"]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
