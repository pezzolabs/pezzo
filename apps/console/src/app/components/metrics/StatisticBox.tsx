import { Statistic, Tooltip } from "antd";
import colors from "tailwindcss/colors";
import CountUp from "react-countup";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

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
  previousValue = previousValue === 0 ? 1 : previousValue;

  const percentage = Math.abs(Math.floor((diff / previousValue) * 100));
  const increaseColor = reverseColors ? colors.red[400] : colors.green[400];
  const decreaseColor = reverseColors ? colors.green[400] : colors.red[400];

  if (diff > 0) {
    return {
      valueStyle: { color: increaseColor },
      suffix: <ArrowUpOutlined />,
      percentage,
      tooltipTitle: `${percentage}% increase`,
    };
  }

  if (diff < 0) {
    return {
      valueStyle: { color: decreaseColor },
      suffix: <ArrowDownOutlined />,
      percentage,
      tooltipTitle: `${percentage}% decrease`,
    };
  }

  return { valueStyle: { color: colors.stone[300] }, suffix: null };
};

export const StatisticBox = ({
  title,
  currentValue,
  previousValue,
  prefix,
  suffix,
  precision = 0,
  reverseColors = false,
  valueStyle = { color: colors.stone[500] },
  numberPrefix,
  numberSuffix,
  numberSeparator,
  loading = false,
}: Props) => {
  const calculatedFormatter = (value: number) => (
    <CountUp
      style={{ color: colors.stone[300] }}
      end={value}
      prefix={numberPrefix}
      suffix={numberSuffix}
      duration={1}
      separator={numberSeparator}
      decimal={"."}
      decimals={precision}
    />
  );

  const {
    valueStyle: calculaedValueStyle,
    suffix: calculatedSuffix,
    tooltipTitle,
  } = getProperties(currentValue, previousValue, reverseColors);

  return (
    <Statistic
      title={title}
      value={currentValue}
      loading={loading}
      valueStyle={valueStyle || calculaedValueStyle}
      formatter={calculatedFormatter}
      suffix={
        <Tooltip title={tooltipTitle}>
          {prefix !== undefined ? prefix : calculatedSuffix}
        </Tooltip>
      }
      prefix={
        suffix && <span style={{ color: colors.stone[300] }}>{suffix}</span>
      }
      precision={precision || undefined}
    />
  );
};
