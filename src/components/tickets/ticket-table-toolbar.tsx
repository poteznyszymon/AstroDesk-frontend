import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";
import { useMe } from "@/hooks/auth/useAuth";
import { useTickets } from "@/hooks/ticket/useTIcekts";
import AddTicketDialog from "./add-ticket-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function TicketTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {

  const { user } = useMe();
  const { isLoading } = useTickets(user?.name);

  return (
    <div className="flex items-center gap-4 justify-between flex-col xs:flex-row">
      <Input
        disabled={isLoading}
        placeholder="Szukaj po tytule..."
        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
        className="sm:max-w-sm w-full"
      />
      <div className="flex items-center gap-4 w-full justify-between xs:w-fit">
        <AddTicketDialog />
      </div>
    </div>
  );
}
