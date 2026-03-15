export interface NetworkItem {
  id: string;
  ipAddress: string;
  macAddress: string;
  hostname: string | null;
  vendor: string | null;
  lastSeenAt: string; // ISO datetime string
  isImported: boolean;
  linkedAssetId: string | null;
  linkedAssetName: string | null;
  // port info from switch scan
  switchName: string | null;
  switchPort: string | null;
}

export interface NetworkItemHistory {
  id: string;
  macAddress: string;
  ipAddress: string;
  switchName: string;
  switchPort: string;
  seenAt: string; // ISO datetime string
}
