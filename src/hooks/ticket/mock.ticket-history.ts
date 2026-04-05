import type { HistoryEntry } from '@/types/history';

export const mockTicketHistory: Record<number, HistoryEntry[]> = {
  1: [
    { id: 'th-001-1', author: 'Jan Kowalski', timestamp: '2025-12-01T09:00:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-001-2', author: 'admin', timestamp: '2025-12-01T10:30:00Z', type: 'assigned', description: 'Zgłoszenie przypisano do Jan Kowalski.', to: 'Jan Kowalski' },
    { id: 'th-001-3', author: 'Jan Kowalski', timestamp: '2025-12-01T11:15:00Z', type: 'linked_device', description: 'Powiązano urządzenie: MacBook Pro 14 M3.', to: 'MacBook Pro 14 M3' },
  ],
  2: [
    { id: 'th-002-1', author: 'Marek Dąbrowski', timestamp: '2025-11-30T08:30:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-002-2', author: 'admin', timestamp: '2025-11-30T14:00:00Z', type: 'assigned', description: 'Zgłoszenie przypisano do Anna Nowak.', to: 'Anna Nowak' },
    { id: 'th-002-3', author: 'Anna Nowak', timestamp: '2025-11-30T15:30:00Z', type: 'status_changed', description: 'Zmieniono status zgłoszenia.', from: 'Otwarty', to: 'W trakcie' },
    { id: 'th-002-4', author: 'Anna Nowak', timestamp: '2025-12-01T09:00:00Z', type: 'linked_device', description: 'Powiązano urządzenie: Epson EcoTank ET-4850.', to: 'Epson EcoTank ET-4850' },
  ],
  3: [
    { id: 'th-003-1', author: 'Jan Kowalski', timestamp: '2025-11-29T10:00:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-003-2', author: 'Jan Kowalski', timestamp: '2025-11-29T10:05:00Z', type: 'priority_changed', description: 'Zmieniono priorytet zgłoszenia.', from: 'Średni', to: 'Wysoki' },
  ],
  4: [
    { id: 'th-004-1', author: 'Anna Nowak', timestamp: '2025-11-28T09:00:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-004-2', author: 'admin', timestamp: '2025-11-28T11:00:00Z', type: 'assigned', description: 'Zgłoszenie przypisano do Jan Kowalski.', to: 'Jan Kowalski' },
    { id: 'th-004-3', author: 'Jan Kowalski', timestamp: '2025-11-28T11:30:00Z', type: 'linked_device', description: 'Powiązano urządzenie: Dell OptiPlex 7090.', to: 'Dell OptiPlex 7090' },
    { id: 'th-004-4', author: 'Jan Kowalski', timestamp: '2025-11-29T09:00:00Z', type: 'status_changed', description: 'Zmieniono status zgłoszenia.', from: 'Otwarty', to: 'W trakcie' },
    { id: 'th-004-5', author: 'Jan Kowalski', timestamp: '2025-11-30T15:00:00Z', type: 'status_changed', description: 'Zmieniono status zgłoszenia.', from: 'W trakcie', to: 'Rozwiązany' },
  ],
  5: [
    { id: 'th-005-1', author: 'Jan Kowalski', timestamp: '2025-11-25T10:00:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-005-2', author: 'admin', timestamp: '2025-11-25T12:00:00Z', type: 'assigned', description: 'Zgłoszenie przypisano do Anna Nowak.', to: 'Anna Nowak' },
    { id: 'th-005-3', author: 'Anna Nowak', timestamp: '2025-11-27T14:00:00Z', type: 'status_changed', description: 'Zmieniono status zgłoszenia.', from: 'W trakcie', to: 'Zamknięty' },
  ],
  6: [
    { id: 'th-006-1', author: 'Piotr Wiśniewski', timestamp: '2025-12-02T08:00:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-006-2', author: 'admin', timestamp: '2025-12-02T09:30:00Z', type: 'assigned', description: 'Zgłoszenie przypisano do Katarzyna Zielińska.', to: 'Katarzyna Zielińska' },
  ],
  7: [
    { id: 'th-007-1', author: 'Katarzyna Zielińska', timestamp: '2025-12-01T08:00:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-007-2', author: 'admin', timestamp: '2025-12-01T10:00:00Z', type: 'assigned', description: 'Zgłoszenie przypisano do Marek Dąbrowski.', to: 'Marek Dąbrowski' },
    { id: 'th-007-3', author: 'Marek Dąbrowski', timestamp: '2025-12-02T09:00:00Z', type: 'status_changed', description: 'Zmieniono status zgłoszenia.', from: 'Otwarty', to: 'W trakcie' },
  ],
  8: [
    { id: 'th-008-1', author: 'Jan Kowalski', timestamp: '2025-12-01T07:30:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-008-2', author: 'Jan Kowalski', timestamp: '2025-12-01T07:32:00Z', type: 'priority_changed', description: 'Zmieniono priorytet zgłoszenia.', from: 'Średni', to: 'Wysoki' },
    { id: 'th-008-3', author: 'admin', timestamp: '2025-12-01T08:00:00Z', type: 'assigned', description: 'Zgłoszenie przypisano do Piotr Wiśniewski.', to: 'Piotr Wiśniewski' },
  ],
  9: [
    { id: 'th-009-1', author: 'Michał Anioł', timestamp: '2025-11-27T10:00:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-009-2', author: 'admin', timestamp: '2025-11-27T11:00:00Z', type: 'assigned', description: 'Zgłoszenie przypisano do Jan Kowalski.', to: 'Jan Kowalski' },
    { id: 'th-009-3', author: 'Jan Kowalski', timestamp: '2025-11-28T15:00:00Z', type: 'status_changed', description: 'Zmieniono status zgłoszenia.', from: 'Otwarty', to: 'Rozwiązany' },
  ],
  10: [
    { id: 'th-010-1', author: 'Ewa Bema', timestamp: '2025-11-26T09:00:00Z', type: 'created', description: 'Zgłoszenie zostało utworzone.' },
    { id: 'th-010-2', author: 'admin', timestamp: '2025-11-26T10:00:00Z', type: 'assigned', description: 'Zgłoszenie przypisano do Anna Nowak.', to: 'Anna Nowak' },
    { id: 'th-010-3', author: 'Anna Nowak', timestamp: '2025-11-27T16:00:00Z', type: 'status_changed', description: 'Zmieniono status zgłoszenia.', from: 'W trakcie', to: 'Zamknięty' },
  ],
};

const defaultHistory = (ticketId: number): HistoryEntry[] => [
  { id: `th-${ticketId}-1`, author: 'system', timestamp: new Date('2025-11-26T09:00:00Z').toISOString(), type: 'created', description: 'Zgłoszenie zostało utworzone.' },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getTicketHistoryMock = async (id: string): Promise<HistoryEntry[]> => {
  await delay(300);
  const numId = Number(id);
  return [...(mockTicketHistory[numId] ?? defaultHistory(numId))].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
