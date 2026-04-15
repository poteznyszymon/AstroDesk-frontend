import type { Ticket } from "@/types/tickets";
import type { User } from "@/types/user";
import { priorityConfig } from "@/types/tickets";
import { mockTicketHistory } from "./mock.ticket-history";
import type { HistoryEntry } from "@/types/history";

const u = (userId: number, firstName: string, lastName: string): User => ({
  userId,
  username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
  firstName,
  lastName,
  email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
  role: "USER",
});

let historyIdCounter = 1000;
const nextHistoryId = () => `th-gen-${historyIdCounter++}`;

function pushHistory(ticketId: number, entry: Omit<HistoryEntry, 'id'>) {
  if (!mockTicketHistory[ticketId]) mockTicketHistory[ticketId] = [];
  mockTicketHistory[ticketId].unshift({ ...entry, id: nextHistoryId() });
}

const jan = u(1, "Jan", "Kowalski");
const anna = u(2, "Anna", "Nowak");
const marek = u(3, "Marek", "Dąbrowski");
const katarzyna = u(4, "Katarzyna", "Zielińska");
const piotr = u(5, "Piotr", "Wiśniewski");
const michal = u(6, "Michał", "Anioł");
const ewa = u(7, "Ewa", "Bema");
const robert = u(8, "Robert", "Lewandowski");
const tomasz = u(9, "Tomasz", "Kot");
const krzysztof = u(10, "Krzysztof", "Ibisz");

export const mockTickets: Ticket[] = [
  { ticketId: 1, title: "Błąd logowania do systemu", description: "Użytkownik nie może się zalogować do panelu administracyjnego.", status: "OTWARTE", priority: "HIGH", assignee: jan, author: jan, createdAt: "01.12.2025, 09:00", updatedAt: "01.12.2025, 09:00" },
  { ticketId: 2, title: "Awaria drukarki w magazynie", description: "Drukarka Epson nie drukuje etykiet.", status: "W_TRAKCIE", priority: "MEDIUM", assignee: anna, author: marek, createdAt: "30.11.2025, 08:30", updatedAt: "30.11.2025, 08:30", linkedInventoryId: 11 },
  { ticketId: 3, title: "Problem z połączeniem Wi-Fi", description: "Słaby sygnał Wi-Fi na drugim piętrze.", status: "OTWARTE", priority: "HIGH", assignee: null, author: jan, createdAt: "29.11.2025, 10:00", updatedAt: "29.11.2025, 10:00" },
  { ticketId: 4, title: "Aktualizacja systemu operacyjnego", description: "Wymagana aktualizacja Windows na komputerach w dziale HR.", status: "ROZWIAZANE", priority: "LOW", assignee: jan, author: anna, createdAt: "28.11.2025, 09:00", updatedAt: "28.11.2025, 09:00", linkedInventoryId: 9 },
  { ticketId: 5, title: "Brak dostępu do dysku sieciowego", description: "Pracownicy nie widzą udziału sieciowego na serwerze NAS.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: jan, createdAt: "25.11.2025, 10:00", updatedAt: "25.11.2025, 10:00" },
  { ticketId: 6, title: "Zgłoszenie nowego pracownika", description: "Potrzebne konto i dostęp do systemów dla nowego pracownika.", status: "OTWARTE", priority: "MEDIUM", assignee: katarzyna, author: piotr, createdAt: "02.12.2025, 08:00", updatedAt: "02.12.2025, 08:00" },
  { ticketId: 7, title: "Problem z aplikacją mobilną", description: "Aplikacja mobilna nie synchronizuje danych.", status: "W_TRAKCIE", priority: "HIGH", assignee: marek, author: katarzyna, createdAt: "01.12.2025, 08:00", updatedAt: "01.12.2025, 08:00" },
  { ticketId: 8, title: "Awaria serwera poczty", description: "Brak możliwości wysyłania maili przez pracowników.", status: "OTWARTE", priority: "HIGH", assignee: piotr, author: jan, createdAt: "01.12.2025, 07:30", updatedAt: "01.12.2025, 07:30" },
  { ticketId: 9, title: "Prośba o dostęp do VPN", description: "Pracownik zdalny potrzebuje dostępu do VPN.", status: "ROZWIAZANE", priority: "LOW", assignee: jan, author: michal, createdAt: "27.11.2025, 10:00", updatedAt: "27.11.2025, 10:00" },
  { ticketId: 10, title: "Problem z wydrukiem faktur", description: "Faktury nie drukują się poprawnie z systemu ERP.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: ewa, createdAt: "26.11.2025, 09:00", updatedAt: "26.11.2025, 09:00" },
  { ticketId: 11, title: "Problem z wydrukiem faktur (duplikat)", description: "Faktury nie drukują się poprawnie z systemu ERP.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: jan, createdAt: "26.11.2025, 09:00", updatedAt: "26.11.2025, 09:00" },
  { ticketId: 12, title: "Problem z wydrukiem faktur (v3)", description: "Faktury nie drukują się poprawnie z systemu ERP.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: robert, createdAt: "26.11.2025, 09:00", updatedAt: "26.11.2025, 09:00" },
  { ticketId: 13, title: "Problem z wydrukiem faktur (v4)", description: "Faktury nie drukują się poprawnie z systemu ERP.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: tomasz, createdAt: "26.11.2025, 09:00", updatedAt: "26.11.2025, 09:00" },
  { ticketId: 14, title: "Problem z wydrukiem faktur (v5)", description: "Faktury nie drukują się poprawnie z systemu ERP.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: jan, createdAt: "26.11.2025, 09:00", updatedAt: "26.11.2025, 09:00" },
  { ticketId: 15, title: "Problem z wydrukiem faktur (v6)", description: "Faktury nie drukują się poprawnie z systemu ERP.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: krzysztof, createdAt: "26.11.2025, 09:00", updatedAt: "26.11.2025, 09:00" },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getTicketByIdMock = async (id: number): Promise<Ticket> => {
  await delay(400);
  const ticket = mockTickets.find(t => t.ticketId === id);
  if (!ticket) throw new Error(`Ticket ${id} not found`);
  return { ...ticket };
};

export const getTicketsMock = async (): Promise<Ticket[]> => {
  await delay(1000);
  return [...mockTickets];
};

export const deleteTicketMock = async (id: number) => {
  await delay(1000);
  const idx = mockTickets.findIndex(t => t.ticketId === id);
  if (idx === -1) throw new Error("Ticket not found");
  mockTickets.splice(idx, 1);
  delete mockTicketHistory[id];
};

export const createTicketMock = async (ticket: Pick<Ticket, "title" | "description" | "priority">) => {
  await delay(500);
  const newTicket: Ticket = {
    ...ticket,
    ticketId: mockTickets.reduce((max, t) => Math.max(max, t.ticketId), 0) + 1,
    status: 'OCZEKIWANIE_NA_AKCEPTACJE',
    author: jan,
    createdAt: new Date().toLocaleString("pl-PL"),
    updatedAt: new Date().toLocaleString("pl-PL"),
  };
  mockTickets.unshift(newTicket);
  const now = new Date().toISOString();
  pushHistory(newTicket.ticketId, { author: 'admin', timestamp: now, type: 'created', description: 'Zgłoszenie zostało utworzone.' });
  return newTicket;
};

export const updateTicketMock = async (id: number, updates: Partial<Pick<Ticket, "title" | "description" | "priority">>) => {
  await delay(500);
  const idx = mockTickets.findIndex(t => t.ticketId === id);
  if (idx === -1) throw new Error("Ticket not found");
  const old = mockTickets[idx];
  mockTickets[idx] = { ...old, ...updates };
  const now = new Date().toISOString();

  if (updates.priority !== undefined && updates.priority !== old.priority) {
    pushHistory(id, { author: 'admin', timestamp: now, type: 'priority_changed', description: 'Zmieniono priorytet zgłoszenia.', from: priorityConfig[old.priority].label, to: priorityConfig[updates.priority].label });
  }
  if (
    (updates.title !== undefined && updates.title !== old.title) ||
    (updates.description !== undefined && updates.description !== old.description)
  ) {
    pushHistory(id, { author: 'admin', timestamp: now, type: 'edited', description: 'Edytowano treść zgłoszenia.' });
  }

  return mockTickets[idx];
};
