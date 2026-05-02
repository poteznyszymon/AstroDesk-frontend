import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import type { Table } from "@tanstack/react-table";
import { useTickets } from "@/hooks/ticket/useTickets";
import AddTicketDialog from "./add-ticket-dialog";
import { ticketStatuses, ticketPriorities, statusConfig, priorityConfig, type TicketStatus, type TicketPriority } from "@/types/tickets";
import { CalendarIcon, Monitor, X, Download, Upload, ChevronDown } from "lucide-react";
import { exportTickets } from "@/lib/export";
import { validateTicketsImport, importTickets as importTicketsApi } from "@/hooks/ticket/api.ticket";
import { ExportDialog } from "@/components/shared/export-dialog";
import { ImportDialog } from "@/components/shared/import-dialog";
import { useMemo, useState } from "react";
import { useAdmin } from "@/data/mock/admin-context";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { queryClient } from "@/main";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function TicketTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const { isTicketAdmin: adminView } = useAdmin();
  const { data, isLoading } = useTickets();
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const assignees = useMemo(() => {
    const tickets = data ?? [];
    return [...new Map(
      tickets
        .filter((t) => t.assignee != null)
        .map((t) => [t.assignee!.username, t.assignee!])
    ).values()];
  }, [data]);

  const titleFilter = (table.getColumn("title")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";
  const priorityFilter = (table.getColumn("priority")?.getFilterValue() as string) ?? "";
  const assigneeFilter = (table.getColumn("assignee")?.getFilterValue() as string) ?? "";
  const dateRange = (table.getColumn("date")?.getFilterValue() as DateRange | undefined);
  const linkedFilter = (table.getColumn("linkedInventoryId")?.getFilterValue() as boolean) === true;

  const isFiltered =
    titleFilter !== "" ||
    statusFilter !== "" ||
    priorityFilter !== "" ||
    assigneeFilter !== "" ||
    !!dateRange?.from ||
    linkedFilter;

  const clearFilters = () => {
    table.getColumn("title")?.setFilterValue("");
    table.getColumn("status")?.setFilterValue("");
    table.getColumn("priority")?.setFilterValue("");
    table.getColumn("assignee")?.setFilterValue("");
    table.getColumn("date")?.setFilterValue(undefined);
    table.getColumn("linkedInventoryId")?.setFilterValue(undefined);
  };

  return (
    <div className={`flex items-start gap-2 flex-col sm:flex-row flex-wrap ${adminView ? "justify-between" : "justify-end"}`}>
      {adminView && <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
        <Input
          disabled={isLoading}
          placeholder="Szukaj po tytule"
          value={titleFilter}
          onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
          className="h-8 w-full sm:w-[220px]"
        />

        <Select
          disabled={isLoading}
          value={statusFilter}
          onValueChange={(val) => table.getColumn("status")?.setFilterValue(val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="h-8 w-full sm:w-[130px]" size="sm">
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
          disabled={isLoading}
          value={priorityFilter}
          onValueChange={(val) => table.getColumn("priority")?.setFilterValue(val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="h-8 w-full sm:w-[120px]" size="sm">
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

        <Select
          disabled={isLoading || assignees.length === 0}
          value={assigneeFilter}
          onValueChange={(val) => table.getColumn("assignee")?.setFilterValue(val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="h-8 w-full sm:w-[150px]" size="sm">
            <SelectValue placeholder="Przypisany" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Wszyscy</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a.username} value={a.username}>
                {`${a.firstName} ${a.lastName}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              className={`h-8 gap-1.5 w-full sm:w-auto font-normal ${dateRange?.from ? "border-primary" : ""}`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd.MM.yyyy", { locale: pl })} –{" "}
                    {format(dateRange.to, "dd.MM.yyyy", { locale: pl })}
                  </>
                ) : (
                  format(dateRange.from, "dd.MM.yyyy", { locale: pl })
                )
              ) : (
                "Zakres dat"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => table.getColumn("date")?.setFilterValue(range?.from ? range : undefined)}
              numberOfMonths={2}
              locale={pl}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant={linkedFilter ? "secondary" : "outline"}
          size="sm"
          disabled={isLoading}
          className="h-8 gap-1.5"
          onClick={() => table.getColumn("linkedInventoryId")?.setFilterValue(linkedFilter ? undefined : true)}
        >
          <Monitor className="h-3.5 w-3.5" />
          Z urządzeniem
        </Button>

        {isFiltered && (
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clearFilters} disabled={isLoading}>
            <X className="h-4 w-4" />
            Resetuj
          </Button>
        )}
      </div>}

      <div className="flex items-center gap-2 w-full sm:w-fit justify-end">
        {adminView && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 flex-1 sm:flex-none">
                Dane
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setExportOpen(true)}>
                <Download className="h-3.5 w-3.5 mr-2" />
                Eksportuj
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportOpen(true)}>
                <Upload className="h-3.5 w-3.5 mr-2" />
                Importuj
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <AddTicketDialog triggerClassName="flex-1 sm:flex-none" />
      </div>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        rowCount={data?.length ?? 0}
        onExport={(format) => exportTickets(format)}
      />

      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        validateFn={(file) => validateTicketsImport(file)}
        importFn={(file, skipErrors) => importTicketsApi(file, skipErrors)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tickets'] })}
      />
    </div>
  );
}
