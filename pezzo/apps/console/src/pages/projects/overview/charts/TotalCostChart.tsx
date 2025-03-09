import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import colors from "tailwindcss/colors";

const data = [
  {
    name: "7-18",
    openai: 94,
    anthropic: 17,
    azureai: 35,
  },
  {
    name: "7-19",
    openai: 91,
    anthropic: 20,
    azureai: 37,
  },
  {
    name: "7-20",
    openai: 95,
    anthropic: 19,
    azureai: 35,
  },
  {
    name: "7-21",
    openai: 98,
    anthropic: 17,
    azureai: 36,
  },
  {
    name: "7-22",
    openai: 99,
    anthropic: 19,
    azureai: 38,
  },
  {
    name: "7-23",
    openai: 98,
    anthropic: 18,
    azureai: 20,
  },
  {
    name: "7-24",
    openai: 93,
    anthropic: 17,
    azureai: 38,
  },
  {
    name: "7-25",
    openai: 91,
    anthropic: 18,
    azureai: 36,
  },
  {
    name: "7-26",
    openai: 92,
    anthropic: 18,
    azureai: 39,
  },
  {
    name: "7-27",
    openai: 95,
    anthropic: 19,
    azureai: 37,
  },
  {
    name: "7-28",
    openai: 95,
    anthropic: 19,
    azureai: 40,
  },
  {
    name: "7-29",
    openai: 89,
    anthropic: 18,
    azureai: 36,
  },
  {
    name: "7-30",
    openai: 88,
    anthropic: 18,
    azureai: 35,
  },
  {
    name: "7-31",
    openai: 94,
    anthropic: 18,
    azureai: 38,
  },
  {
    name: "8-1",
    openai: 89,
    anthropic: 19,
    azureai: 36,
  },
  {
    name: "8-2",
    openai: 96,
    anthropic: 20,
    azureai: 38,
  },
  {
    name: "8-3",
    openai: 99,
    anthropic: 19,
    azureai: 37,
  },
  {
    name: "8-4",
    openai: 98,
    anthropic: 18,
    azureai: 35,
  },
  {
    name: "8-5",
    openai: 89,
    anthropic: 18,
    azureai: 35,
  },
  {
    name: "8-6",
    openai: 90,
    anthropic: 19,
    azureai: 37,
  },
  {
    name: "8-7",
    openai: 140,
    anthropic: 17,
    azureai: 36,
  },
  {
    name: "8-8",
    openai: 87,
    anthropic: 19,
    azureai: 35,
  },
  {
    name: "8-9",
    openai: 96,
    anthropic: 19,
    azureai: 34,
  },
  {
    name: "8-10",
    openai: 88,
    anthropic: 20,
    azureai: 37,
  },
  {
    name: "8-11",
    openai: 100,
    anthropic: 20,
    azureai: 34,
  },
  {
    name: "8-12",
    openai: 85,
    anthropic: 17,
    azureai: 39,
  },
  {
    name: "8-13",
    openai: 94,
    anthropic: 18,
    azureai: 36,
  },
  {
    name: "8-14",
    openai: 95,
    anthropic: 17,
    azureai: 35,
  },
  {
    name: "8-15",
    openai: 90,
    anthropic: 17,
    azureai: 37,
  },
  {
    name: "8-16",
    openai: 89,
    anthropic: 18,
    azureai: 37,
  },
];

export const TotalCostChart = () => {
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
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip cursor={{ opacity: 0.2 }} />
        <Legend
          payload={[
            {
              id: "openai",
              value: `OpenAI`,
              color: colors.emerald["500"],
            },
            {
              id: "anthropic",
              value: `Anthropic`,
              color: colors.neutral["500"],
            },
            {
              id: "azureai",
              value: `Azure AI`,
              color: colors.blue["400"],
            },
          ]}
        />
        <Bar dataKey="openai" stackId="a" fill={colors.emerald["500"]} />
        <Bar
          dataKey="anthropic"
          stackId="a"
          stroke={colors.neutral["700"]}
          fill={colors.neutral["800"]}
        />
        <Bar dataKey="azureai" stackId="a" fill={colors.blue["400"]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
