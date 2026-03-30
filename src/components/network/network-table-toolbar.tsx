import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Table } from "@tanstack/react-table";
import { RefreshCw, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/data/mock/admin-context";

type SearchField = "hostname" | "macAddress" | "switchName";

const SEARCH_FIELDS: { value: SearchField; label: string }[] = [
  { value: "hostname", label: "Hostname" },
  { value: "macAddress", label: "Adres MAC" },
  { value: "switchName", label: "Switch" },
];

const VENDORS = ["Dell", "HP", "Apple", "Lenovo", "Cisco", "Epson"];
const STATUSES = [
  { value: "true", label: "Powiązany" },
  { value: "false", label: "Niepowiązany" },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function NetworkTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const { adminView } = useAdmin();
  const [searchField, setSearchField] = useState<SearchField>("hostname");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleSearchFieldChange = (field: SearchField) => {
    table.getColumn(searchField)?.setFilterValue(undefined);
    setSearchField(field);
  };

  const searchValue = (table.getColumn(searchField)?.getFilterValue() as string) ?? "";

  const toggleVendor = (vendor: string) => {
    const next = selectedVendors.includes(vendor) ? selectedVendors.filter((v) => v !== vendor) : [...selectedVendors, vendor];
    setSelectedVendors(next);
    table.getColumn("vendor")?.setFilterValue(next.length > 0 ? next : undefined);
  };

  const toggleStatus = (value: string) => {
    const next = selectedStatuses.includes(value) ? selectedStatuses.filter((s) => s !== value) : [...selectedStatuses, value];
    setSelectedStatuses(next);
    table.getColumn("isImported")?.setFilterValue(next.length > 0 ? next : undefined);
  };

  const clearFilters = () => {
    table.getColumn(searchField)?.setFilterValue(undefined);
    table.getColumn("vendor")?.setFilterValue(undefined);
    table.getColumn("isImported")?.setFilterValue(undefined);
    setSelectedVendors([]);
    setSelectedStatuses([]);
  };

  const hasActiveFilters = searchValue || selectedVendors.length > 0 || selectedStatuses.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 justify-between flex-col xs:flex-row">
        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:max-w-md">
          <Select value={searchField} onValueChange={(v) => handleSearchFieldChange(v as SearchField)}>
            <SelectTrigger className="w-36 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEARCH_FIELDS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder={`Szukaj po ${SEARCH_FIELDS.find((f) => f.value === searchField)?.label.toLowerCase()}...`}
            value={searchValue}
            onChange={(e) => table.getColumn(searchField)?.setFilterValue(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filters + actions */}
        <div className="flex items-center gap-2 w-full justify-between xs:w-fit xs:justify-end">
          {/* Vendor filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Producent
                {selectedVendors.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {selectedVendors.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Producent</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {VENDORS.map((v) => (
                <DropdownMenuCheckboxItem key={v} checked={selectedVendors.includes(v)} onCheckedChange={() => toggleVendor(v)}>
                  {v}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Status
                {selectedStatuses.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {selectedStatuses.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Status powiązania</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STATUSES.map((s) => (
                <DropdownMenuCheckboxItem key={s.value} checked={selectedStatuses.includes(s.value)} onCheckedChange={() => toggleStatus(s.value)}>
                  {s.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Wyczyść
            </Button>
          )}

          {/* Scan now */}
          {adminView && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                toast("Skanowanie sieci zostało uruchomione ręcznie.", {
                  action: { label: "Zamknij", onClick: () => {} },
                })
              }
            >
              <RefreshCw className="h-4 w-4" />
              Skanuj teraz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
