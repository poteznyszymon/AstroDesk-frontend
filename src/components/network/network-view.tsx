import { DataTable } from "@/components/shared/data-table";
import { getNetworkColumns } from "./network-columns";
import { NetworkTableToolbar } from "./network-table-toolbar";
import type { NetworkItem } from "@/types/network";
import { useState, useMemo, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, Monitor, MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useNetworkDevices, useNetworkHistory } from "./use-network";
import type { NetworkFilters } from "./use-network";

import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

function EditableHostname({ deviceId, hostname, onUpdated }: { deviceId: number; hostname: string | null; onUpdated: (newHostname: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(hostname ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/network/devices/${deviceId}/hostname`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostname: value }),
      });
      if (!res.ok) throw new Error();
      onUpdated(value);
      setEditing(false);
    } catch {
      // zostaw edycję otwartą przy błędzie
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setValue(hostname ?? "");
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2 group">
        <p className="text-sm italic">{hostname || "Brak danych"}</p>
        <button onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-7 text-sm py-0"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
      />
      <button onClick={save} disabled={saving} className="text-green-600 hover:text-green-700">
        <Check className="h-4 w-4" />
      </button>
      <button onClick={cancel} className="text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

const NetworkView = () => {
  const [selectedItem, setSelectedItem] = useState<NetworkItem | null>(null);

  // Trzymamy filtry jako osobne pola zamiast obiektu — unikamy tworzenia nowego obiektu przy każdym renderze
  const [hostname, setHostname] = useState<string | undefined>(undefined);
  const [macAddress, setMacAddress] = useState<string | undefined>(undefined);
  const [switchName, setSwitchName] = useState<string | undefined>(undefined);
  const [vendors, setVendors] = useState<string[] | undefined>(undefined);
  const [isImported, setIsImported] = useState<boolean | undefined>(undefined);

  // useMemo zapewnia że obiekt filters zmienia referencję TYLKO gdy faktycznie zmieniły się wartości
  const filters = useMemo<NetworkFilters>(() => ({ hostname, macAddress, switchName, vendors, isImported }), [hostname, macAddress, switchName, vendors, isImported]);

  const { data, isLoading, refetch } = useNetworkDevices(filters);
  const { history, isLoading: historyLoading } = useNetworkHistory(selectedItem?.macAddress ?? null);

  const columns = useMemo(() => getNetworkColumns((item) => setSelectedItem(item)), []);

  // Stabilna referencja do handlera filtrów — nie tworzy nowej funkcji przy każdym renderze
  const handleFiltersChange = useCallback((f: NetworkFilters) => {
    setHostname(f.hostname);
    setMacAddress(f.macAddress);
    setSwitchName(f.switchName);
    setVendors(f.vendors && f.vendors.length > 0 ? f.vendors : undefined);
    setIsImported(f.isImported);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data}
        toolbar={(props) => <NetworkTableToolbar {...props} onFiltersChange={handleFiltersChange} onScanComplete={refetch} />}
        onRowClick={(row) => setSelectedItem(row)}
      />

      <Sheet
        open={!!selectedItem}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedItem(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-md overflow-y-auto px-5">
          {selectedItem && (
            <div className="flex flex-col gap-8 py-4">
              <SheetHeader className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  <Badge variant={selectedItem.isImported ? "default" : "outline"}>{selectedItem.isImported ? "Powiązany z IT" : "Nieznany"}</Badge>
                </div>
                <SheetTitle className="text-xl font-mono break-all">{selectedItem.macAddress}</SheetTitle>
                <SheetDescription>Szczegóły urządzenia i historia lokalizacji w sieci</SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Adres IP</span>
                  <p className="text-sm font-mono font-medium">{selectedItem.ipAddress}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Producent</span>
                  <p className="text-sm">{selectedItem.vendor || "Nieznany"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Hostname</span>
                  <EditableHostname deviceId={selectedItem.id} hostname={selectedItem.hostname} onUpdated={(newHostname) => setSelectedItem({ ...selectedItem, hostname: newHostname })} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Ostatnio widziany</span>
                  <p className="text-sm">{new Date(selectedItem.lastSeenAt).toLocaleDateString("pl-PL")}</p>
                </div>
              </div>

              {selectedItem.isImported && (
                <div className="rounded-xl bg-muted/40 p-4 border border-border/60">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Powiązany zasób IT
                  </div>
                  <div className="text-sm font-semibold text-primary">{selectedItem.linkedAssetName}</div>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Historia podłączeń
                </div>

                {historyLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pl-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ładowanie historii...
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic pl-2">Brak zarejestrowanej historii.</div>
                ) : (
                  <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-px before:bg-border ml-1">
                    {history.map((entry, idx) => (
                      <div key={entry.id ?? idx} className="relative pl-10">
                        <div
                          className={`absolute left-0 top-2 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-background z-10 ${
                            idx === 0 ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.4)]" : "bg-muted"
                          }`}
                        />
                        <div className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono font-bold text-sm">{entry.ipAddress}</span>
                            {idx === 0 && <Badge className="bg-emerald-500/10 text-emerald-600 border-none hover:bg-emerald-500/10 text-[10px] font-bold">AKTUALNY</Badge>}
                          </div>
                          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-primary/60" />
                              <span className="font-semibold text-foreground/80">{entry.switchName}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">{entry.switchPort}</span>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                              <span>{new Date(entry.seenAt).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NetworkView;
