import { usePromptVersions } from "~/lib/hooks/usePromptVersions";
import { useCurrentPrompt } from "~/lib/providers/CurrentPromptContext";
import { trackEvent } from "~/lib/utils/analytics";
import React, { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@pezzo/ui";
import { InlineCodeSnippet } from "~/components/common/InlineCodeSnippet";

type PromptVersion = ReturnType<typeof usePromptVersions>["promptVersions"][0];

const getTableColumns = (): ColumnDef<PromptVersion>[] => {
  return [
    {
      accessorKey: "sha",
      id: "sha",
      header: "SHA",
      cell: ({ row }) => (
        <div>
          {/*<InlineCodeSnippet>{row.original.sha.slice(0, 7)}</InlineCodeSnippet>*/}
          {/*use full sha instead of slice because api need full sha get specific version*/}
          <InlineCodeSnippet>{row.original.sha}</InlineCodeSnippet>
        </div>
      ),
    },
    {
      accessorKey: "author",
      id: "author",
      header: "Author",
      cell: ({ row }) => <div>{row.original.createdBy.email}</div>,
    },
    {
      accessorKey: "message",
      id: "message",
      header: "Message",
      cell: ({ row }) => {
        const msg = row.original.message;

        if (!msg) {
          return <div className="italic text-muted-foreground">No message</div>;
        } else {
          return <div>{row.original.message}</div>;
        }
      },
    },
    {
      accessorKey: "time",
      id: "time",
      header: "Time",
      cell: ({ row }) => (
        <div>{new Date(row.original.createdAt).toLocaleString()}</div>
      ),
    },
  ];
};

export const PromptVersionsView = () => {
  const { prompt } = useCurrentPrompt();
  const { promptVersions } = usePromptVersions(prompt.id);

  React.useEffect(() => {
    trackEvent("prompt_versions_viewed");
  }, [prompt.id]);

  const data = useMemo(() => promptVersions, [promptVersions]);
  const columns: ColumnDef<PromptVersion>[] = useMemo(
    () => getTableColumns(),
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  return (
    promptVersions && (
      <div className="container mt-6">
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
      </div>
    )
  );
};
