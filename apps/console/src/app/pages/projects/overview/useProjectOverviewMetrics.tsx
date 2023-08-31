import { ProjectMetricTimeframe, ProjectMetricType } from "../../../../@generated/graphql/graphql";
import { useProjectMetric } from "../../../graphql/hooks/queries";

export const useProjectOverviewMetrics = (timeframe: ProjectMetricTimeframe) => {
  const { metric: requests } = useProjectMetric(
    ProjectMetricType.Requests,
    timeframe
  );

  const { metric: cost } = useProjectMetric(
    ProjectMetricType.Cost,
    timeframe
  );

  const { metric: avgExecutionDuration } = useProjectMetric(
    ProjectMetricType.Duration,
    timeframe
  );

  const { metric: successfulRequests } = useProjectMetric(
    ProjectMetricType.SuccessfulRequests,
    timeframe
  );

  const successRateCurrent = (successfulRequests?.currentValue / requests?.currentValue) * 100;
  const successRatePrevious = (successfulRequests?.previousValue / requests?.previousValue) * 100;

  return {
    requests,
    cost,
    avgExecutionDuration,
    successRate: {
      currentValue: successRateCurrent,
      previousValue: successRatePrevious
    }
  };
};