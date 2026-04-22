import { api } from "@/lib/api";
import type { HistoryRecord } from "@/types/history";

export const getAllHistory = (): Promise<HistoryRecord[]> =>
    api.get<HistoryRecord[]>("/history");
