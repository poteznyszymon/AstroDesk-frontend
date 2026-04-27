import { DataTable } from "@/components/shared/data-table";
import { mockNetworkItems, mockNetworkHistory } from "@/data/mock/mock-network";
import { getNetworkColumns } from "./network-columns";
import { NetworkTableToolbar } from "./network-table-toolbar";
import type { NetworkItem } from "@/types/network";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, Monitor, MapPin, Clock, ArrowRight } from "lucide-react";

const NetworkView = () => {
  const [selectedItem, setSelectedItem] = useState<NetworkItem | null>(null);

  // Przekazujemy funkcję setSelectedItem do kolumn
  const columns = getNetworkColumns((item) => setSelectedItem(item));

  const history = selectedItem ? mockNetworkHistory.filter((h) => h.macAddress === selectedItem.macAddress) : [];

  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable isLoading={false} columns={columns} data={mockNetworkItems} toolbar={NetworkTableToolbar} onRowClick={(row) => setSelectedItem(row)} />

      <Sheet
        open={!!selectedItem}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedItem(null);
        }}
      >
        {/* ZWIĘKSZONY PADDING: px-10 zamiast px-6 odsuwa treść od czerwonej kreski */}
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

              {/* Informacje o urządzeniu */}
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
                  <p className="text-sm italic">{selectedItem.hostname || "Brak danych"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Ostatnio widziany</span>
                  <p className="text-sm">{new Date(selectedItem.lastSeenAt).toLocaleDateString("pl-PL")}</p>
                </div>
              </div>

              {/* Zasób IT */}
              {selectedItem.isImported && (
                <div className="rounded-xl bg-muted/40 p-4 border border-border/60">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Powiązany zasób IT
                  </div>
                  <div className="text-sm font-semibold text-primary">{selectedItem.linkedAssetName}</div>
                </div>
              )}

              {/* Historia - Odsunięta dodatkowo od lewej krawędzi */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Historia podłączeń
                </div>

                {history.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic pl-2">Brak zarejestrowanej historii.</div>
                ) : (
                  <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-px before:bg-border ml-1">
                    {history.map((entry, idx) => (
                      <div key={idx} className="relative pl-10">
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
