import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";

export enum Timeframe {
  Custom = "Custom",
  PastHour = "1H",
  PastDay = "24H",
  PastWeek = "7D",
  PastMonth = "1M",
  PastYear = "1Y",
}

interface TimeframeSelectorContextValue {
  startDate: string;
  endDate: string;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

export const TimeframeSelectorContext =
  createContext<TimeframeSelectorContextValue>({
    startDate: undefined,
    endDate: undefined,
    setStartDate: () => void 0,
    setEndDate: () => void 0,
    timeframe: Timeframe.PastDay,
    setTimeframe: () => void 0,
  });

export const useTimeframeSelector = () => useContext(TimeframeSelectorContext);

const timeframeStartdateFn = {
  [Timeframe.PastHour]: () => moment().subtract(1, "hour"),
  [Timeframe.PastDay]: () => moment().subtract(1, "day"),
  [Timeframe.PastWeek]: () => moment().subtract(6, "days"),
  [Timeframe.PastMonth]: () => moment().subtract(1, "month"),
  [Timeframe.PastYear]: () => moment().subtract(1, "year"),
};

export const TimeframeSelectorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [startDate, setStartDate] = useState<string>(undefined);
  const [endDate, setEndDate] = useState<string>(undefined);
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.PastDay);

  useEffect(() => {
    if (timeframe !== Timeframe.Custom) {
      setEndDate(moment().toISOString());
      setStartDate(timeframeStartdateFn[timeframe]().toISOString());
    }
  }, [timeframe, setStartDate, setEndDate]);

  const value = {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    timeframe,
    setTimeframe,
  };

  return (
    <TimeframeSelectorContext.Provider value={value}>
      {children}
    </TimeframeSelectorContext.Provider>
  );
};
