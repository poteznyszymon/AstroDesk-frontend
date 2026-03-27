import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";
import { useAdmin } from "@/data/mock/admin-context";
import { useInventory } from "@/hooks/inventory/useInventory";
import AddEquipmentDialog from "@/components/equipment/add-equipment-dialog.tsx";
import type { InventoryItemType, InventoryStatus } from "@/types/inventory";
import { FileText, X } from "lucide-react";
import { useMemo } from "react";

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
  const { data, isLoading } = useInventory();

  const locations = useMemo(() => {
    const inventory = data ?? [];
    return [...new Set(inventory.map((i) => i.location).filter((l): l is string => l !== null))].sort();
  }, [data]);

  const assignees = useMemo(() => {
    const inventory = data ?? [];
    return [...new Set(inventory.map((i) => i.assignedTo).filter((a): a is string => a !== null))].sort();
  }, [data]);

  const nameFilter = (table.getColumn("name")?.getFilterValue() as string) ?? "";
  const typeFilter = (table.getColumn("itemType")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";
  const locationFilter = (table.getColumn("location")?.getFilterValue() as string) ?? "";
  const assignedToFilter = (table.getColumn("assignedTo")?.getFilterValue() as string) ?? "";
  const hasNotesFilter = (table.getColumn("hasNotes")?.getFilterValue() as boolean) === true;

  const isFiltered =
    nameFilter !== "" ||
    typeFilter !== "" ||
    statusFilter !== "" ||
    locationFilter !== "" ||
    assignedToFilter !== "" ||
    hasNotesFilter;

  const clearFilters = () => {
    table.getColumn("name")?.setFilterValue("");
    table.getColumn("itemType")?.setFilterValue("");
    table.getColumn("status")?.setFilterValue("");
    table.getColumn("location")?.setFilterValue("");
    table.getColumn("assignedTo")?.setFilterValue("");
    table.getColumn("hasNotes")?.setFilterValue(undefined);
  };

  return (
    <div className="flex items-start gap-2 justify-between flex-col sm:flex-row flex-wrap">
      {adminView && <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
        <Input
          disabled={isLoading}
          placeholder="Szukaj po nazwie"
          value={nameFilter}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
          className="h-8 w-full sm:w-[220px]"
        />

        <Select
          disabled={isLoading}
          value={typeFilter}
          onValueChange={(val) => table.getColumn("itemType")?.setFilterValue(val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="h-8 w-full sm:w-[130px]" size="sm">
            <SelectValue placeholder="Typ" />
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
          onValueChange={(val) => table.getColumn("status")?.setFilterValue(val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="h-8 w-full sm:w-[130px]" size="sm">
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

        {adminView && (
          <>
            <Select
              disabled={isLoading || locations.length === 0}
              value={locationFilter}
              onValueChange={(val) => table.getColumn("location")?.setFilterValue(val === "ALL" ? "" : val)}
            >
              <SelectTrigger className="h-8 w-full sm:w-[140px]" size="sm">
                <SelectValue placeholder="Lokalizacja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Wszystkie lokalizacje</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              disabled={isLoading || assignees.length === 0}
              value={assignedToFilter}
              onValueChange={(val) => table.getColumn("assignedTo")?.setFilterValue(val === "ALL" ? "" : val)}
            >
              <SelectTrigger className="h-8 w-full sm:w-[150px]" size="sm">
                <SelectValue placeholder="Przypisany do" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Wszyscy</SelectItem>
                {assignees.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        <Button
          variant={hasNotesFilter ? "secondary" : "outline"}
          size="sm"
          disabled={isLoading}
          className="h-8 gap-1.5"
          onClick={() => table.getColumn("hasNotes")?.setFilterValue(hasNotesFilter ? undefined : true)}
        >
          <FileText className="h-3.5 w-3.5" />
          Z notatkami
        </Button>

        {isFiltered && (
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clearFilters} disabled={isLoading}>
            <X className="h-4 w-4" />
            Resetuj
          </Button>
        )}
      </div>}

      <div className="flex items-center w-full sm:w-fit justify-end">
        {adminView && <AddEquipmentDialog isLoading={isLoading} />}
      </div>
    </div>
  );
}
