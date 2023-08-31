import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";
import colors from "tailwindcss/colors";

const data = [
  {
    name: "Aug 10",
    requests: 12800,
    errors: 300,
  },
  {
    name: "Aug 11",
    requests: 14800,
    errors: 400,
  },
  {
    name: "Aug 12",
    requests: 9900,
    errors: 500,
  },
  {
    name: "Aug 13",
    requests: 18800,
    errors: 1200,
  },
  {
    name: "Aug 14",
    requests: 12000,
    errors: 2200,
  },
  {
    name: "Aug 15",
    requests: 13200,
    errors: 600,
  },
  {
    name: "Aug 16",
    requests: 11800,
    errors: 400,
  },
];

export const SuccessErrorRateChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral["600"]} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip cursor={{ opacity: 0.2 }} />
        <Legend
          payload={[
            {
              id: "requests",
              value: `Requests`,
              color: colors.neutral["400"],
            },
            {
              id: "errors",
              value: `Errors`,
              color: colors.red["400"],
            },
          ]}
        />
        <Bar dataKey="errors" stackId="a" fill={colors.red["400"]} />
        <Bar
          dataKey="requests"
          stackId="a"
          stroke={colors.neutral["700"]}
          fill={colors.neutral["800"]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
