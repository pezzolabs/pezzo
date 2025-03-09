import { DeltaMetricType } from "~/@generated/graphql/graphql";
import { useProjctMetricDelta } from "src/graphql/hooks/queries";
import { useCurrentProject } from "src/lib/hooks/useCurrentProject";
import { useTimeframeSelector } from "src/lib/providers/TimeframeSelectorContext";

export const useProjectOverviewMetrics = () => {
  const { project } = useCurrentProject();
  const { startDate, endDate } = useTimeframeSelector();

  const useMetric = (metric: DeltaMetricType) =>
    useProjctMetricDelta(
      {
        projectId: project?.id,
        metric,
        startDate,
        endDate,
      },
      {
        enabled: !!project && !!startDate && !!endDate,
      }
    );

  const requests = useMetric(DeltaMetricType.TotalRequests);
  const cost = useMetric(DeltaMetricType.TotalCost);
  const avgExecutionDuration = useMetric(
    DeltaMetricType.AverageRequestDuration
  );
  const successRate = useMetric(DeltaMetricType.SuccessResponses);

  return {
    requests,
    cost,
    avgExecutionDuration,
    successRate,
  };
};
