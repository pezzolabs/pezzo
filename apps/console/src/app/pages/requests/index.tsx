import { Space, Table, Typography } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useGetRequestReports } from "../../graphql/hooks/queries";
import { RequestReport } from "../../../@generated/graphql/graphql";

interface DataType {
  key: React.Key;
  timestamp: string;
  status: string;
  request: string;
  response: string;
  latency: string;
  totalTokens?: number;
  cost?: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Timestamp",
    dataIndex: "timestamp",
    width: "15%",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Request",
    dataIndex: "request",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "Response",
    dataIndex: "response",

    width: "20%",
    ellipsis: true,
  },
  {
    title: "Latency",
    dataIndex: "latency",
  },
  {
    title: "Total Tokens",
    dataIndex: "totalTokens",
  },
  {
    title: "Cost",
    dataIndex: "cost",
  },
];

const onChange: TableProps<DataType>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const RequestsPage = () => {
  const { data } = useGetRequestReports();

  const tableData = data?.requestReports.map((report) => ({
    key: report.reportId,
    timestamp: report.request.timstamp,
    status: "Success",
    request: report.request.body?.messages?.[0]?.content ?? "N/A",
    response: report.response.body.result?.data?.choices?.[0].message ?? "N/A",
    latency: report.calculated.duration,
    totalTokens: report.calculated.totalTokens,
    cost: report.calculated.totalcost,
  }));

  console.log(data);

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title level={4}>Requests</Typography.Title>

        <Table columns={columns} dataSource={tableData} onChange={onChange} />
      </Space>
    </div>
  );
};
