import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Table } from "@tanstack/react-table";
import { RefreshCw, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/data/mock/admin-context";
import { triggerNetworkScan } from "./use-network";
import type { NetworkFilters } from "./use-network";

type SearchField = "hostname" | "macAddress" | "switchName";

const SEARCH_FIELDS: { value: SearchField; label: string }[] = [
  { value: "hostname",   label: "Hostname"  },
  { value: "macAddress", label: "Adres MAC" },
  { value: "switchName", label: "Switch"    },
];

const VENDORS = ["Dell", "HP", "Apple", "Lenovo", "Cisco", "Epson"];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onFiltersChange: (filters: NetworkFilters) => void;
  onScanComplete:  () => void;
}

export function NetworkTableToolbar<TData>({ table, onFiltersChange, onScanComplete }: DataTableToolbarProps<TData>) {
  const { isInventoryAdmin: adminView } = useAdmin();

  const [searchField,     setSearchField]     = useState<SearchField>("hostname");
  const [searchValue,     setSearchValue]     = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [isScanning,      setIsScanning]      = useState(false);

  useEffect(() => {
    const filters: NetworkFilters = {};
    if (searchValue)            filters[searchField] = searchValue;
    if (selectedVendors.length) filters.vendors      = selectedVendors;
    onFiltersChange(filters);
  }, [searchField, searchValue, selectedVendors]);

  const handleSearchFieldChange = (field: SearchField) => {
    setSearchValue("");
    setSearchField(field);
  };

  const toggleVendor = (vendor: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendor) ? prev.filter((v) => v !== vendor) : [...prev, vendor]
    );
  };

  const clearFilters = () => {
    setSearchValue("");
    setSelectedVendors([]);
    table.resetColumnFilters();
  };

  const handleScanNow = async () => {
    setIsScanning(true);
    try {
      await triggerNetworkScan();
      toast("Skanowanie sieci zostało uruchomione.", {
        action: { label: "Zamknij", onClick: () => {} },
      });
      setTimeout(() => {
        onScanComplete();
        setIsScanning(false);
      }, 2000);
    } catch {
      toast.error("Nie udało się uruchomić skanowania.");
      setIsScanning(false);
    }
  };

  const hasActiveFilters = searchValue || selectedVendors.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 justify-between flex-col xs:flex-row">
        <div className="flex items-center gap-2 w-full sm:max-w-md">
          <Select value={searchField} onValueChange={(v) => handleSearchFieldChange(v as SearchField)}>
            <SelectTrigger className="w-36 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEARCH_FIELDS.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder={`Szukaj po ${SEARCH_FIELDS.find((f) => f.value === searchField)?.label.toLowerCase()}...`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full justify-between xs:w-fit xs:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Producent
                {selectedVendors.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">{selectedVendors.length}</Badge>
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

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Wyczyść
            </Button>
          )}

          {adminView && (
            <Button variant="outline" size="sm" className="gap-2" onClick={handleScanNow} disabled={isScanning}>
              <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
              {isScanning ? "Skanowanie..." : "Skanuj teraz"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
