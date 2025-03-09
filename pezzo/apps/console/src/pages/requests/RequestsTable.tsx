import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "pezzo/libs/ui/src";
import { RequestReportItem } from "./types";
import { Pagination } from "src/components/common/Pagination";
import { useEffect } from "react";
import { PAGE_SIZE_OPTIONS } from "src/lib/constants/pagination";

interface DataTableProps<TData, TValue> {
  data: RequestReportItem[];
  columns: ColumnDef<RequestReportItem>[];
  totalResults: number;
  limit: number;
  offset: number;
  onOffsetChange: (offset: number) => void;
  onLimitChange: (limit: number) => void;
  onClickReport: (reportId: string) => void;
}

export function RequestsTable<TData, TValue>({
  columns,
  data,
  totalResults,
  limit,
  offset,
  onOffsetChange,
  onLimitChange,
  onClickReport,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  useEffect(() => {
    table.setPageCount(Math.ceil(totalResults / limit));
    table.setPageSize(limit);
  }, [table, limit, totalResults]);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width:
                          header.getSize() === Number.MAX_SAFE_INTEGER
                            ? "auto"
                            : header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  onClick={() => onClickReport(row.original.reportId)}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width:
                          cell.column.getSize() === Number.MAX_SAFE_INTEGER
                            ? "auto"
                            : cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-between">
        <Pagination
          offset={offset}
          limit={limit}
          totalResults={totalResults}
          onChange={(page, limit) => {
            const offset = (page - 1) * limit;
            onOffsetChange(offset);
          }}
        />
        <div className="flex items-center gap-2">
          <span>Results per page</span>
          <Select
            value={`${limit}`}
            onValueChange={(value) => onLimitChange(parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
