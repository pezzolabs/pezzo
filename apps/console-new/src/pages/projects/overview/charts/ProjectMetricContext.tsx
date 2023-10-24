import { createContext, useContext, useMemo } from "react";
import { ProjectMetricHistogramBucketSize } from "~/@generated/graphql/graphql";
import moment from "moment";
import {
  Timeframe,
  useTimeframeSelector,
} from "~/lib/providers/TimeframeSelectorContext";

interface ProjectMetricControlsContextValue {
  bucketSize: ProjectMetricHistogramBucketSize;
  formatTimestamp: (timestamp: string) => string;
}

export const ProjectMetricControlsContext =
  createContext<ProjectMetricControlsContextValue>(undefined);

export const useProjectMetricControls = () =>
  useContext(ProjectMetricControlsContext);

interface Props {
  children: React.ReactNode;
}

const timeframeToTimestampFormatterMapping = {
  [Timeframe.PastHour]: "yyyy-MM-DD HH:mm",
  [Timeframe.PastDay]: "yyyy-MM-DD HH:mm",
  [Timeframe.PastWeek]: "DD MMM",
  [Timeframe.PastMonth]: "DD MMM",
  [Timeframe.PastYear]: "MMM yyyy",
  [Timeframe.Custom]: "DD MMM",
};

const timeframeToBucketSizeMapping = {
  [Timeframe.PastHour]: ProjectMetricHistogramBucketSize.Hourly,
  [Timeframe.PastDay]: ProjectMetricHistogramBucketSize.Hourly,
  [Timeframe.PastWeek]: ProjectMetricHistogramBucketSize.Daily,
  [Timeframe.PastMonth]: ProjectMetricHistogramBucketSize.Daily,
  [Timeframe.PastYear]: ProjectMetricHistogramBucketSize.Monthly,
  [Timeframe.Custom]: ProjectMetricHistogramBucketSize.Daily,
};

export const ProjectMetricControlsProvider = ({ children }: Props) => {
  const { timeframe } = useTimeframeSelector();

  const formatTimestamp = (timestamp: string) => {
    const date = moment(timestamp);
    return date.format(timeframeToTimestampFormatterMapping[timeframe]);
  };

  const bucketSize = useMemo(
    () => timeframeToBucketSizeMapping[timeframe],
    [timeframe]
  );

  const value = {
    bucketSize,
    formatTimestamp,
  };

  return (
    <ProjectMetricControlsContext.Provider value={value}>
      {children}
    </ProjectMetricControlsContext.Provider>
  );
};
