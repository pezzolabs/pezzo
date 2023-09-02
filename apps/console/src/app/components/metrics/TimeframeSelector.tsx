import { Popover, Radio } from "antd";
import { useState } from "react";
import { CustomDateTooltip } from "./CustomDateTooltip";
import { CalendarIcon } from "@heroicons/react/24/solid";
import Icon from "@ant-design/icons/lib/components/Icon";
import {
  Timeframe,
  useTimeframeSelector,
} from "../../lib/providers/TimeframeSelectorContext";
import { trackEvent } from "../../lib/utils/analytics";
import { useCurrentProject } from "../../lib/hooks/useCurrentProject";

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
    <Radio.Group value={timeframe}>
      <Popover
        trigger={["click"]}
        open={customDatePopoverOpen}
        onOpenChange={handlePopoverOpen}
        placement="bottomRight"
        title="Custom Dates"
        content={
          <CustomDateTooltip
            startDate={startDate}
            endDate={endDate}
            onApply={handleCustomDateApply}
          />
        }
      >
        <Radio.Button value="Custom">
          <Icon
            style={{ marginRight: 6, fontSize: 16 }}
            viewBox="0 0 1024 1024"
          >
            <CalendarIcon style={{ fontSize: 16 }} />
          </Icon>
          Custom Dates
        </Radio.Button>
      </Popover>

      {Object.values(Timeframe)
        .filter((tf) => tf !== Timeframe.Custom)
        .map((tf) => (
          <Radio.Button
            key={tf}
            value={tf}
            onClick={() => handleSetTimeframe(tf)}
          >
            {tf}
          </Radio.Button>
        ))}
    </Radio.Group>
  );
};
