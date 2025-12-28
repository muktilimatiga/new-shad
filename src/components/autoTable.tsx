import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnFiltersState,
  type ColumnDef,
  type SortingState,
  type ColumnMeta,
} from "@tanstack/react-table";
import { Button } from "./ui/button";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type FilterType = "text" | "select" | "date";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filterType?: FilterType;
    filterOptions?: string[];
  }
}

interface AutoTanStackTableProps<T> {
  data: T[];
  pageSize?: number;
  pageSizeOptions?: number[];
  columnOverrides?: Partial<Record<keyof T | "actions", ColumnDef<T>>>;
  visibleColumns?: (keyof T)[];

  title?: string;
  description?: string;
  emptyMessage?: string;

  // Search:
  enableSearch?: boolean;

  // If provided: treat as external search (server-side usually)
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // If false: do NOT apply TanStack global filter (useful for server-side search)
  enableClientFiltering?: boolean;

  isLoading?: boolean;

  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string;
}

export function AutoTanStackTable<T extends object>({
  data,
  pageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  columnOverrides = {},
  visibleColumns,

  title,
  description,
  emptyMessage = "No records found.",

  enableSearch = true,
  searchValue,
  onSearchChange,
  enableClientFiltering = true,

  isLoading = false,

  onRowClick,
  getRowId,
}: AutoTanStackTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const globalFilter =
    typeof searchValue === "string" ? searchValue : internalGlobalFilter;

  const setGlobalFilter = (value: string) => {
    if (onSearchChange) onSearchChange(value);
    else setInternalGlobalFilter(value);
  };

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const allKeys = Object.keys(data[0]) as (keyof T)[];
    const keys = visibleColumns
      ? visibleColumns.filter((k) => allKeys.includes(k))
      : allKeys;

    const generated: ColumnDef<T>[] = keys.map((key) => {
      if (columnOverrides[key]) return columnOverrides[key]!;

      const sampleValue = (data[0] as any)[key];

      return {
        accessorKey: key as string,
        header: (key as string)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        enableColumnFilter: false,
        filterFn: "includesString",
        meta: detectFilterMeta(sampleValue),
        cell: ({ getValue }) => {
          const val = getValue();
          if (
            typeof val === "string" &&
            !isNaN(Date.parse(val)) &&
            val.length >= 10
          ) {
            const d = new Date(val);
            if (!isNaN(d.getTime())) return d.toLocaleString();
          }
          if (val === null || val === undefined) return "";
          return String(val);
        },
      };
    });

    if (columnOverrides["actions"]) generated.push(columnOverrides["actions"] as any);

    return generated;
  }, [data, columnOverrides, visibleColumns]);

  function detectFilterMeta(value: unknown): ColumnMeta<any, any> {
    if (typeof value === "string") {
      if (!isNaN(Date.parse(value))) return { filterType: "date" };
      return { filterType: "text" };
    }
    return {};
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: enableClientFiltering ? globalFilter : "",
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: enableClientFiltering ? setGlobalFilter : undefined,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    initialState: { pagination: { pageSize } },
  });

  const totalRows = enableClientFiltering
    ? table.getFilteredRowModel().rows.length
    : data.length;

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const showEmpty = !isLoading && (!data || data.length === 0);

  return (
    <div className="space-y-3">
      {(title || description || enableSearch) && (
        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
          {(title || description) && (
            <div className="space-y-1">
              {title && <div className="text-base font-semibold">{title}</div>}
              {description && (
                <div className="text-sm text-muted-foreground">{description}</div>
              )}
            </div>
          )}

          {enableSearch && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <input
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search…"
                  className="w-full sm:w-80 rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                />
                {(globalFilter?.length ?? 0) > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setGlobalFilter("")}>
                    Clear
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                {isLoading ? "Loading…" : `${totalRows} records`}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b">
                  {hg.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted(); // false | "asc" | "desc"

                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={[
                              "inline-flex items-center gap-2",
                              canSort ? "cursor-pointer select-none" : "",
                            ].join(" ")}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort &&
                              (sorted === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : sorted === "desc" ? (
                                <ArrowDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 opacity-60" />
                              ))}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {columns.map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-[70%] animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : showEmpty ? (
                <tr>
                  <td
                    colSpan={Math.max(columns.length, 1)}
                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, idx) => {
                  const original = row.original;
                  const key = getRowId?.(original, idx) ?? row.id;

                  return (
                    <tr
                      key={key}
                      className={[
                        "border-b transition-colors",
                        idx % 2 === 0 ? "bg-background" : "bg-muted/10",
                        onRowClick ? "cursor-pointer hover:bg-muted/30" : "",
                      ].join(" ")}
                      onClick={onRowClick ? () => onRowClick(original) : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 align-middle">
                          <div className="line-clamp-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Rows</span>
            <select
              className="rounded-md border bg-background px-2 py-1 text-xs"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <span className="ml-2">
              Page <span className="font-medium text-foreground">{pageIndex + 1}</span> of{" "}
              <span className="font-medium text-foreground">{pageCount}</span>
            </span>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
