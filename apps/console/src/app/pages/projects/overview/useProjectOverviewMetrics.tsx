import { ProjectMetricType } from "../../../../@generated/graphql/graphql";
import { useProjectMetric } from "../../../graphql/hooks/queries";
import { useCurrentProject } from "../../../lib/hooks/useCurrentProject";
import { useFiltersAndSortParams } from "../../../lib/hooks/useFiltersAndSortParams";
import { useTimeframeSelector } from "../../../lib/providers/TimeframeSelectorContext";

export const useProjectOverviewMetrics = () => {
  const { project } = useCurrentProject();
  const { startDate, endDate } = useTimeframeSelector();
  const { filters } = useFiltersAndSortParams();

  const useMetric = (metric: ProjectMetricType) =>
    useProjectMetric(
      {
        projectId: project?.id,
        metric,
        startDate,
        endDate,
        filters,
      },
      {
        enabled: !!project && !!startDate && !!endDate,
      }
    );

  const requests = useMetric(ProjectMetricType.Requests);
  const cost = useMetric(ProjectMetricType.Cost);
  const avgExecutionDuration = useMetric(ProjectMetricType.Duration);
  const successfulRequests = useMetric(ProjectMetricType.SuccessfulRequests);

  const successRateCurrent =
    (successfulRequests?.data?.currentValue / requests?.data?.currentValue) *
    100;
  const successRatePrevious =
    (successfulRequests?.data?.previousValue / requests?.data?.previousValue) *
    100;

  const successRate = {
    isLoading: successfulRequests.isLoading || requests.isLoading,
    data: {
      currentValue: successRateCurrent,
      previousValue: successRatePrevious,
    },
  };

  return {
    requests,
    cost,
    avgExecutionDuration,
    successRate,
  };
};
