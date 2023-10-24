import { Popover, Radio } from "antd";
import { useState } from "react";
import { CustomDateTooltip } from "./CustomDateTooltip";
import { CalendarIcon } from "@heroicons/react/24/solid";
import Icon from "@ant-design/icons/lib/components/Icon";
import { Button } from "@pezzo/ui";
import clsx from "clsx";
import {
  Timeframe,
  useTimeframeSelector,
} from "~/lib/providers/TimeframeSelectorContext";
import { trackEvent } from "~/lib/utils/analytics";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";

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
  const [customDatePopoverOpen, setCustomDatePopoverOpen] =
    useState<boolean>(false);

  const handleCustomDateApply = (dates: {
    startDate: string;
    endDate: string;
  }) => {
    setTimeframe(Timeframe.Custom);
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    setCustomDatePopoverOpen(false);
    trackEvent("project_dashboard_custom_date_applied", { projectId });
  };

  const handlePopoverOpen = (isOpen) => {
    setCustomDatePopoverOpen(isOpen);

    if (isOpen === true) {
      trackEvent("project_dashboard_custom_date_popover_opened", { projectId });
    }
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
      {Object.values(Timeframe)
        .filter((tf) => tf !== Timeframe.Custom)
        .map((tf) => (
          <Button
            key={tf}
            type="button"
            onClick={() => handleSetTimeframe(tf)}
            className={clsx(
              "relative -ml-px inline-flex items-center rounded-none border bg-white px-3 py-2 text-sm text-gray-900 first:rounded-l-md last:rounded-r-md hover:bg-black hover:text-white focus:z-10",
              {
                "bg-black text-white": tf === timeframe,
                // "bg-slate-200 border-slate-300": tf === timeframe,
              }
            )}
          >
            {tf}
          </Button>
        ))}
    </span>
  );

  // return (
  //   <Radio.Group value={timeframe}>
  //     <Popover
  //       trigger={["click"]}
  //       open={customDatePopoverOpen}
  //       onOpenChange={handlePopoverOpen}
  //       placement="bottomRight"
  //       title="Custom Dates"
  //       content={
  //         <CustomDateTooltip
  //           startDate={startDate}
  //           endDate={endDate}
  //           onApply={handleCustomDateApply}
  //         />
  //       }
  //     >
  //       <Radio.Button value="Custom">
  //         <Icon
  //           style={{ marginRight: 6, fontSize: 16 }}
  //           viewBox="0 0 1024 1024"
  //         >
  //           <CalendarIcon style={{ fontSize: 16 }} />
  //         </Icon>
  //         Custom Dates
  //       </Radio.Button>
  //     </Popover>

  //     {Object.values(Timeframe)
  //       .filter((tf) => tf !== Timeframe.Custom)
  //       .map((tf) => (
  //         <Radio.Button
  //           key={tf}
  //           value={tf}
  //           onClick={() => handleSetTimeframe(tf)}
  //         >
  //           {tf}
  //         </Radio.Button>
  //       ))}
  //   </Radio.Group>
  // );
};
