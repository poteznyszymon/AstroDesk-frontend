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
