import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { priorityConfig, statusConfig, type Ticket, type TicketPriority, type TicketStatus } from "@/types/tickets";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import TicketEditMenu from "./ticket-edit-menu";

export const getColumns = (): ColumnDef<Ticket>[] => {
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
    },
    {
      accessorKey: "status",
      header: "Status",
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
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
          Data utworzenia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
    },
  ];

  columns.push({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ticket = row.original;
      return <TicketEditMenu ticket={ticket} />;
    },
  });

  return columns;
};
