import { DatePicker } from "antd";
import { Button } from "../../../../../libs/ui/src";
import dayjs from "dayjs";
import { useState } from "react";

interface Props {
  startDate: string;
  endDate: string;
  onApply: (dates: { startDate: string; endDate: string }) => void;
}

export const CustomDateTooltip = ({ startDate, endDate, onApply }: Props) => {
  const [tempStartDate, setTempStartDate] = useState<string>(startDate);
  const [tempEndDate, setTempEndDate] = useState<string>(endDate);

  const handleApply = () => {
    onApply({ startDate: tempStartDate, endDate: tempEndDate });
  };

  return (
    <div>
      <div className="mb-2">
        <p className="text-sm font-semibold">Start date</p>
        <DatePicker
          value={dayjs(tempStartDate)}
          onChange={(v) => setTempStartDate(v?.toISOString())}
          placeholder="Start date"
          showTime={{ format: "HH:mm" }}
        />
      </div>
      <div className="mb-2">
        <p className="text-sm font-semibold">End date</p>
        <DatePicker
          value={dayjs(tempEndDate)}
          onChange={(v) => setTempEndDate(v?.toString())}
          placeholder="End date"
          showTime={{ format: "HH:mm" }}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleApply} size="sm">
          Apply
        </Button>
      </div>
    </div>
  );
};
