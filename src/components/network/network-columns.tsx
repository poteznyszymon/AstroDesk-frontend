import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { NetworkItem } from "@/types/network";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Link as LinkIcon, Unlink, Laptop, Monitor, Printer, Server, HardDrive, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const getVendorIcon = (vendor: string | null) => {
  if (!vendor) return HardDrive;
  const v = vendor.toLowerCase();
  if (v.includes("apple") || v.includes("dell") || v.includes("lenovo") || v.includes("hp") || v.includes("asus") || v.includes("acer")) return Laptop;
  if (v.includes("cisco") || v.includes("mikrotik") || v.includes("tp-link")) return Server;
  if (v.includes("canon") || v.includes("epson") || v.includes("brother")) return Printer;
  if (v.includes("samsung") && !v.includes("server")) return Monitor;
  return HardDrive;
};

// Dodaliśmy prop onShowHistory
function ActionsCell({ item, onShowHistory }: { item: NetworkItem; onShowHistory: (item: NetworkItem) => void }) {
  const navigate = useNavigate();

  const handleGoToAsset = (e: React.MouseEvent) => {
    e.stopPropagation(); // Zapobiegamy otwarciu bocznego panelu przy przechodzeniu do zasobu
    if (!item.isImported) {
      toast.error("Zasób nie jest powiązany z żadnym urządzeniem w inwentaryzacji.");
      return;
    }
    navigate({ to: "/inventory" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
          <span className="sr-only">Otwórz menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onShowHistory(item)}>
          <History className="mr-2 h-4 w-4" />
          Pokaż historię
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleGoToAsset}>
          <LinkIcon className="mr-2 h-4 w-4" />
          Przejdź do zasobu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Dodajemy parametr onRowAction do generatora kolumn
export const getNetworkColumns = (onRowAction: (item: NetworkItem) => void): ColumnDef<NetworkItem>[] => {
  return [
    {
      accessorKey: "macAddress",
      header: "Adres MAC",
      cell: ({ row }) => {
        const VendorIcon = getVendorIcon(row.original.vendor);
        return (
          <div className="flex items-center gap-2 ml-3">
            <VendorIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-mono font-medium text-sm">{row.getValue("macAddress")}</div>
              <div className="font-mono text-xs text-muted-foreground">{row.original.ipAddress}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "hostname",
      header: "Hostname",
      cell: ({ row }) => {
        const hostname = row.getValue("hostname") as string | null;
        return hostname ? <span className="text-sm">{hostname}</span> : <span className="text-muted-foreground text-sm">—</span>;
      },
    },
    {
      accessorKey: "vendor",
      header: "Producent",
      cell: ({ row }) => {
        const vendor = row.getValue("vendor") as string | null;
        return vendor ? <span className="text-sm">{vendor}</span> : <span className="text-muted-foreground text-sm">Nieznany</span>;
      },
    },
    {
      accessorKey: "switchName",
      header: "Switch / Port",
      cell: ({ row }) => {
        const sw = row.original.switchName;
        const port = row.original.switchPort;
        return sw ? (
          <div>
            <div className="text-sm font-medium">{sw}</div>
            <div className="text-xs text-muted-foreground font-mono">{port}</div>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      accessorKey: "lastSeenAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
          Ostatnio widziany
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const raw = row.getValue("lastSeenAt") as string;
        const date = new Date(raw);
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString("pl-PL")}</div>
            <div className="text-xs text-muted-foreground">{date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "isImported",
      header: "Status",
      cell: ({ row }) => {
        const imported = row.getValue("isImported") as boolean;
        return imported ? (
          <Badge variant="default" className="gap-1">
            <LinkIcon className="h-3 w-3" />
            Powiązany
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <Unlink className="h-3 w-3" />
            Niepowiązany
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => <ActionsCell item={row.original} onShowHistory={onRowAction} />,
    },
  ];
};
