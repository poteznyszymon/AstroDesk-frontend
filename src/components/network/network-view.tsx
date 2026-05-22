import { DataTable } from "@/components/shared/data-table";
import { getNetworkColumns } from "./network-columns";
import { NetworkTableToolbar } from "./network-table-toolbar";
import type { NetworkItem } from "@/types/network";
import { useState, useMemo, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Monitor, Clock, Loader2, Pencil, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNetworkDevices, useNetworkHistory } from "./use-network";
import type { NetworkFilters } from "./use-network";

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
      <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-7 text-sm py-0" autoFocus
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }} />
      <button onClick={save} disabled={saving} className="text-green-600 hover:text-green-700"><Check className="h-4 w-4" /></button>
      <button onClick={cancel} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
    </div>
  );
}

const NO_VENDOR = "Brak informacji";

const NetworkView = () => {
  const [selectedItem, setSelectedItem] = useState<NetworkItem | null>(null);

  const [hostname,         setHostname]         = useState<string | undefined>(undefined);
  const [macAddress,       setMacAddress]        = useState<string | undefined>(undefined);
  const [selectedVendors,  setSelectedVendors]   = useState<string[]>([]);

  const apiFilters = useMemo<NetworkFilters>(
    () => ({ hostname, macAddress }),
    [hostname, macAddress]
  );

  const { data: allData, isLoading, refetch } = useNetworkDevices(apiFilters);
  const { history, isLoading: historyLoading } = useNetworkHistory(selectedItem?.macAddress ?? null);

  const availableVendors = useMemo(() =>
    Array.from(new Set(allData.map(d => d.vendor ?? NO_VENDOR))).sort(),
    [allData]
  );

  const data = useMemo(() => {
    if (selectedVendors.length === 0) return allData;
    return allData.filter(d => selectedVendors.includes(d.vendor ?? NO_VENDOR));
  }, [allData, selectedVendors]);

  const columns = useMemo(() => getNetworkColumns((item) => setSelectedItem(item)), []);

  const handleFiltersChange = useCallback((f: NetworkFilters) => {
    setHostname(f.hostname);
    setMacAddress(f.macAddress);
    setSelectedVendors(f.vendors ?? []);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={data}
        toolbar={(props) => (
          <NetworkTableToolbar
            {...props}
            availableVendors={availableVendors}
            onFiltersChange={handleFiltersChange}
            onScanComplete={refetch}
          />
        )}
        onRowClick={(row) => setSelectedItem(row)}
      />

      <Sheet open={!!selectedItem} onOpenChange={(isOpen) => { if (!isOpen) setSelectedItem(null); }}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto px-5">
          {selectedItem && (
            <div className="flex flex-col gap-8 py-4">
              <SheetHeader className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-5 w-5 text-primary" />
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
                  <EditableHostname
                    deviceId={selectedItem.id}
                    hostname={selectedItem.hostname}
                    onUpdated={(newHostname) => setSelectedItem({ ...selectedItem, hostname: newHostname })}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Ostatnio widziany</span>
                  <p className="text-sm">{new Date(selectedItem.lastSeenAt).toLocaleDateString("pl-PL")}</p>
                </div>
              </div>

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
                        <div className={`absolute left-0 top-2 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-background z-10 ${idx === 0 ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.4)]" : "bg-muted"}`} />
                        <div className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono font-bold text-sm">{entry.ipAddress}</span>
                            {idx === 0 && <Badge className="bg-emerald-500/10 text-emerald-600 border-none hover:bg-emerald-500/10 text-[10px] font-bold">AKTUALNY</Badge>}
                          </div>
                          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
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
