import type { HistoryEntry } from '@/types/history';

export const mockInventoryHistory: Record<number, HistoryEntry[]> = {
  1: [
    { id: 'ih-1-1', author: 'admin', timestamp: '2024-03-01T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-1-2', author: 'admin', timestamp: '2024-03-15T09:30:00Z', type: 'assigned', description: 'Sprzęt wydano użytkownikowi dr hab. Jan Kowalski.', to: 'dr hab. Jan Kowalski' },
  ],
  2: [
    { id: 'ih-2-1', author: 'admin', timestamp: '2024-01-05T09:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-2-2', author: 'admin', timestamp: '2024-01-10T11:00:00Z', type: 'assigned', description: 'Sprzęt wydano użytkownikowi mgr Anna Nowak.', to: 'mgr Anna Nowak' },
  ],
  3: [
    { id: 'ih-3-1', author: 'admin', timestamp: '2023-06-10T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-3-2', author: 'admin', timestamp: '2024-11-20T10:30:00Z', type: 'sent_to_service', description: 'Sprzęt oddany do serwisu.' },
  ],
  4: [
    { id: 'ih-4-1', author: 'admin', timestamp: '2023-09-15T08:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
  ],
  5: [
    { id: 'ih-5-1', author: 'admin', timestamp: '2022-04-20T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-5-2', author: 'admin', timestamp: '2022-04-21T08:00:00Z', type: 'status_changed', description: 'Zmieniono status sprzętu.', from: 'Dostępne', to: 'Zajęte' },
  ],
  6: [
    { id: 'ih-6-1', author: 'admin', timestamp: '2023-11-01T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-6-2', author: 'admin', timestamp: '2023-11-05T09:00:00Z', type: 'assigned', description: 'Sprzęt wydano użytkownikowi mgr inż. Katarzyna Zielińska.', to: 'mgr inż. Katarzyna Zielińska' },
  ],
  7: [
    { id: 'ih-7-1', author: 'admin', timestamp: '2024-02-14T12:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
  ],
  8: [
    { id: 'ih-8-1', author: 'admin', timestamp: '2024-07-01T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-8-2', author: 'admin', timestamp: '2024-07-05T09:00:00Z', type: 'assigned', description: 'Sprzęt wydano użytkownikowi dr inż. Tomasz Lewandowski.', to: 'dr inż. Tomasz Lewandowski' },
  ],
  9: [
    { id: 'ih-9-1', author: 'admin', timestamp: '2023-03-12T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-9-2', author: 'admin', timestamp: '2023-08-01T09:00:00Z', type: 'assigned', description: 'Sprzęt wydano użytkownikowi Laboratorium 203.', to: 'Laboratorium 203' },
    { id: 'ih-9-3', author: 'admin', timestamp: '2023-09-15T14:00:00Z', type: 'returned', description: 'Sprzęt zwrócony do magazynu przez Laboratorium 203.', from: 'Laboratorium 203' },
  ],
  10: [
    { id: 'ih-10-1', author: 'admin', timestamp: '2024-10-01T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-10-2', author: 'admin', timestamp: '2024-10-03T09:00:00Z', type: 'assigned', description: 'Sprzęt wydano użytkownikowi Jan Kowalski.', to: 'Jan Kowalski' },
  ],
  11: [
    { id: 'ih-11-1', author: 'admin', timestamp: '2024-01-20T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
  ],
  12: [
    { id: 'ih-12-1', author: 'admin', timestamp: '2021-05-10T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-12-2', author: 'admin', timestamp: '2021-05-11T09:00:00Z', type: 'assigned', description: 'Sprzęt wydano użytkownikowi Dział IT.', to: 'Dział IT' },
    { id: 'ih-12-3', author: 'admin', timestamp: '2023-05-20T11:00:00Z', type: 'returned', description: 'Sprzęt zwrócony do magazynu przez Dział IT.', from: 'Dział IT' },
    { id: 'ih-12-4', author: 'admin', timestamp: '2023-06-01T09:00:00Z', type: 'disposed', description: 'Sprzęt przeznaczony do utylizacji.' },
  ],
  13: [
    { id: 'ih-13-1', author: 'admin', timestamp: '2024-04-01T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-13-2', author: 'admin', timestamp: '2024-04-01T11:00:00Z', type: 'status_changed', description: 'Zmieniono status sprzętu.', from: 'Dostępne', to: 'Do wydania' },
  ],
  14: [
    { id: 'ih-14-1', author: 'admin', timestamp: '2023-08-22T13:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-14-2', author: 'admin', timestamp: '2023-08-22T13:30:00Z', type: 'status_changed', description: 'Zmieniono status sprzętu.', from: 'Dostępne', to: 'Przyjęty' },
  ],
  15: [
    { id: 'ih-15-1', author: 'admin', timestamp: '2022-11-05T10:00:00Z', type: 'created', description: 'Sprzęt został dodany do inwentarza.' },
    { id: 'ih-15-2', author: 'admin', timestamp: '2022-11-06T08:00:00Z', type: 'status_changed', description: 'Zmieniono status sprzętu.', from: 'Dostępne', to: 'W trakcie' },
  ],
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getInventoryHistoryMock = async (id: number): Promise<HistoryEntry[]> => {
  await delay(300);
  const entries = mockInventoryHistory[id] ?? [
    { id: `ih-${id}-1`, author: 'admin', timestamp: new Date().toISOString(), type: 'created' as const, description: 'Sprzęt został dodany do inwentarza.' },
  ];
  return [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
