import React from "react";
import {
  ArrowUpDown,
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
import EditEquipmentDialog from "./edit-equipment-dialog";

import type { Inventory, InventoryItemType, InventoryStatus } from "@/types/inventory";

export const getInventoryColumns = (adminView: boolean): ColumnDef<Inventory>[] => {
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
      filterFn: (row, _, filterValue: string) => {
        if (!filterValue) return true;
        const q = filterValue.toLowerCase();
        return (
          (row.getValue('name') as string).toLowerCase().includes(q) ||
          (row.original.serialNumber ?? '').toLowerCase().includes(q) ||
          (row.original.model ?? '').toLowerCase().includes(q)
        );
      },
    },
    {
      accessorKey: "itemType",
      header: "Typ",
      filterFn: "equals",
      cell: ({ row }) => {
        const type = row.getValue("itemType") as InventoryItemType;
        const config = typeConfig[type];
        return <span className="text-sm">{config?.label || type}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: "equals",
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
      filterFn: 'equals',
    },
    {
      accessorKey: "location",
      header: "Lokalizacja",
      filterFn: 'equals',
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
      id: 'hasNotes',
      accessorFn: (row) => row.notes.length,
      header: () => null,
      cell: () => null,
      filterFn: (row, _, filterValue: boolean) => {
        if (!filterValue) return true;
        return row.original.notes.length > 0;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        if (!adminView) return null;
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <EditEquipmentDialog item={row.original} showText={false} />
          </div>
        );
      },
    },
  ];
  return columns;
};