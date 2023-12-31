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
import { HistogramIdType } from "~/@generated/graphql/graphql";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { useTimeframeSelector } from "~/lib/providers/TimeframeSelectorContext";
import { useProjectMetricControls } from "./ProjectMetricContext";
import { TooltipWithTimestamp } from "./TooltipWithTimestamp";
import { useFiltersAndSortParams } from "~/lib/hooks/useFiltersAndSortParams";
import { Loader2Icon } from "lucide-react";
import { useGenericProjectMetricHistogram } from "~/graphql/hooks/queries";
import { MetricsTypes } from "@pezzo/common";

export const SuccessErrorRateChart = () => {
  const { startDate, endDate } = useTimeframeSelector();
  const controls = useProjectMetricControls();
  const { filters } = useFiltersAndSortParams();

  const { project } = useCurrentProject();
  const histogram =
    useGenericProjectMetricHistogram<MetricsTypes.SuccessErrorRateResultDataType>(
      {
        projectId: project?.id,
        histogramId: HistogramIdType.SuccessErrorRate,
        bucketSize: controls.bucketSize,
        startDate: startDate,
        endDate: endDate,
        filters,
      },
      {
        enabled: !!project && !!startDate && !!endDate,
      }
    );

  if (histogram.isLoading) {
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

  const data = histogram.histogram.data;

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
              id: "success",
              value: `Success`,
              color: colors.emerald["400"],
            },
            {
              id: "error",
              value: `Error`,
              color: colors.red["400"],
            },
          ]}
        />
        <Bar
          name="Error"
          dataKey="error"
          stackId="a"
          fill={colors.red["400"]}
        />
        <Bar
          name="Success"
          dataKey="success"
          stackId="a"
          fill={colors.emerald["400"]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
