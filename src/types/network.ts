export interface NetworkItem {
  id: number;
  ipAddress: string;
  macAddress: string;
  hostname: string | null;
  vendor: string | null;
  openPorts: string | null;
  lastSeenAt: string;
}

export interface NetworkHistory {
  id: number;
  macAddress: string;
  ipAddress: string;
  seenAt: string;
}

export interface SubnetInfo {
  interfaceName: string;
  subnet: string;
}
