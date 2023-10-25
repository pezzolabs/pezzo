import { Card } from "@pezzo/ui";
import { SuccessErrorRateChart } from "./charts/SuccessErrorRateChart";
import { ProjectMetricControlsProvider } from "./charts/ProjectMetricContext";
import { TimeframeSelector } from "~/components/metrics/TimeframeSelector";
import { TimeframeSelectorProvider } from "~/lib/providers/TimeframeSelectorContext";
import { StatisticsSection } from "./StatisticsSection";
import { ExecutionTimeChart } from "./charts/ExecutionTimeChart";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import { RequestFilters } from "~/components/requests/RequestFilters";
import { useFiltersAndSortParams } from "~/lib/hooks/useFiltersAndSortParams";
import { Popover, PopoverContent, PopoverTrigger, Button } from "@pezzo/ui";
import { FilterIcon } from "lucide-react";

export const DashboardPage = () => {
  usePageTitle("Dashboard");
  const { filters } = useFiltersAndSortParams();

  return (
    <TimeframeSelectorProvider>
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <FilterIcon className="mr-2 h-4 w-4" />
                Filters {filters.length ? `(${filters.length})` : ""}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <RequestFilters />
            </PopoverContent>
          </Popover>
          <TimeframeSelector />
        </div>
      </div>
      <div className="mb-6">
        <StatisticsSection />
      </div>
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-6 p-6">
          <div className="mb-4 text-xl font-semibold">
            Requests/Errors (Total)
          </div>
          <div className="h-[360px]">
            <ProjectMetricControlsProvider>
              <SuccessErrorRateChart />
            </ProjectMetricControlsProvider>
          </div>
        </Card>
        <Card className="col-span-6 p-6">
          <div className="mb-4 text-xl font-semibold">
            Request Duration (Average)
          </div>

          <div className="h-[360px]">
            <ProjectMetricControlsProvider>
              <ExecutionTimeChart />
            </ProjectMetricControlsProvider>
          </div>
        </Card>
      </div>
    </TimeframeSelectorProvider>
  );
};
