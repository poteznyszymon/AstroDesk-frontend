import type { Ticket } from "@/types/tickets";

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
  },
  {
    id: "TKT-003",
    title: "Problem z połączeniem Wi-Fi",
    description: "Słaby sygnał Wi-Fi na drugim piętrze.",
    status: "open",
    priority: "critical",
    assignee: "",
    createdBy: "Jan Kowalski",
    createdAt: "2025-11-29",
    updatedAt: "2025-12-01",
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
  },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getTicketsMock = async (
  _currentUser: string = "Jan Kowalski"
): Promise<{ tickets: Ticket[] }> => {
  await delay(1000);

  let filtered = [...mockTickets];

  return { tickets: filtered };
};

export const deleteTicketMock = async (id: string) => {
  await delay(1000);
  const idx = mockTickets.findIndex(t => t.id === id);
  if (idx === -1) throw new Error("Ticket not found");
  mockTickets.splice(idx, 1);
}

export const createTicketMock = async (ticket: Omit<Ticket, "id" | "createdAt">) => {
  await delay(500);
  const newTicket: Ticket = {
    ...ticket,
    id: String(mockTickets.length + 1),
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockTickets.unshift(newTicket);
  return newTicket;
};
