import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Package, Ticket } from "lucide-react";
import type { HistoryRecord, HistoryTargetType } from "@/types/history";

const fieldLabels: Record<string, string> = {
  name: "Nazwa",
  itemType: "Typ sprzętu",
  serialNumber: "Numer seryjny",
  model: "Model",
  boughtDate: "Data zakupu",
  price: "Cena",
  invoiceNumber: "Numer faktury",
  location: "Lokalizacja",
  assignedTo: "Przypisano do",
  assignedBy: "Przypisano przez",
  assignedDate: "Data przypisania",
  status: "Status",
  priority: "Priorytet",
  author: "Autor",
  title: "Tytuł",
  description: "Opis",
  assigneeId: "Przypisany",
  linkedInventoryId: "Powiązane urządzenie",
};

const targetConfig: Record<HistoryTargetType, { label: string; icon: React.ElementType; variant: "default" | "secondary" }> = {
  INVENTORY: { label: "Sprzęt", icon: Package, variant: "secondary" },
  TICKET: { label: "Ticket", icon: Ticket, variant: "default" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const getHistoryColumns = (): ColumnDef<HistoryRecord>[] => [
  {
    accessorKey: "changedAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Data
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="ml-3">
        <div className="font-medium whitespace-nowrap">{formatDate(row.original.changedAt)}</div>
      </div>
    ),
  },
  {
    accessorKey: "changedBy",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Autor
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.changedBy}</div>,
  },
  {
    accessorKey: "targetType",
    header: "Obiekt",
    cell: ({ row }) => {
      const config = targetConfig[row.original.targetType];
      const Icon = config.icon;
      return (
        <div className="flex items-center gap-2">
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
          <span className="text-sm text-muted-foreground">#{row.original.targetId}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "fieldName",
    header: "Pole",
    cell: ({ row }) => {
      const fieldName = row.original.fieldName;
      if (!fieldName) return <span className="text-muted-foreground text-sm">—</span>;
      return <span className="text-sm">{fieldLabels[fieldName] ?? fieldName}</span>;
    },
  },
  {
    id: "change",
    header: "Zmiana",
    cell: ({ row }) => {
      const { message, oldValue, newValue } = row.original;
      if (message) return <span className="text-sm">{message}</span>;
      if (!oldValue && !newValue) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          {oldValue && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground line-through">
              {oldValue}
            </span>
          )}
          {oldValue && newValue && <span className="text-xs text-muted-foreground">→</span>}
          {newValue && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-foreground font-medium">
              {newValue}
            </span>
          )}
        </div>
      );
    },
  },
];
