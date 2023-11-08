import { createContext, useContext, useState } from "react";
import { useCurrentPrompt } from "./CurrentPromptContext";
import {
  Aggregation,
  GetMetricsQuery,
  Granularity,
  PromptExecutionMetricField,
} from "~/@generated/graphql/graphql";
import { useGetPromptExecutionMetric } from "../hooks/useGetPromptExecutionMetric";
import { format } from "date-fns";
import ms from "ms";
import { trackEvent } from "../utils/analytics";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pezzo/ui";
import { cn } from "@pezzo/ui/utils";

interface MetricContextValue {
  data: GetMetricsQuery["metrics"];
  formatTimestamp: (timestamp: number) => string;
}

export const MetricContext = createContext<MetricContextValue>({
  data: undefined,
  formatTimestamp: () => void 0,
});

export const useMetric = () => useContext(MetricContext);

const calculateStartDate = (start: string): Date => {
  const startDate = new Date();
  const subtractMs = ms(start);
  startDate.setMilliseconds(startDate.getMilliseconds() + subtractMs);
  return startDate;
};

interface Props {
  children: React.ReactNode;
  title: string;
  field?: PromptExecutionMetricField;
  aggregation: Aggregation;
}

export const MetricProvider = ({
  children,
  title,
  field = null,
  aggregation,
}: Props) => {
  const { prompt } = useCurrentPrompt();
  const [granularity, setGranularity] = useState<Granularity>(Granularity.Day);
  const [start, setStart] = useState<string>("-7d");
  const startDate = calculateStartDate(start);

  const { data: metricsData, isLoading } = useGetPromptExecutionMetric(
    [prompt.id, "metrics", title, granularity, start],
    {
      promptId: prompt.id,
      field,
      aggregation,
      start: startDate.toISOString(),
      stop: new Date().toISOString(),
      granularity,
    }
  );

  if (!startDate || isLoading || !metricsData) {
    return null;
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    switch (granularity) {
      case Granularity.Hour:
        return format(date, "yyyy-MM-dd HH:mm");
      case Granularity.Day:
        return format(date, "yyyy-MM-dd");
      case Granularity.Week:
        return format(date, "yyyy-MM-dd");
      case Granularity.Month:
        return format(date, "MMM yyyy");
    }
  };

  const onGranularityChange = (granularity: Granularity) => {
    setGranularity(granularity);
    trackEvent("prompt_metric_view_changed", {
      type: "granularity",
      granularity,
    });
  };

  const onTimeRangeChange = (start: string) => {
    setStart(start);
    trackEvent("prompt_metric_view_changed", { type: "time_range", start });
  };

  const granularities = [
    {
      label: "Hour",
      value: Granularity.Hour,
    },
    {
      label: "Day",
      value: Granularity.Day,
    },
    {
      label: "Week",
      value: Granularity.Week,
    },
    {
      label: "Month",
      value: Granularity.Month,
    },
  ];

  return (
    <MetricContext.Provider
      value={{
        data: metricsData.metrics,
        formatTimestamp,
      }}
    >
      <Card>
        <CardHeader>
          <h4 className="font-semibold">{title}</h4>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Select defaultValue={start} onValueChange={onTimeRangeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1h">Past Hour</SelectItem>
                  <SelectItem value="-1d">Past Day</SelectItem>
                  <SelectItem value="-7d">Past 7 days</SelectItem>
                  <SelectItem value="-30d">Past 30 days</SelectItem>
                  <SelectItem value="-1y">Past year</SelectItem>{" "}
                </SelectContent>
              </Select>
            </div>
            <div>
              {granularities.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant="outline"
                  onClick={() => onGranularityChange(item.value)}
                  className={cn(
                    "relative -ml-px inline-flex items-center rounded-none border px-3 py-2 text-sm first:rounded-l-md last:rounded-r-md focus:z-10",
                    {
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground":
                        granularity === item.value,
                    }
                  )}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            {metricsData.metrics.length === 0 ? (
              <div className="flex items-center justify-center italic text-muted-foreground">
                No data available. Try again later.
              </div>
            ) : (
              <div>{children}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </MetricContext.Provider>
  );
};
