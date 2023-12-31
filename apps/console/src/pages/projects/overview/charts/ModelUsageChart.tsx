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
import {
  useGenericProjectMetricHistogram,
  useProjectModelUsageHistogram,
} from "~/graphql/hooks/queries";
import {
  HistogramIdType,
  ModelUsageHistogramBucket,
} from "~/@generated/graphql/graphql";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { useTimeframeSelector } from "~/lib/providers/TimeframeSelectorContext";
import { useProjectMetricControls } from "./ProjectMetricContext";
import { TooltipWithTimestamp } from "./TooltipWithTimestamp";
import { useFiltersAndSortParams } from "~/lib/hooks/useFiltersAndSortParams";
import { Loader2Icon } from "lucide-react";
import { modelAuthorDetails } from "~/pages/requests/model-display-details";
import { ModelDetails } from "~/pages/requests/ModelDetails";
import { MetricsTypes } from "@pezzo/common";

interface ModelBar {
  name: string;
  color: string;
}

interface ModelLegendItem {
  id: string;
  value: string;
  color: string;
  LegendItem: React.ReactNode;
}

const histogramToChartData = (
  buckets: MetricsTypes.ModelUsageResultDataType
): {
  data: any[];
  bars: Map<string, ModelBar>;
  legendItems: Map<string, ModelLegendItem>;
} => {
  const bars = new Map<string, ModelBar>();
  const legendItems = new Map<string, ModelLegendItem>();

  const timestamps = {};

  const data = buckets.map((bucket) => {
    const { model, modelAuthor, value, timestamp } = bucket;

    if (!timestamps[timestamp]) {
      timestamps[timestamp] = {};
    }

    if (!timestamps[timestamp][model]) {
      timestamps[timestamp][model] = 0;
      const { color } = modelAuthorDetails[modelAuthor];

      bars.set(model, {
        name: model,
        color,
      });

      legendItems.set(model, {
        id: model,
        value: model,
        color,
        LegendItem: <ModelDetails model={model} modelAuthor={modelAuthor} />,
      });
    }

    timestamps[timestamp][model] += value;
  });

  return { data, bars, legendItems };
};

export const ModelUsageChart = () => {
  const { startDate, endDate } = useTimeframeSelector();
  const controls = useProjectMetricControls();
  const { filters } = useFiltersAndSortParams();

  const { project } = useCurrentProject();
  const histogram =
    useGenericProjectMetricHistogram<MetricsTypes.ModelUsageResultDataType>(
      {
        projectId: project?.id,
        histogramId: HistogramIdType.ModelUsage,
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

  const { data, bars, legendItems } = histogramToChartData(
    histogram.histogram.data
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={[]}
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
        <YAxis tickFormatter={(v) => `$${Number(v).toFixed(5)}`} />
        <Tooltip
          cursor={{ opacity: 0.2 }}
          content={TooltipWithTimestamp}
          formatter={(value, key) => {
            return key === "Timestamp" ? value : `$${Number(value).toFixed(5)}`;
          }}
        />
        {/* <Legend
          payload={Array.from(legendItems.values())}
        /> */}
        {/* 
        <Legend
          content={
            <div className="flex flex-wrap items-center justify-center gap-x-4 mt-4">
              {Array.from(legendItems.values()).sort((a, b) => a.id.localeCompare(b.id)).map(
                ({ LegendItem, color }) => <div style={{ color }}>{LegendItem}</div>
              )}
            </div>
          }
        /> */}

        {/* {Array.from(bars).sort().map(([key, bar]) => (
          <Bar key={key} dataKey={key} stackId={"a"} fill={bar.color} />
        ))} */}
      </BarChart>
    </ResponsiveContainer>
  );
};
