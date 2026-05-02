import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { useAllHistory } from "@/hooks/history/useHistory";
import { HistoryTableToolbar } from "./history-table-toolbar";
import { getHistoryColumns } from "./history-columns";
import type { HistoryQuery, HistoryRecord } from "@/types/history";

const targetHref = (row: HistoryRecord) =>
  row.targetType === "INVENTORY" ? `/inventory/${row.targetId}` : `/tickets/${row.targetId}`;

export default function HistoryView() {
  const [filters, setFilters] = useState<Pick<HistoryQuery, "targetType" | "changedBy" | "targetId">>({});

  const { data, total, isLoading } = useAllHistory(filters);

  const columns = getHistoryColumns();
  const rows = data ?? [];

  const onFilterChange = (patch: Partial<typeof filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
  };

  const onResetFilters = () => {
    setFilters({});
  };

  return (
    <div className="w-full flex flex-col gap-2 xs:gap-4">
      <HistoryTableToolbar
        query={filters}
        onChange={onFilterChange}
        onReset={onResetFilters}
        isLoading={isLoading}
        data={rows}
        totalCount={total}
      />
      <DataTable
        columns={columns}
        data={rows}
        getRowHref={targetHref}
        isLoading={isLoading}
        initialSorting={[{ id: "changedAt", desc: true }]}
        pageSize={14}
      />
    </div>
  );
}
