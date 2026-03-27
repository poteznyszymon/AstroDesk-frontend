import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { priorityConfig, statusConfig, type Ticket, type TicketPriority, type TicketStatus } from "@/types/tickets";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Monitor } from "lucide-react";
import TicketEditMenu from "./ticket-edit-menu";
import type { Inventory } from "@/types/inventory";

export const getColumns = (adminView: boolean, inventory?: Inventory[]): ColumnDef<Ticket>[] => {
  const columns: ColumnDef<Ticket>[] = [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    //   cell: ({ row }) => <div className="font-mono text-sm ml-2">{row.getValue("id")}</div>,
    // },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tytuł
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-3">
          <div className="font-medium">{row.getValue("title")}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[300px]">{row.original.description}</div>
        </div>
      ),
      filterFn: (row, _, filterValue: string) => {
        if (!filterValue) return true;
        const q = filterValue.toLowerCase();
        return (
          (row.getValue('title') as string).toLowerCase().includes(q) ||
          row.original.description.toLowerCase().includes(q)
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: "equals",
      cell: ({ row }) => {
        const status = row.getValue("status") as TicketStatus;
        const config = statusConfig[status];
        const StatusIcon = config.icon;
        return (
          <Badge variant={config.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priorytet",
      filterFn: "equals",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as TicketPriority;
        const config = priorityConfig[priority];
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>{config.label}</span>;
      },
    },
    {
      accessorKey: "assignee",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Przypisany
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("assignee")}</div>,
      filterFn: 'equals',
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Zgloszone przez
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("createdBy")}</div>,
    },
    {
      accessorKey: "linkedInventoryId",
      header: "Urządzenie",
      filterFn: (row, columnId, filterValue: boolean) => {
        if (!filterValue) return true;
        return row.getValue(columnId) !== null;
      },
      cell: ({ row }) => {
        const id = row.getValue("linkedInventoryId") as number | null;
        if (!id) return <span className="text-muted-foreground text-sm">—</span>;
        const device = inventory?.find((i) => i.id === id);
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Monitor className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>{device?.name ?? `#${id}`}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
          Data utworzenia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
      filterFn: (row, columnId, filterValue: { from?: Date; to?: Date }) => {
        if (!filterValue?.from && !filterValue?.to) return true;
        const date = new Date(row.getValue(columnId) as string);
        if (filterValue.from && date < filterValue.from) return false;
        if (filterValue.to) {
          const to = new Date(filterValue.to);
          to.setHours(23, 59, 59, 999);
          if (date > to) return false;
        }
        return true;
      },
    },
  ];

  columns.push({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <TicketEditMenu ticket={row.original} adminView={adminView} />
      </div>
    ),
  });

  return columns;
};
