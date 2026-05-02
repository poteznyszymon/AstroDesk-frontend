import { useQuery } from "@tanstack/react-query";
import { getAllHistory } from "./api.history";
import type { HistoryQuery } from "@/types/history";
import { useMemo } from "react";

const HISTORY_KEY = "history";

export const useAllHistory = (query: Pick<HistoryQuery, "targetType" | "changedBy" | "targetId">) => {
    const { data, isLoading } = useQuery({
        queryKey: [HISTORY_KEY],
        queryFn: getAllHistory,
    });

    const filtered = useMemo(() => {
        if (!data) return [];
        return data.filter((r) => {
            if (query.targetType && r.targetType !== query.targetType) return false;
            if (query.targetId !== undefined && r.targetId !== query.targetId) return false;
            if (query.changedBy && !r.changedBy.toLowerCase().includes(query.changedBy.toLowerCase())) return false;
            return true;
        });
    }, [data, query.targetType, query.targetId, query.changedBy]);

    return { data: filtered, total: data?.length ?? 0, isLoading };
};
