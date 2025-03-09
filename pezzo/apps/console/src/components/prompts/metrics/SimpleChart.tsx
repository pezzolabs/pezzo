import {
  CartesianGrid,
  Tooltip,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useMetric } from "~/lib/providers/MetricContext";
import { colors } from "../../../lib/theme/colors";

interface Props {
  tooltipFormatter?: (value: string) => string;
  lineLabel?: string;
}

export const SimpleChart = ({ tooltipFormatter, lineLabel }: Props) => {
  const { data: metricData, formatTimestamp } = useMetric();

  const data = metricData.map((metric) => ({
    timestamp: formatTimestamp(metric.time),
    value: metric.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity="0.2" />
        <XAxis dataKey="timestamp" />
        <YAxis tickFormatter={tooltipFormatter} />
        <Tooltip formatter={tooltipFormatter || ((v) => v)} />
        <Line
          type="monotone"
          dataKey="value"
          name={lineLabel}
          stroke={colors.zinc["500"]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
