import {
  Aggregation,
  PromptExecutionMetricField,
} from "~/@generated/graphql/graphql";
import { MetricProvider } from "~/lib/providers/MetricContext";
import { SimpleChart } from "../metrics/SimpleChart";
import React from "react";
import { trackEvent } from "~/lib/utils/analytics";

export const PromptMetricsView = () => {
  React.useEffect(() => {
    trackEvent("prompt_metrics_viewed");
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-6">
        <MetricProvider
          aggregation={Aggregation.Sum}
          title="Total Cost"
          field={PromptExecutionMetricField.TotalCost}
        >
          <SimpleChart
            lineLabel="Cost"
            tooltipFormatter={(v) => `$${Number(v).toFixed(3)}`}
          />
        </MetricProvider>
      </div>
      <div className="col-span-6">
        <MetricProvider
          aggregation={Aggregation.Sum}
          title="Total Tokens"
          field={PromptExecutionMetricField.TotalTokens}
        >
          <SimpleChart lineLabel="Tokens" />
        </MetricProvider>
      </div>
      <div className="col-span-6">
        <MetricProvider
          aggregation={Aggregation.Count}
          title="Total Executions"
        >
          <SimpleChart lineLabel="Executions" />
        </MetricProvider>
      </div>
      <div className="col-span-6">
        <MetricProvider
          aggregation={Aggregation.Avg}
          title="Avg. Execution Duration"
          field={PromptExecutionMetricField.Duration}
        >
          <SimpleChart
            lineLabel="Duration"
            tooltipFormatter={(v) => `${(Number(v) / 1000).toFixed(2)}s`}
          />
        </MetricProvider>
      </div>
    </div>
  );
};
