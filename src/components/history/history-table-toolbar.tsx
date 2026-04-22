import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Download } from "lucide-react";
import type { HistoryQuery, HistoryRecord, HistoryTargetType } from "@/types/history";
import { ExportDialog } from "@/components/shared/export-dialog";
import { exportHistory } from "@/lib/export";

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

  return (
    <div className="flex items-start gap-2 flex-col sm:flex-row flex-wrap justify-between">
      <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
        <Input
          disabled={isLoading}
          placeholder="Autor (login)"
          value={query.changedBy ?? ""}
          onChange={(e) => onChange({ changedBy: e.target.value || undefined })}
          className="h-8 w-full sm:w-[220px]"
        />

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
          className="h-8 w-full sm:w-[140px]"
        />

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
