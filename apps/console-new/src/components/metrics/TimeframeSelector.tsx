import { CustomDateTooltip } from "./CustomDateTooltip";
import { Button, PopoverContent, PopoverTrigger, Popover } from "@pezzo/ui";
import clsx from "clsx";
import {
  Timeframe,
  useTimeframeSelector,
} from "~/lib/providers/TimeframeSelectorContext";
import { trackEvent } from "~/lib/utils/analytics";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { CalendarDaysIcon } from "lucide-react";
import { useState } from "react";

export const TimeframeSelector = () => {
  const { projectId } = useCurrentProject();
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    timeframe,
    setTimeframe,
  } = useTimeframeSelector();
  const [isCustomTimeframePopoverOpen, setIsCustomTimeframePopoverOpen] = useState(false);
  
  const handleCustomDateApply = (dates: {
    startDate: string;
    endDate: string;
  }) => {
    setTimeframe(Timeframe.Custom);
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    trackEvent("project_dashboard_custom_date_applied", { projectId });
    setIsCustomTimeframePopoverOpen(false);
  };

  const handlePopoverOpenChange = (isOpen: boolean) => {
    if (isOpen === true) {
      trackEvent("project_dashboard_custom_date_popover_opened", { projectId });
    }

    setIsCustomTimeframePopoverOpen(isOpen);
  };

  const handleSetTimeframe = (tf: Timeframe) => {
    setTimeframe(tf);
    trackEvent("project_dashboard_timeframe_changed", {
      projectId,
      timeframe: tf,
    });
  };

  return (
    <span className="isolate inline-flex rounded-md shadow-sm">
      <Popover open={isCustomTimeframePopoverOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            className={clsx(
              "first:rounded-l-m rounded-r-none border bg-white text-primary"
            )}
          >
            <CalendarDaysIcon className="mr-2 h-4 w-4" />
            Custom
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <CustomDateTooltip
            startDate={startDate}
            endDate={endDate}
            onApply={handleCustomDateApply}
          />
        </PopoverContent>
      </Popover>
      {Object.values(Timeframe)
        .filter((tf) => tf !== Timeframe.Custom)
        .map((tf) => (
          <Button
            key={tf}
            type="button"
            onClick={() => handleSetTimeframe(tf)}
            className={clsx(
              "relative -ml-px inline-flex items-center rounded-none border bg-white px-3 py-2 text-sm text-primary first:rounded-l-md last:rounded-r-md focus:z-10",
              {
                "hover:bg-secondary hover:text-secondary-foreground":
                  tf !== timeframe,
                "bg-primary text-primary-foreground": tf === timeframe,
              }
            )}
          >
            {tf}
          </Button>
        ))}
    </span>
  );
};
