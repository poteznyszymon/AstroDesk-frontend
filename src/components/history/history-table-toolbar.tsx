import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { X, Download, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HistoryQuery, HistoryRecord, HistoryTargetType } from "@/types/history";
import { ExportDialog } from "@/components/shared/export-dialog";
import { exportHistory } from "@/lib/export";
import { useUsers } from "@/hooks/user/useUsers";

type HistoryFilters = Pick<HistoryQuery, "targetType" | "changedBy" | "targetId">;

interface Props {
  query: HistoryFilters;
  onChange: (patch: Partial<HistoryFilters>) => void;
  onReset: () => void;
  isLoading: boolean;
  data: HistoryRecord[];
}

export function HistoryTableToolbar({ query, onChange, onReset, isLoading, data }: Props) {
  const isFiltered = !!(query.targetType || query.changedBy || query.targetId);
  const [exportOpen, setExportOpen] = useState(false);
  const [authorOpen, setAuthorOpen] = useState(false);
  const { data: users } = useUsers();

  const selectedUser = users?.find((u) => u.username === query.changedBy);
  const authorLabel = selectedUser
    ? `${selectedUser.firstName} ${selectedUser.lastName}`
    : "Autor";

  return (
    <div className="flex items-start gap-2 flex-col sm:flex-row flex-wrap justify-between">
      <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
        <Select
          disabled={isLoading}
          value={query.targetType ?? "ALL"}
          onValueChange={(val) => onChange({ targetType: val === "ALL" ? undefined : (val as HistoryTargetType) })}
        >
          <SelectTrigger className="h-8 w-full sm:w-[150px]" size="sm">
            <SelectValue placeholder="Typ obiektu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Wszystkie typy</SelectItem>
            <SelectItem value="INVENTORY">Sprzęt</SelectItem>
            <SelectItem value="TICKET">Ticket</SelectItem>
          </SelectContent>
        </Select>

        <Input
          disabled={isLoading}
          type="number"
          placeholder="ID obiektu"
          value={query.targetId ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ targetId: v ? Number(v) : undefined });
          }}
          className="h-8 w-full sm:w-[140px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <Popover open={authorOpen} onOpenChange={setAuthorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              className={cn("h-8 w-full sm:w-[180px] justify-between font-normal", query.changedBy && "border-primary")}
            >
              <span className={cn("truncate", !query.changedBy && "text-muted-foreground")}>{authorLabel}</span>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Szukaj użytkownika..." />
              <CommandList>
                <CommandEmpty>Nie znaleziono.</CommandEmpty>
                <CommandGroup>
                  {(users ?? []).map((u) => (
                    <CommandItem
                      key={u.username}
                      value={`${u.firstName} ${u.lastName}`}
                      onSelect={() => {
                        onChange({ changedBy: query.changedBy === u.username ? undefined : u.username });
                        setAuthorOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", query.changedBy === u.username ? "opacity-100" : "opacity-0")} />
                      {u.firstName} {u.lastName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {isFiltered && (
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onReset} disabled={isLoading}>
            <X className="h-4 w-4" />
            Resetuj
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 w-full sm:w-auto"
        disabled={isLoading || data.length === 0}
        onClick={() => setExportOpen(true)}
      >
        <Download className="h-3.5 w-3.5" />
        Eksportuj
      </Button>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        rowCount={data.length}
        onExport={(format) => exportHistory(data, format)}
      />
    </div>
  );
}
