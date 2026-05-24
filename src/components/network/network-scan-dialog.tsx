import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Check, Network } from "lucide-react";
import { useAvailableSubnets, useTriggerNetworkScan } from "@/hooks/network/useNetwork";
import { cn } from "@/lib/utils";

interface NetworkScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NetworkScanDialog({ open, onOpenChange }: NetworkScanDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { data: subnets, isLoading: loadingSubnets } = useAvailableSubnets(open);
  const { triggerScan, isLoading: scanning } = useTriggerNetworkScan();

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
    if (!v) setSelected(new Set());
  };

  const toggle = (subnet: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(subnet) ? next.delete(subnet) : next.add(subnet);
      return next;
    });
  };

  const handleScan = async () => {
    try {
      await triggerScan([...selected]);
      handleOpenChange(false);
    } catch {
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm gap-4">
        <DialogHeader>
          <DialogTitle>Wybierz sieci do skanowania</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto rounded-md border bg-background">
          {loadingSubnets ? (
            <div className="flex items-center justify-center py-6">
              <Spinner />
            </div>
          ) : subnets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nie wykryto żadnych sieci na serwerze.
            </p>
          ) : (
            subnets.map((s) => {
              const isSelected = selected.has(s.subnet);
              return (
                <button
                  key={s.subnet}
                  type="button"
                  onClick={() => toggle(s.subnet)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer",
                    "hover:bg-muted/60",
                    isSelected && "bg-muted",
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full shrink-0",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}>
                    {isSelected
                      ? <Check className="w-3.5 h-3.5" />
                      : <Network className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium font-mono leading-tight">{s.subnet}</span>
                    <span className="text-xs text-muted-foreground truncate">{s.interfaceName}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm" disabled={scanning}>
              Anuluj
            </Button>
          </DialogClose>
          <Button
            size="sm"
            disabled={selected.size === 0 || loadingSubnets || scanning}
            onClick={handleScan}
          >
            Skanuj {selected.size > 0 && `(${selected.size})`} {scanning && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
