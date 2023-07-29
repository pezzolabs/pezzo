import { Divider, Drawer, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetRequestReports } from "../../graphql/hooks/queries";
import { useMemo, useState } from "react";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "../../lib/constants/pagination";
import { RequestDetails } from "../../components/requests/RequestDetails";
import { toDollarSign } from "../../lib/utils/currency-utils";
import { RequestFilters } from "../../components/requests/RequestFilters";
import { RequestReportItem } from "./types";
import { UnmanagedPromptWarning } from "./UnmanagedPromptWarning";

const getTableColumns = (
  data: RequestReportItem[]
): ColumnsType<RequestReportItem> => {
  const columns: ColumnsType<RequestReportItem> = [
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
      title: "Duration",
      dataIndex: "duration",
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

  const hasUnmanagedPrompts = data.some((r) => !r.promptId);

  if (hasUnmanagedPrompts) {
    columns.unshift({
      title: "",
      dataIndex: "promptId",
      render: (promptId?: string) => !promptId && <UnmanagedPromptWarning />,
      width: "40px",
      align: "center",
    });
  }
  return columns;
};

export const RequestsPage = () => {
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const { data: reports, isLoading } = useGetRequestReports({ size, page });

  const currentReport = useMemo(
    () =>
      reports?.paginatedRequests.data.find(
        (r) => r.reportId === currentReportId
      ),
    [reports?.paginatedRequests.data, currentReportId]
  );

  const { data, pagination } = reports.paginatedRequests;

  const tableData = data?.map((report) => {
    const isError = report.response.status >= 400;

    return {
      key: report.reportId,
      timestamp: report.request.timestamp,
      status: isError ? (
        <Tag color="red">{report.response.status} Error</Tag>
      ) : (
        <Tag color="green">Success</Tag>
      ),
      duration: `${(report.calculated.duration / 1000).toFixed(2)}s`,
      totalTokens: report.calculated.totalTokens ?? 0,
      cost: report.calculated.totalCost
        ? toDollarSign(report.calculated.totalCost)
        : "$0.0000",
      promptId: report.metadata?.promptId,
    };
  });

  const handleShowDetails = (record: RequestReportItem) => () =>
    setCurrentReportId(record.key);

  const columns = getTableColumns(tableData);

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title level={4}>Requests</Typography.Title>
        <Divider style={{ margin: 0 }} />
        <RequestFilters requests={tableData} />
        <Drawer
          title="Request Details"
          placement="right"
          closable={true}
          onClose={() => setCurrentReportId(null)}
          open={!!currentReport}
          width="30%"
        >
          {currentReport != null && (
            <RequestDetails
              id={currentReportId}
              request={currentReport.request}
              response={currentReport.response}
              provider={currentReport.provider}
              calculated={currentReport.calculated}
              metadata={currentReport.metadata}
              properties={currentReport.properties}
            />
          )}
        </Drawer>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={tableData}
          onRow={(record) => {
            return {
              onClick: handleShowDetails(record),
              style: { cursor: "pointer" },
            };
          }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            pageSize: pagination?.size,
            current: pagination?.page,
            total: pagination?.total,

            onChange: (page, size) => {
              setPage(page);
              setSize(size ?? DEFAULT_PAGE_SIZE);
            },
          }}
        />
      </Space>
    </div>
  );
};
