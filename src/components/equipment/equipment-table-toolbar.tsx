import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";
import { useAdmin } from "@/data/mock/admin-context";
import { useInventory } from "@/hooks/inventory/useInventory";
import AddEquipmentDialog from "@/components/equipment/add-equipment-dialog.tsx";
import type { InventoryItemType, InventoryStatus } from "@/types/inventory";
import { X } from "lucide-react";

const itemTypeLabels: Record<InventoryItemType, string> = {
  LAPTOP: "Laptop",
  KOMPUTER: "Komputer",
  DRUKARKA: "Drukarka",
  ROUTER: "Router",
  SWITCH: "Switch",
  TELEFON: "Telefon",
};

const statusLabels: Record<InventoryStatus, string> = {
  DOSTEPNE: "Dostępne",
  DO_WYDANIA: "Do wydania",
  WYDANE: "Wydane",
  ZAJETE: "Zajęte",
  W_TRAKCIE: "W trakcie",
  PRZYJETY: "Przyjęty",
  SERWIS: "W serwisie",
  UTYLIZACJA: "Utylizacja",
  CANCELLED: "Anulowane",
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function EquipmentTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const { adminView } = useAdmin();
  const { isLoading } = useInventory();

  const nameFilter = (table.getColumn("name")?.getFilterValue() as string) ?? "";
  const typeFilter = (table.getColumn("itemType")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  const isFiltered = nameFilter !== "" || typeFilter !== "" || statusFilter !== "";

  const clearFilters = () => {
    table.getColumn("name")?.setFilterValue("");
    table.getColumn("itemType")?.setFilterValue("");
    table.getColumn("status")?.setFilterValue("");
  };

  return (
    <div className="flex items-center gap-2 justify-between flex-col xs:flex-row flex-wrap">
      {adminView && (
        <div className="flex items-center gap-2 flex-wrap w-full xs:w-auto">
        <Input
          disabled={isLoading}
          placeholder="Filtruj sprzęt..."
          value={nameFilter}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
          className="h-8 w-full sm:w-[180px]"
        />
            <Select
              disabled={isLoading}
              value={typeFilter}
              onValueChange={(val) =>
                table.getColumn("itemType")?.setFilterValue(val === "ALL" ? "" : val)
              }
            >
              <SelectTrigger className="h-8 w-full sm:w-[140px]" size="sm">
                <SelectValue placeholder="Typ urządzenia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Wszystkie typy</SelectItem>
                {(Object.keys(itemTypeLabels) as InventoryItemType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {itemTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              disabled={isLoading}
              value={statusFilter}
              onValueChange={(val) =>
                table.getColumn("status")?.setFilterValue(val === "ALL" ? "" : val)
              }
            >
              <SelectTrigger className="h-8 w-full sm:w-[140px]" size="sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Wszystkie statusy</SelectItem>
                {(Object.keys(statusLabels) as InventoryStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        {isFiltered && (
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clearFilters} disabled={isLoading}>
            <X className="h-4 w-4" />
            Resetuj
          </Button>
        )}
      </div>
      )}

      <div className="flex items-center gap-4 w-full justify-between xs:w-fit">
        {adminView && <AddEquipmentDialog isLoading={isLoading} />}
      </div>
    </div>
  );
}
