import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Table,
} from "@tanstack/react-table";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TableSkeleton from "./table-skeleton";
import { Link } from "@tanstack/react-router";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: React.ComponentType<{ table: Table<TData> }>;
  onRowClick?: (RowData: TData) => void;
  getRowHref?: (row: TData) => string;
  isLoading: boolean;
  initialColumnVisibility?: VisibilityState;
  initialSorting?: SortingState;
  pageSize?: number;
}

export function DataTable<TData, TValue>({ columns, data, toolbar: Toolbar, onRowClick, getRowHref, isLoading, initialColumnVisibility, initialSorting, pageSize = 10 }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility ?? {});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: { pageSize },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {Toolbar && <Toolbar table={table} />}
      {!isLoading && <div className="overflow-hidden rounded-md border">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const href = getRowHref ? getRowHref(row.original) : undefined;
                return (
                  <TableRow
                    key={row.id}
                    onClick={!href && onRowClick ? () => onRowClick(row.original) : undefined}
                    className={onRowClick || href ? "cursor-pointer" : undefined}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isActionCell = cell.column.id === "actions";
                      return (
                        <TableCell key={cell.id} className={href && !isActionCell ? "p-0" : undefined}>
                          {href && !isActionCell ? (
                            <Link to={href} className="flex items-center p-2">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Link>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-24">
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>}
      {isLoading && <TableSkeleton />}
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage() || isLoading}>
          Poprzednia
        </Button>
        <Button size="sm" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage() || isLoading}>
          Następna
        </Button>
      </div>
    </div>
  );
}
