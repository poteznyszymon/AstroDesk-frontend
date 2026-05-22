export interface NetworkItem {
  id: number;
  ipAddress: string;
  macAddress: string;
  hostname: string | null;
  vendor: string | null;
  lastSeenAt: string;
  switchName: string | null;
  switchPort: string | null;
}

export interface NetworkHistory {
  id: number;
  macAddress: string;
  ipAddress: string;
  switchName: string | null;
  switchPort: string | null;
  seenAt: string;
}

export interface SubnetInfo {
  interfaceName: string;
  subnet: string;
}
