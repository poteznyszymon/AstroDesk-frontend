import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Monitor, Laptop, Printer, Server, Smartphone, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/(root)/_root/inventory")({
  component: RouteComponent,
});

type EquipmentType = "laptop" | "desktop" | "monitor" | "printer" | "phone" | "server" | "other";
type EquipmentStatus = "active" | "in-repair" | "available" | "retired";

interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  serialNumber: string;
  status: EquipmentStatus;
  assignedTo: string | null;
  location: string;
  assignedDate: string | null;
}

const demoEquipment: Equipment[] = [
  {
    id: "INV-001",
    name: "Dell Latitude 5520",
    type: "laptop",
    serialNumber: "DL5520-2024-001",
    status: "active",
    assignedTo: "dr hab. Jan Kowalski",
    location: "Pokój 204",
    assignedDate: "2024-03-15",
  },
  {
    id: "INV-002",
    name: "HP ProDesk 400 G7",
    type: "desktop",
    serialNumber: "HP400G7-2024-002",
    status: "active",
    assignedTo: "mgr Anna Nowak",
    location: "Dziekanat",
    assignedDate: "2024-01-10",
  },
  {
    id: "INV-003",
    name: "Dell UltraSharp U2422H",
    type: "monitor",
    serialNumber: "DLU2422H-2024-003",
    status: "active",
    assignedTo: "prof. dr hab. Piotr Wiśniewski",
    location: "Pokój 312",
    assignedDate: "2024-02-20",
  },
  {
    id: "INV-004",
    name: "HP LaserJet Pro M404dn",
    type: "printer",
    serialNumber: "HPM404DN-2023-004",
    status: "in-repair",
    assignedTo: null,
    location: "Sala wykładowa A1",
    assignedDate: null,
  },

  {
    id: "INV-006",
    name: "Dell PowerEdge R640",
    type: "server",
    serialNumber: "DPE640-2022-006",
    status: "active",
    assignedTo: null,
    location: "Serwerownia",
    assignedDate: null,
  },
  {
    id: "INV-007",
    name: "Lenovo ThinkPad X1 Carbon",
    type: "laptop",
    serialNumber: "LTX1C-2024-007",
    status: "available",
    assignedTo: null,
    location: "Magazyn IT",
    assignedDate: null,
  },
  {
    id: "INV-008",
    name: "Projektor Epson EB-2250U",
    type: "other",
    serialNumber: "EPJ2250-2024-008",
    status: "active",
    assignedTo: null,
    location: "Sala wykładowa B2",
    assignedDate: null,
  },
  {
    id: "INV-009",
    name: "HP EliteDesk 800 G6",
    type: "desktop",
    serialNumber: "HPE800G6-2023-009",
    status: "retired",
    assignedTo: null,
    location: "Laboratorium 101",
    assignedDate: null,
  },
  {
    id: "INV-010",
    name: "Epson EcoTank ET-4850",
    type: "printer",
    serialNumber: "EPT4850-2024-010",
    status: "active",
    assignedTo: null,
    location: "Dziekanat",
    assignedDate: null,
  },
  {
    id: "INV-011",
    name: "Dell Precision 5570",
    type: "laptop",
    serialNumber: "DP5570-2024-011",
    status: "active",
    assignedTo: "dr inż. Tomasz Lewandowski",
    location: "Pokój 405",
    assignedDate: "2024-07-01",
  },
  {
    id: "INV-012",
    name: "LG 27UK850-W",
    type: "monitor",
    serialNumber: "LG27UK-2023-012",
    status: "active",
    assignedTo: "dr inż. Tomasz Lewandowski",
    location: "Pokój 405",
    assignedDate: "2023-08-15",
  },
  {
    id: "INV-013",
    name: "Dell OptiPlex 7090",
    type: "desktop",
    serialNumber: "DO7090-2023-013",
    status: "active",
    assignedTo: null,
    location: "Laboratorium 203",
    assignedDate: null,
  },
  {
    id: "INV-014",
    name: "MacBook Pro 14 M3",
    type: "laptop",
    serialNumber: "MBP14M3-2024-014",
    status: "active",
    assignedTo: "dr Magdalena Wiśniewska",
    location: "Pokój 210",
    assignedDate: "2024-10-01",
  },
  {
    id: "INV-015",
    name: "Tablica interaktywna Samsung Flip",
    type: "other",
    serialNumber: "SFL65-2024-015",
    status: "active",
    assignedTo: null,
    location: "Sala seminaryjna C3",
    assignedDate: null,
  },
];

const typeConfig: Record<EquipmentType, { label: string; icon: React.ElementType }> = {
  laptop: { label: "Laptop", icon: Laptop },
  desktop: { label: "Komputer", icon: Monitor },
  monitor: { label: "Monitor", icon: Monitor },
  printer: { label: "Drukarka", icon: Printer },
  phone: { label: "Telefon", icon: Smartphone },
  server: { label: "Serwer", icon: Server },
  other: { label: "Inne", icon: HardDrive },
};

const statusConfig: Record<EquipmentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Aktywny", variant: "default" },
  "in-repair": { label: "W naprawie", variant: "destructive" },
  available: { label: "Dostępny", variant: "secondary" },
  retired: { label: "Wycofany", variant: "outline" },
};

const columns: ColumnDef<Equipment>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono text-sm ml-2">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nazwa
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const config = typeConfig[type];
      const TypeIcon = config.icon;
      return (
        <div className="flex items-center gap-2">
          <TypeIcon className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-muted-foreground">{row.original.serialNumber}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Typ",
    cell: ({ row }) => {
      const type = row.getValue("type") as EquipmentType;
      const config = typeConfig[type];
      return <span className="text-sm">{config.label}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as EquipmentStatus;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Przypisany do
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo") as string | null;
      return assignedTo ? <div className="font-medium">{assignedTo}</div> : <span className="text-muted-foreground">Nieprzypisany</span>;
    },
  },
  {
    accessorKey: "location",
    header: "Lokalizacja",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "assignedDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
        Data przypisania
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("assignedDate") as string | null;
      return date ? <div>{date}</div> : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const equipment = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(equipment.serialNumber)}>Kopiuj numer seryjny</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Zobacz szczegóły</DropdownMenuItem>
            <DropdownMenuItem>Edytuj sprzęt</DropdownMenuItem>
            <DropdownMenuItem>Przypisz do pracownika</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Usuń z inwentarza</DropdownMenuItem>
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
    data: demoEquipment,
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
      <div className="flex items-center gap-4 justify-between flex-col xs:flex-row">
        <Input
          placeholder="Szukaj po nazwie..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="sm:max-w-sm text-sm"
        />
        <div className="flex items-center gap-4 w-full justify-between xs:w-fit">
          <Button>Dodaj nowy</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
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
      <div className="flex items-center justify-end space-x-2">
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
