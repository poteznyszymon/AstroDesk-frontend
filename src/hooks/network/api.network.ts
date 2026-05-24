import { api } from "@/lib/api";
import type { NetworkItem, NetworkHistory, SubnetInfo } from "@/types/network";

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

const buildDeviceQuery = (filters: NetworkFilters, page: number, size: number) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sort", "lastSeenAt,desc");

  if (filters.hostname) params.set("hostname", filters.hostname);
  if (filters.macAddress) params.set("macAddress", filters.macAddress);
  if (filters.switchName) params.set("switchName", filters.switchName);
  filters.vendors?.forEach((v) => params.append("vendors", v));
  if (filters.isImported !== undefined) params.set("isImported", String(filters.isImported));

  return params.toString();
};

export const getNetworkDevices = async (
  filters: NetworkFilters,
  page = 0,
  size = 50,
): Promise<NetworkItem[]> => {
  const res = await api.get<PageResponse<NetworkItem>>(
    `/api/network/devices?${buildDeviceQuery(filters, page, size)}`,
  );
  return res.content;
};

export const getNetworkHistory = (macAddress: string): Promise<NetworkHistory[]> =>
  api.get<NetworkHistory[]>(`/api/network/devices/${encodeURIComponent(macAddress)}/history`);

export const getAvailableSubnets = (): Promise<SubnetInfo[]> =>
  api.get<SubnetInfo[]>("/api/network/available-subnets");

export const triggerNetworkScan = (subnets: string[]): Promise<void> =>
  api.post<void>("/api/network/scan", { subnets });

export const updateNetworkDeviceHostname = (
  deviceId: number,
  hostname: string,
): Promise<NetworkItem> =>
  api.patch<NetworkItem>(`/api/network/devices/${deviceId}/hostname`, { hostname });
