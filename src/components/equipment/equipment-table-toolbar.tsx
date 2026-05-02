import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { useAdmin } from "@/data/mock/admin-context";
import { useInventory } from "@/hooks/inventory/useInventory";
import AddEquipmentDialog from "@/components/equipment/add-equipment-dialog.tsx";
import type { InventoryItemType, InventoryStatus } from "@/types/inventory";
import { FileText, X, Download, Upload, ChevronDown } from "lucide-react";
import { exportInventory } from "@/lib/export";
import { validateInventoryImport, importInventory as importInventoryApi } from "@/hooks/inventory/api.inventory";
import { ExportDialog } from "@/components/shared/export-dialog";
import { ImportDialog } from "@/components/shared/import-dialog";
import { useMemo, useState } from "react";
import { queryClient } from "@/main";

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
  WYPORZYCZONE: "Wypożyczone",
  W_TRAKCIE: "W trakcie",
  SERWIS: "W serwisie",
  UTYLIZACJA: "Utylizacja",
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function EquipmentTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const { isInventoryAdmin: adminView } = useAdmin();
  const { data, isLoading } = useInventory();
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const locations = useMemo(() => {
    const inventory = data ?? [];
    return [...new Set(inventory.map((i) => i.location).filter((l): l is string => !!l))].sort();
  }, [data]);

  const assignees = useMemo(() => {
    const inventory = data ?? [];
    return [...new Set(inventory.map((i) => i.assignedTo ? `${i.assignedTo.firstName} ${i.assignedTo.lastName}` : null).filter((a): a is string => !!a))].sort();
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

      <div className="flex items-center gap-2 w-full sm:w-fit justify-end">
        {adminView && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 flex-1 sm:flex-none">
                Dane
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setExportOpen(true)}>
                <Download className="h-3.5 w-3.5 mr-2" />
                Eksportuj
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportOpen(true)}>
                <Upload className="h-3.5 w-3.5 mr-2" />
                Importuj
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {adminView && <AddEquipmentDialog isLoading={isLoading} triggerClassName="flex-1 sm:flex-none" />}
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        rowCount={data?.length ?? 0}
        onExport={(format) => exportInventory(format)}
      />

      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        validateFn={(file) => validateInventoryImport(file)}
        importFn={(file, skipErrors) => importInventoryApi(file, skipErrors)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['inventory'] })}
      />
    </div>
  );
}
