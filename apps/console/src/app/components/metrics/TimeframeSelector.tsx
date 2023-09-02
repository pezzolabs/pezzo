import { Popover, Radio } from "antd";
import { useState } from "react";
import { CustomDateTooltip } from "./CustomDateTooltip";
import { CalendarIcon } from "@heroicons/react/24/solid";
import Icon from "@ant-design/icons/lib/components/Icon";
import {
  Timeframe,
  useTimeframeSelector,
} from "../../lib/providers/TimeframeSelectorContext";

export const TimeframeSelector = () => {
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
  };

  return (
    <Radio.Group value={timeframe}>
      <Popover
        trigger={["click"]}
        open={customDatePopoverOpen}
        onOpenChange={(isOpen) => setCustomDatePopoverOpen(isOpen)}
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
          Custom
        </Radio.Button>
      </Popover>

      {Object.values(Timeframe)
        .filter((tf) => tf !== Timeframe.Custom)
        .map((tf) => (
          <Radio.Button key={tf} value={tf} onClick={() => setTimeframe(tf)}>
            {tf}
          </Radio.Button>
        ))}
    </Radio.Group>
  );
};
