import { useState, useEffect, useCallback } from "react";
import type { NetworkItem, NetworkHistory } from "@/types/network";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface NetworkFilters {
  hostname?: string;
  macAddress?: string;
  switchName?: string;
  vendors?: string[];
  isImported?: boolean;
}

export function useNetworkDevices(filters: NetworkFilters, page = 0, size = 50) {
  const [data, setData] = useState<NetworkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serialize filters to a stable string so useEffect only fires on real value changes
  const filtersKey = JSON.stringify(filters);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));
      params.set("sort", "lastSeenAt,desc");

      if (filters.hostname) params.set("hostname", filters.hostname);
      if (filters.macAddress) params.set("macAddress", filters.macAddress);
      if (filters.switchName) params.set("switchName", filters.switchName);
      if (filters.vendors?.length) {
        filters.vendors.forEach((v) => params.append("vendors", v));
      }
      if (filters.isImported !== undefined) {
        params.set("isImported", String(filters.isImported));
      }

      const res = await fetch(`/api/network/devices?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json: PageResponse<NetworkItem> = await res.json();
      setData(json.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd pobierania danych");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, page, size]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return { data, isLoading, error, refetch: fetchDevices };
}

export function useNetworkHistory(macAddress: string | null) {
  const [history, setHistory] = useState<NetworkHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!macAddress) {
      setHistory([]);
      return;
    }
    setIsLoading(true);
    fetch(`/api/network/devices/${encodeURIComponent(macAddress)}/history`)
      .then((res) => res.json())
      .then((data: NetworkHistory[]) => setHistory(data))
      .catch(() => setHistory([]))
      .finally(() => setIsLoading(false));
  }, [macAddress]);

  return { history, isLoading };
}

export async function triggerNetworkScan(): Promise<void> {
  const res = await fetch("/api/network/scan", { method: "POST" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
