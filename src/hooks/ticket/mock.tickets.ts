import type { Ticket } from "@/types/tickets";
import { statusConfig, priorityConfig } from "@/types/tickets";
import { mockTicketHistory } from "./mock.ticket-history";
import type { HistoryEntry } from "@/types/history";

let historyIdCounter = 1000;
const nextHistoryId = () => `th-gen-${historyIdCounter++}`;

function pushHistory(ticketId: string, entry: Omit<HistoryEntry, 'id'>) {
  if (!mockTicketHistory[ticketId]) mockTicketHistory[ticketId] = [];
  mockTicketHistory[ticketId].unshift({ ...entry, id: nextHistoryId() });
}

export const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "Błąd logowania do systemu",
    description: "Użytkownik nie może się zalogować do panelu administracyjnego.",
    status: "open",
    priority: "high",
    assignee: "Jan Kowalski",
    createdBy: "Jan Kowalski",
    createdAt: "2025-12-01",
    updatedAt: "2025-12-01",
    linkedInventoryId: 10,
  },
  {
    id: "TKT-002",
    title: "Awaria drukarki w magazynie",
    description: "Drukarka Epson nie drukuje etykiet.",
    status: "in-progress",
    priority: "medium",
    assignee: "Anna Nowak",
    createdBy: "Marek Dąbrowski",
    createdAt: "2025-11-30",
    updatedAt: "2025-12-01",
    linkedInventoryId: 11,
  },
  {
    id: "TKT-003",
    title: "Problem z połączeniem Wi-Fi",
    description: "Słaby sygnał Wi-Fi na drugim piętrze.",
    status: "open",
    priority: "critical",
    assignee: null,
    createdBy: "Jan Kowalski",
    createdAt: "2025-11-29",
    updatedAt: "2025-12-01",
    linkedInventoryId: null,
  },
  {
    id: "TKT-004",
    title: "Aktualizacja systemu operacyjnego",
    description: "Wymagana aktualizacja Windows na komputerach w dziale HR.",
    status: "resolved",
    priority: "low",
    assignee: "Jan Kowalski",
    createdBy: "Anna Nowak",
    createdAt: "2025-11-28",
    updatedAt: "2025-11-30",
    linkedInventoryId: 9,
  },
  {
    id: "TKT-005",
    title: "Brak dostępu do dysku sieciowego",
    description: "Pracownicy nie widzą udziału sieciowego na serwerze NAS.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdBy: "Jan Kowalski",
    createdAt: "2025-11-25",
    updatedAt: "2025-11-27",
    linkedInventoryId: null,
  },
  {
    id: "TKT-006",
    title: "Zgłoszenie nowego pracownika",
    description: "Potrzebne konto i dostęp do systemów dla nowego pracownika.",
    status: "open",
    priority: "medium",
    assignee: "Katarzyna Zielińska",
    createdBy: "Piotr Wiśniewski",
    createdAt: "2025-12-02",
    updatedAt: "2025-12-02",
    linkedInventoryId: null,
  },
  {
    id: "TKT-007",
    title: "Problem z aplikacją mobilną",
    description: "Aplikacja mobilna nie synchronizuje danych.",
    status: "in-progress",
    priority: "high",
    assignee: "Marek Dąbrowski",
    createdBy: "Katarzyna Zielińska",
    createdAt: "2025-12-01",
    updatedAt: "2025-12-02",
    linkedInventoryId: null,
  },
  {
    id: "TKT-008",
    title: "Awaria serwera poczty",
    description: "Brak możliwości wysyłania maili przez pracowników.",
    status: "open",
    priority: "critical",
    assignee: "Piotr Wiśniewski",
    createdBy: "Jan Kowalski",
    createdAt: "2025-12-01",
    updatedAt: "2025-12-02",
    linkedInventoryId: null,
  },
  {
    id: "TKT-009",
    title: "Prośba o dostęp do VPN",
    description: "Pracownik zdalny potrzebuje dostępu do VPN.",
    status: "resolved",
    priority: "low",
    assignee: "Jan Kowalski",
    createdBy: "Michał Anioł",
    createdAt: "2025-11-27",
    updatedAt: "2025-11-28",
    linkedInventoryId: null,
  },
  {
    id: "TKT-010",
    title: "Problem z wydrukiem faktur",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdBy: "Ewa Bema",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
    linkedInventoryId: null,
  },
  {
    id: "TKT-011",
    title: "Problem z wydrukiem faktur (duplikat)",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdBy: "Jan Kowalski",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
    linkedInventoryId: null,
  },
  {
    id: "TKT-012",
    title: "Problem z wydrukiem faktur (v3)",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdBy: "Robert Lewandowski",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
    linkedInventoryId: null,
  },
  {
    id: "TKT-013",
    title: "Problem z wydrukiem faktur (v4)",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdBy: "Tomasz Kot",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
    linkedInventoryId: null,
  },
  {
    id: "TKT-014",
    title: "Problem z wydrukiem faktur (v5)",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdBy: "Jan Kowalski",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
    linkedInventoryId: null,
  },
  {
    id: "TKT-015",
    title: "Problem z wydrukiem faktur (v6)",
    description: "Faktury nie drukują się poprawnie z systemu ERP.",
    status: "closed",
    priority: "medium",
    assignee: "Anna Nowak",
    createdBy: "Krzysztof Ibisz",
    createdAt: "2025-11-26",
    updatedAt: "2025-11-27",
    linkedInventoryId: null,
  },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getTicketByIdMock = async (id: string): Promise<Ticket> => {
  await delay(400);
  const ticket = mockTickets.find(t => t.id === id);
  if (!ticket) throw new Error(`Ticket ${id} not found`);
  return { ...ticket };
};

export const getTicketsMock = async (
  _currentUser: string = "Jan Kowalski"
): Promise<{ tickets: Ticket[] }> => {
  await delay(1000);
  return { tickets: [...mockTickets] };
};

export const deleteTicketMock = async (id: string) => {
  await delay(1000);
  const idx = mockTickets.findIndex(t => t.id === id);
  if (idx === -1) throw new Error("Ticket not found");
  mockTickets.splice(idx, 1);
  delete mockTicketHistory[id];
};

export const createTicketMock = async (ticket: Omit<Ticket, "id" | "createdAt">) => {
  await delay(500);
  const newTicket: Ticket = {
    ...ticket,
    id: `TKT-${String(mockTickets.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockTickets.unshift(newTicket);
  const now = new Date().toISOString();
  pushHistory(newTicket.id, { author: 'admin', timestamp: now, type: 'created', description: 'Zgłoszenie zostało utworzone.' });
  if (newTicket.assignee) {
    pushHistory(newTicket.id, { author: 'admin', timestamp: now, type: 'assigned', description: `Zgłoszenie przypisano do ${newTicket.assignee}.`, to: newTicket.assignee });
  }
  return newTicket;
};

export const updateTicketMock = async (id: string, updates: Partial<Ticket>) => {
  await delay(500);
  const idx = mockTickets.findIndex(t => t.id === id);
  if (idx === -1) throw new Error("Ticket not found");
  const old = mockTickets[idx];
  mockTickets[idx] = { ...old, ...updates };
  const now = new Date().toISOString();

  if (updates.status !== undefined && updates.status !== old.status) {
    pushHistory(id, { author: 'admin', timestamp: now, type: 'status_changed', description: 'Zmieniono status zgłoszenia.', from: statusConfig[old.status].label, to: statusConfig[updates.status].label });
  }
  if (updates.priority !== undefined && updates.priority !== old.priority) {
    pushHistory(id, { author: 'admin', timestamp: now, type: 'priority_changed', description: 'Zmieniono priorytet zgłoszenia.', from: priorityConfig[old.priority].label, to: priorityConfig[updates.priority].label });
  }
  if ('assignee' in updates && updates.assignee !== old.assignee) {
    if (updates.assignee) {
      pushHistory(id, { author: 'admin', timestamp: now, type: 'assigned', description: `Zgłoszenie przypisano do ${updates.assignee}.`, from: old.assignee ?? undefined, to: updates.assignee });
    } else {
      pushHistory(id, { author: 'admin', timestamp: now, type: 'unassigned', description: 'Usunięto przypisanie zgłoszenia.', from: old.assignee ?? undefined });
    }
  }
  if ('linkedInventoryId' in updates && updates.linkedInventoryId !== old.linkedInventoryId) {
    if (updates.linkedInventoryId) {
      pushHistory(id, { author: 'admin', timestamp: now, type: 'linked_device', description: `Powiązano urządzenie ID: ${updates.linkedInventoryId}.`, to: String(updates.linkedInventoryId) });
    }
  }
  if (
    (updates.title !== undefined && updates.title !== old.title) ||
    (updates.description !== undefined && updates.description !== old.description)
  ) {
    pushHistory(id, { author: 'admin', timestamp: now, type: 'edited', description: 'Edytowano treść zgłoszenia.' });
  }

  return mockTickets[idx];
};
