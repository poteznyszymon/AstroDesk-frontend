import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/data/mock/admin-context";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function NetworkTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const { adminView } = useAdmin();

  return (
    <div className="flex items-center gap-4 justify-between flex-col xs:flex-row">
      <Input
        placeholder="Szukaj po IP, MAC, hostname..."
        value={(table.getColumn("ipAddress")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("ipAddress")?.setFilterValue(event.target.value)}
        className="sm:max-w-sm w-full"
      />
      <div className="flex items-center gap-4 w-full justify-between xs:w-fit">
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
  );
}
