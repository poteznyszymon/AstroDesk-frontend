import React from "react";
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Monitor, 
  Laptop, 
  Printer, 
  Smartphone, 
  Router, 
  Network 
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import type { Inventory, InventoryItemType, InventoryStatus } from "@/types/inventory";

export const getInventoryColumns = (): ColumnDef<Inventory>[] => {
  const typeConfig: Record<InventoryItemType, { label: string; icon: React.ElementType }> = {
    LAPTOP: { label: "Laptop", icon: Laptop },
    KOMPUTER: { label: "Komputer", icon: Monitor },
    DRUKARKA: { label: "Drukarka", icon: Printer },
    ROUTER: { label: "Router", icon: Router },
    SWITCH: { label: "Switch", icon: Network },
    TELEFON: { label: "Telefon", icon: Smartphone },
  };

  const statusConfig: Record<InventoryStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    DOSTEPNE: { label: "Dostępne", variant: "secondary" },
    DO_WYDANIA: { label: "Do wydania", variant: "outline" },
    WYDANE: { label: "Wydane", variant: "default" },
    ZAJETE: { label: "Zajęte", variant: "default" },
    W_TRAKCIE: { label: "W trakcie", variant: "outline" },
    PRZYJETY: { label: "Przyjęty", variant: "default" },
    SERWIS: { label: "W serwisie", variant: "destructive" },
    UTYLIZACJA: { label: "Utylizacja", variant: "destructive" },
    CANCELLED: { label: "Anulowane", variant: "destructive" },
  };

  const columns: ColumnDef<Inventory>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nazwa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const type = row.original.itemType;
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
      accessorKey: "itemType",
      header: "Typ",
      cell: ({ row }) => {
        const type = row.getValue("itemType") as InventoryItemType;
        const config = typeConfig[type];
        return <span className="text-sm">{config?.label || type}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as InventoryStatus;
        const config = statusConfig[status];
        return <Badge variant={config?.variant || "default"}>{config?.label || status}</Badge>;
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
      cell: ({ row }) => {
        const location = row.getValue("location") as string | null;
        return <div>{location || <span className="text-muted-foreground">—</span>}</div>;
      },
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