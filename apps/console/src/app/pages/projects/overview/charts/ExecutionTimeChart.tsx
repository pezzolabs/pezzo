import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import colors from "tailwindcss/colors";

const data = [
  {
    name: "Aug 10",
    duration: 7,
  },
  {
    name: "Aug 11",
    duration: 6,
  },
  {
    name: "Aug 12",
    duration: 12,
  },
  {
    name: "Aug 13",
    duration: 10,
  },
  {
    name: "Aug 14",
    duration: 7,
  },
  {
    name: "Aug 15",
    duration: 11,
  },
  {
    name: "Aug 16",
    duration: 8,
  },
];

export const ExecutionTimeChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral["600"]} />
        <XAxis dataKey="name" />
        <YAxis
          domain={["dataMin", "dataMax"]}
          tickFormatter={(value) => `${value}s`}
        />
        <Tooltip />
        <Legend
          payload={[
            {
              id: "duration",
              value: `Duration (seconds)`,
              color: colors.neutral["400"],
            },
          ]}
        />
        <Line
          type="monotone"
          dataKey="error"
          stroke={colors.red["400"]}
          activeDot={{ r: 8 }}
        />
        <ReferenceLine
          y={11}
          stroke={colors.red["400"]}
          strokeDasharray="3 3"
        />
        <Line
          type="monotone"
          dataKey="duration"
          stroke={colors.neutral["400"]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
