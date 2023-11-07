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
      <div className="border-b border-b-border">
        <div className="container flex h-24 items-center justify-between p-6">
          <h1>Dashboard</h1>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
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
      </div>

      <div className="container p-6">
        <div className="mb-6">
          <StatisticsSection />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-6 p-6">
            <div className="mb-4 text-muted-foreground">
              Requests/Errors (Total)
            </div>
            <div className="h-[360px]">
              <ProjectMetricControlsProvider>
                <SuccessErrorRateChart />
              </ProjectMetricControlsProvider>
            </div>
          </Card>
          <Card className="col-span-6 p-6">
            <div className="mb-4 text-muted-foreground">
              Request Duration (Average)
            </div>

            <div className="h-[360px]">
              <ProjectMetricControlsProvider>
                <ExecutionTimeChart />
              </ProjectMetricControlsProvider>
            </div>
          </Card>
        </div>
      </div>
    </TimeframeSelectorProvider>
  );
};
