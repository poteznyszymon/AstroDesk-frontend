export type HistoryEntryType =
  | 'created'
  | 'status_changed'
  | 'priority_changed'
  | 'assigned'
  | 'unassigned'
  | 'edited'
  | 'linked_device'
  | 'returned'
  | 'sent_to_service'
  | 'disposed';

export interface HistoryEntry {
  id: string;
  author: string;
  timestamp: string;
  type: HistoryEntryType;
  description: string;
  from?: string;
  to?: string;
}

export type HistoryTargetType = 'INVENTORY' | 'TICKET';

export interface HistoryRecord {
  id: number;
  targetType: HistoryTargetType;
  targetId: number;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  message: string | null;
  changedBy: string;
  changedAt: string;
}

export interface HistoryQuery {
  targetType?: HistoryTargetType;
  targetId?: number;
  changedBy?: string;
  fieldName?: string;
  dateFrom?: string;
  dateTo?: string;
}
