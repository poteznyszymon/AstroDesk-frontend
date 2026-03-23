import type { Equipment, EquipmentStatus, EquipmentType } from "@/types/equipment";
import React from "react";
import { ArrowUpDown, MoreHorizontal, Monitor, Laptop, Printer, Server, Smartphone, HardDrive } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const getEquipmentColumns = (): ColumnDef<Equipment>[] => {
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
    // {
    //   accessorKey: "id",
    //   header: "ID",
    //   cell: ({ row }) => <div className="font-mono text-sm ml-2">{row.getValue("id")}</div>,
    // },
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
          <div className="flex items-center gap-2 ml-3">
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
      cell: (_) => {
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
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Zobacz szczegóły</DropdownMenuItem> */}
              <DropdownMenuItem>Edytuj sprzęt</DropdownMenuItem>
              <DropdownMenuItem>Przypisz do pracownika</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Usuń z inwentarza</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
