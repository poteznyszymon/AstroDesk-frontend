import { useState, useEffect } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Check, Network } from "lucide-react";
import { fetchAvailableSubnets, triggerNetworkScan } from "./use-network";
import type { SubnetInfo } from "@/types/network";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NetworkScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: () => void;
}

export function NetworkScanDialog({ open, onOpenChange, onScanComplete }: NetworkScanDialogProps) {
  const [subnets, setSubnets]               = useState<SubnetInfo[]>([]);
  const [selected, setSelected]             = useState<Set<string>>(new Set());
  const [loadingSubnets, setLoadingSubnets] = useState(false);
  const [scanning, setScanning]             = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingSubnets(true);
    fetchAvailableSubnets()
      .then((data) => {
        setSubnets(data);
        setSelected(new Set(data.map((s) => s.subnet)));
      })
      .catch(() => toast.error("Nie udało się pobrać listy sieci."))
      .finally(() => setLoadingSubnets(false));
  }, [open]);

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setSubnets([]);
      setSelected(new Set());
    }
  };

  const toggle = (subnet: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(subnet) ? next.delete(subnet) : next.add(subnet);
      return next;
    });
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      await triggerNetworkScan([...selected]);
      handleOpenChange(false);
      toast("Skanowanie sieci zostało uruchomione.", {
        action: { label: "Zamknij", onClick: () => {} },
      });
      setTimeout(onScanComplete, 5000);
    } catch {
      toast.error("Nie udało się uruchomić skanowania.");
    } finally {
      setScanning(false);
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
