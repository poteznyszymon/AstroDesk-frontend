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
  const columns = getNetworkColumns();
  const [selectedItem, setSelectedItem] = useState<NetworkItem | null>(null);

  const history = selectedItem
    ? mockNetworkHistory.filter((h) => h.macAddress === selectedItem.macAddress)
    : [];

  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable
        isLoading={false}
        columns={columns}
        data={mockNetworkItems}
        toolbar={NetworkTableToolbar}
        onRowClick={(row) => setSelectedItem(row)}
      />

      <Sheet
        open={!!selectedItem}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedItem(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto px-6">
          {selectedItem && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="font-mono text-base">{selectedItem.macAddress}</SheetTitle>
                <SheetDescription>{selectedItem.hostname ?? "Brak hostname"}</SheetDescription>
              </SheetHeader>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Adres IP</span>
                    <span className="font-mono font-medium">{selectedItem.ipAddress}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Producent</span>
                    <span>{selectedItem.vendor ?? "—"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Switch</span>
                    <span className="font-mono text-sm">{selectedItem.switchName ?? "—"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Port</span>
                    <span className="font-mono text-sm">{selectedItem.switchPort ?? "—"}</span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Ostatnio widziany</span>
                    <span className="text-sm">
                      {new Date(selectedItem.lastSeenAt).toLocaleString("pl-PL")}
                    </span>
                  </div>
                </div>

                {selectedItem.isImported && selectedItem.linkedAssetName ? (
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm bg-muted/40">
                    <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Powiązany zasób:</span>
                    <span className="font-medium">{selectedItem.linkedAssetName}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                    <Monitor className="h-4 w-4 shrink-0" />
                    <span>Nie zaimportowano do inwentaryzacji</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Historia lokalizacji
                </h3>

                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Brak historii dla tego urządzenia.</p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                    <div className="space-y-4 pl-6">
                      {history.map((entry, idx) => (
                        <div key={entry.id} className="relative">
                          <div
                            className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 ${
                              idx === 0 ? "bg-primary border-primary" : "bg-background border-border"
                            }`}
                          />
                          <div className="rounded-md border px-4 py-3 text-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-medium text-sm">{entry.ipAddress}</span>
                              {idx === 0 && <Badge variant="default" className="text-xs">Aktualny</Badge>}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                              <MapPin className="h-3 w-3" />
                              <span>{entry.switchName}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="font-mono">{entry.switchPort}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(entry.seenAt).toLocaleString("pl-PL")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NetworkView;
