import { Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useGetRequestReports } from "../../graphql/hooks/queries";
import ms from "ms";
import { useState } from "react";
import { Loading3QuartersOutlined } from "@ant-design/icons";

interface DataType {
  key: React.Key;
  timestamp: string;
  status: JSX.Element;
  request: string;
  response: JSX.Element;
  latency: string;
  totalTokens?: number;
  cost?: string;
}

const toDollars = (amount: number) => {
  return `$${amount.toFixed(4)}`;
};

const columns: ColumnsType<DataType> = [
  {
    title: "Timestamp",
    dataIndex: "timestamp",
    width: "20%",
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
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);

  const { data: reports, isLoading } = useGetRequestReports({ size, page });

  if (!reports || isLoading) return <Loading3QuartersOutlined />;

  const { data, pagination } = reports.paginatedRequests;

  const tableData = data?.map((report) => {
    const isError = report.response.status >= 400;
    const response = isError
      ? JSON.stringify(report.response.body.error ?? {})
      : report.response.body?.choices?.[0].message.content;

    return {
      key: report.reportId,
      timestamp: report.request.timestamp,
      status: isError ? (
        <Tag color="red">{report.response.status} Error</Tag>
      ) : (
        <Tag color="green">Success</Tag>
      ),
      request: report.request.body?.messages?.[0]?.content ?? "N/A",
      response: <code>{response}</code>,
      latency: ms(report.calculated.duration),
      totalTokens: report.calculated.totalTokens ?? 0,
      cost: report.calculated.totalCost
        ? toDollars(report.calculated.totalCost)
        : "$0.0000",
    };
  });

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title level={4}>Requests</Typography.Title>

        <Table
          columns={columns}
          dataSource={tableData}
          onChange={onChange}
          pagination={{
            pageSize: pagination.size,
            current: pagination.page,
            total: pagination.total,
            onChange: (page, size) => {
              setPage(page);
              setSize(size ?? 10);
            },
          }}
        />
      </Space>
    </div>
  );
};
