import { Button, DatePicker, Space } from "antd";
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
    <Space direction="vertical">
      <Space direction="horizontal">
        <DatePicker
          value={dayjs(tempStartDate)}
          onChange={(v) => setTempStartDate(v?.toISOString())}
          placeholder="Start date"
          showTime={{ format: "HH:mm" }}
        />
        <DatePicker
          value={dayjs(tempEndDate)}
          onChange={(v) => setTempEndDate(v?.toString())}
          placeholder="End date"
          showTime={{ format: "HH:mm" }}
        />
      </Space>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleApply} type="primary" size="small">
          Apply
        </Button>
      </div>
    </Space>
  );
};
