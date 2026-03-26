import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";
import { useMe } from "@/hooks/auth/useAuth";
import { useTickets } from "@/hooks/ticket/useTIcekts";
import AddTicketDialog from "./add-ticket-dialog";
import { ticketStatuses, ticketPriorities, statusConfig, priorityConfig, type TicketStatus, type TicketPriority } from "@/types/tickets";
import { X } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function TicketTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const { user } = useMe();
  const { isLoading } = useTickets(user?.name);

  const titleFilter = (table.getColumn("title")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";
  const priorityFilter = (table.getColumn("priority")?.getFilterValue() as string) ?? "";

  const isFiltered = titleFilter !== "" || statusFilter !== "" || priorityFilter !== "";

  const clearFilters = () => {
    table.getColumn("title")?.setFilterValue("");
    table.getColumn("status")?.setFilterValue("");
    table.getColumn("priority")?.setFilterValue("");
  };

  return (
    <div className="flex items-center gap-2 justify-between flex-col xs:flex-row flex-wrap">
      <div className="flex items-center gap-2 flex-wrap w-full xs:w-auto">
        <Input
          disabled={isLoading}
          placeholder="Szukaj po tytule..."
          value={titleFilter}
          onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
          className="h-8 w-full sm:w-[180px]"
        />

        <Select
          value={statusFilter}
          onValueChange={(val) =>
            table.getColumn("status")?.setFilterValue(val === "ALL" ? "" : val)
          }
        >
          <SelectTrigger className="h-8 w-full sm:w-[140px]" size="sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Wszystkie statusy</SelectItem>
            {ticketStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {statusConfig[status as TicketStatus].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(val) =>
            table.getColumn("priority")?.setFilterValue(val === "ALL" ? "" : val)
          }
        >
          <SelectTrigger className="h-8 w-full w-full sm:w-[140px]" size="sm">
            <SelectValue placeholder="Priorytet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Wszystkie priorytety</SelectItem>
            {ticketPriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priorityConfig[priority as TicketPriority].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clearFilters}>
            <X className="h-4 w-4" />
            Resetuj
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 w-full justify-between xs:w-fit">
        <AddTicketDialog />
      </div>
    </div>
  );
}
