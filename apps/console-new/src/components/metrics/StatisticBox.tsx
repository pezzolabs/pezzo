import CountUp from "react-countup";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pezzo/ui";

interface Props {
  title: string;
  currentValue: number;
  previousValue: number;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  precision?: number;
  reverseColors?: boolean;
  valueStyle?: React.CSSProperties;
  numberPrefix?: string;
  numberSuffix?: string;
  numberSeparator?: string;
  loading: boolean;
}

const getProperties = (
  currentValue: number,
  previousValue: number,
  reverseColors: boolean
) => {
  const diff = currentValue - previousValue;
  // Handle case where previousValue is 0
  const calculatedPreviousValue = previousValue === 0 ? 1 : previousValue;

  const percentage = Math.abs((diff / calculatedPreviousValue) * 100);
  const percentageToRender =
    percentage < 1 ? percentage.toFixed(3) : percentage;

  const isIncrease = diff > 0;
  const isDecrease = diff < 0;

  const className = clsx("h-7 w-7", {
    "text-red-500": isDecrease || (reverseColors && isIncrease),
    "text-green-500": isIncrease || (reverseColors && isDecrease),
    "text-stone-300": !isIncrease && !isDecrease,
  });

  if (isIncrease) {
    return {
      suffix: <ArrowUpIcon className={className} />,
      percentage,
      tooltipTitle: `${percentageToRender}% increase (previously ${previousValue})`,
    };
  }

  if (isDecrease) {
    return {
      suffix: <ArrowDownIcon className={className} />,
      percentage,
      tooltipTitle: `${percentageToRender}% decrease (previously ${previousValue})`,
    };
  }

  return { suffix: null, percentage: 0, tooltipTitle: "" };
};

export const StatisticBox = ({
  title,
  currentValue,
  previousValue,
  prefix,
  precision = 0,
  reverseColors = false,
  numberPrefix,
  numberSuffix,
  numberSeparator,
  loading = false,
}: Props) => {
  const calculatedFormatter = (value: number) => (
    <CountUp
      end={value}
      prefix={numberPrefix}
      suffix={numberSuffix}
      duration={1}
      separator={numberSeparator}
      decimal={"."}
      decimals={precision}
    />
  );

  const { suffix: calculatedSuffix, tooltipTitle } = getProperties(
    currentValue,
    previousValue,
    reverseColors
  );

  return (
    <div>
      <div className="mb-2 text-neutral-600">{title}</div>
      <div className="flex text-2xl font-medium">
        {calculatedFormatter(currentValue)}
        {calculatedSuffix && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {prefix !== undefined ? prefix : calculatedSuffix}
              </TooltipTrigger>
              <TooltipContent>{tooltipTitle}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
