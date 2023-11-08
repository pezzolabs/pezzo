import { useGetRequestReports } from "~/graphql/hooks/queries";
import { useMemo } from "react";
import { DEFAULT_PAGE_SIZE } from "~/lib/constants/pagination";
import { RequestReportItem } from "./types";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import { RequestsTable } from "./RequestsTable";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@pezzo/ui/utils";
import { ReportRequestResponse } from "~/graphql/types";
import { CheckIcon, CircleSlash, MoveRightIcon } from "lucide-react";
import { RequestItemTags } from "./RequestTags";
import { RequestDetails } from "~/components/requests";
import { Drawer } from "~/components/common/Drawer";
import { useCurrentProject } from "~/lib/hooks/useCurrentProject";
import { useQueryState } from "~/lib/hooks/useQueryState";
import { RequestFilters } from "~/components/requests/RequestFilters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
} from "@pezzo/ui";

const getTableColumns = (): ColumnDef<RequestReportItem>[] => {
  const columns: ColumnDef<RequestReportItem>[] = [
    {
      accessorKey: "timestamp",
      id: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => <div>{row.original.timestamp}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const isError = row.original.status >= 400;
        return (
          <div
            className={cn(
              "flex items-center gap-1 rounded-sm p-1 text-xs font-medium",
              {
                "text-red-500": isError,
                "text-green-500": !isError,
              }
            )}
          >
            {isError ? (
              <>
                <CircleSlash className="h-4 w-4" />
                <span>Error</span>
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                <span>Success</span>
              </>
            )}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "duration",
      id: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div>{`${(row.original.duration / 1000).toFixed(2)}s`}</div>
      ),
    },
    {
      accessorKey: "totalTokens",
      id: "totalTokens",
      header: "Total Tokens",
      cell: ({ row }) => <div>{row.original.totalTokens}</div>,
    },
    {
      accessorKey: "cost",
      id: "cost",
      header: "Cost",
      cell: ({ row }) => <div>${row.original.cost.toFixed(3)}</div>,
    },
    {
      id: "tags",
      cell: ({ row }) => <RequestItemTags request={row.original} />,
    },
    {
      id: "inspect",
      size: 50,
      cell: ({ row }) => (
        <div className="flex w-[80px] justify-end pr-2 text-muted-foreground">
          <MoveRightIcon className="h-4 w-4" />
        </div>
      ),
    },
  ];

  return columns;
};

export const RequestsPage = () => {
  usePageTitle("Requests");
  const { projectId } = useCurrentProject();
  const [inspectedRequestId, setInspectedRequestId] =
    useQueryState("inspectedRequestId");
  const [offset, setOffset] = useQueryState("offset", 0);
  const [limit, setLimit] = useQueryState("limit", DEFAULT_PAGE_SIZE);

  const { data: requests, isSuccess } = useGetRequestReports(
    {
      offset: Number(offset),
      limit: Number(limit),
    },
    {
      enabled:
        inspectedRequestId &&
        projectId &&
        offset !== undefined &&
        limit !== undefined,
    }
  );

  const columns = useMemo(() => getTableColumns(), []);

  const pagination = useMemo(
    () => requests?.paginatedRequests?.pagination,
    [requests]
  );
  const paginatedResults = useMemo(
    () => requests?.paginatedRequests?.data ?? [],
    [requests]
  );

  const data: RequestReportItem[] = useMemo(
    () =>
      paginatedResults.map((report: ReportRequestResponse) => {
        return {
          reportId: report.reportId,
          timestamp: report.request.timestamp,
          status: report.response.status,
          duration: report.calculated.duration ?? 0,
          totalTokens: report.calculated.totalTokens ?? 0,
          cost: report.calculated.totalCost ?? 0,
          isTestPrompt: (report.metadata?.isTestPrompt as boolean) || false,
          promptId: report.metadata?.promptId ?? null,
          cacheEnabled: report.cacheEnabled ?? false,
          cacheHit: report.cacheHit ?? false,
        };
      }),
    [paginatedResults]
  );

  const currentReport = useMemo(
    () =>
      requests?.paginatedRequests.data.find(
        (r) => r.reportId === inspectedRequestId
      ),
    [requests?.paginatedRequests.data, inspectedRequestId]
  );

  return (
    <>
      <Drawer
        onClose={() => setInspectedRequestId(undefined)}
        open={!!currentReport}
      >
        {currentReport != null && (
          <RequestDetails
            id={inspectedRequestId}
            request={currentReport.request}
            response={currentReport.response}
            provider={currentReport.metadata.provider}
            calculated={currentReport.calculated}
            metadata={currentReport.metadata}
            properties={currentReport.properties}
            cacheEnabled={currentReport.cacheEnabled}
            cacheHit={currentReport.cacheHit}
          />
        )}
      </Drawer>

      <div className="mb-6 border-b border-b-border">
        <div className="container flex h-24 items-center justify-between">
          <h1>Requests</h1>
        </div>
      </div>

      <div className="container flex flex-col gap-4">
        <Card className="px-4">
          <Accordion type="single" collapsible>
            <AccordionItem className="mb-0 border-0" value="filters">
              <AccordionTrigger>Filters</AccordionTrigger>
              <AccordionContent className="p-0 pb-4">
                <RequestFilters />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {isSuccess && (
          <RequestsTable
            limit={Number(limit)}
            offset={Number(offset)}
            data={data}
            columns={columns}
            totalResults={pagination.total}
            onOffsetChange={(offset) => {
              setOffset(offset);
            }}
            onLimitChange={(limit) => {
              setLimit(limit);
            }}
            onClickReport={(reportId) => {
              setInspectedRequestId(reportId);
            }}
          />
        )}
      </div>
    </>
  );
};
