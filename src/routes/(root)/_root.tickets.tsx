import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Clock, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/(root)/_root/tickets")({
  component: RouteComponent,
});

type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "critical";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

const demoTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "Błąd logowania do systemu",
    description: "Użytkownik nie może się zalogować do panelu administracyjnego.",
    status: "open",
    priority: "high",
    assignee: "Jan Kowalski",
    createdAt: "2025-12-01",
    updatedAt: "2025-12-01",
  },
  {
    id: "TKT-002",
    title: "Awaria drukarki w magazynie",
    description: "Drukarka Epson nie drukuje etykiet.",
    status: "in-progress",
    priority: "medium",
    assignee: "Anna Nowak",
    createdAt: "2025-11-30",
    updatedAt: "2025-12-01",
  },
  {
    id: "TKT-003",
    title: "Problem z połączeniem Wi-Fi",
    description: "Słaby sygnał Wi-Fi na drugim piętrze.",
    status: "open",
    priority: "critical",
    assignee: "Piotr Wiśniewski",
    createdAt: "2025-11-29",
    updatedAt: "2025-12-01",
  },
  {
    id: "TKT-004",
    title: "Aktualizacja systemu operacyjnego",
    description: "Wymagana aktualizacja Windows na komputerach w dziale HR.",
    status: "resolved",
    priority: "low",
    assignee: "Jan Kowalski",
    createdAt: "2025-11-28",
    updatedAt: "2025-11-30",
  },
  {
    id: "TKT-005",
    title: "Brak dostępu do dysku sieciowego",
    description: "Pracownicy nie widzą udziału sieciowego na serwerze NAS.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdAt: "2025-11-25",
    updatedAt: "2025-11-27",
  },
  {
    id: "TKT-006",
    title: "Zgłoszenie nowego pracownika",
    description: "Potrzebne konto i dostęp do systemów dla nowego pracownika.",
    status: "open",
    priority: "medium",
    assignee: "Katarzyna Zielińska",
    createdAt: "2025-12-02",
    updatedAt: "2025-12-02",
  },
  {
    id: "TKT-007",
    title: "Problem z aplikacją mobilną",
    description: "Aplikacja mobilna nie synchronizuje danych.",
    status: "in-progress",
    priority: "high",
    assignee: "Marek Dąbrowski",
    createdAt: "2025-12-01",
    updatedAt: "2025-12-02",
  },
  {
    id: "TKT-008",
    title: "Awaria serwera poczty",
    description: "Brak możliwości wysyłania maili przez pracowników.",
    status: "open",
    priority: "critical",
    assignee: "Piotr Wiśniewski",
    createdAt: "2025-12-01",
    updatedAt: "2025-12-02",
  },
  {
    id: "TKT-009",
    title: "Prośba o dostęp do VPN",
    description: "Pracownik zdalny potrzebuje dostępu do VPN.",
    status: "resolved",
    priority: "low",
    assignee: "Jan Kowalski",
    createdAt: "2025-11-27",
    updatedAt: "2025-11-28",
  },
  {
    id: "TKT-010",
    title: "Problem z wydrukiem faktur",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
  },
  {
    id: "TKT-01",
    title: "Problem z wydrukiem faktur",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
  },
  {
    id: "TKT-012",
    title: "Problem z wydrukiem faktur",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
  },
  {
    id: "TKT-012",
    title: "Problem z wydrukiem faktur",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
  },
  {
    id: "TKT-012",
    title: "Problem z wydrukiem faktur",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
  },
  {
    id: "TKT-012",
    title: "Problem z wydrukiem faktur",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
  },
];

const statusConfig: Record<
  TicketStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
  }
> = {
  open: { label: "Otwarty", variant: "destructive", icon: AlertCircle },
  "in-progress": { label: "W trakcie", variant: "default", icon: Clock },
  resolved: { label: "Rozwiązany", variant: "secondary", icon: CheckCircle2 },
  closed: { label: "Zamknięty", variant: "outline", icon: Circle },
};

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: "Niski", className: "bg-green-100 text-green-800" },
  medium: { label: "Średni", className: "bg-yellow-100 text-yellow-800" },
  high: { label: "Wysoki", className: "bg-orange-100 text-orange-800" },
  critical: { label: "Krytyczny", className: "bg-red-100 text-red-800" },
};

const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono text-sm ml-2">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tytuł
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Data utworzenia
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ticket = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Otwórz menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(ticket.id)}>Kopiuj ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Zobacz szczegóły</DropdownMenuItem>
            <DropdownMenuItem>Edytuj zgłoszenie</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Usuń zgłoszenie</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function RouteComponent() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: demoTickets,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Szukaj po tytule..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm text-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Kolumny <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="first:pl-4">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 ">
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Poprzednia
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Następna
          </Button>
        </div>
      </div>
    </div>
  );
}
