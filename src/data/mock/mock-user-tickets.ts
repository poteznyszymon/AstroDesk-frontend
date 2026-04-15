import type { Ticket } from "@/types/tickets";
import type { User } from "@/types/user";

const u = (userId: number, firstName: string, lastName: string): User => ({
  userId,
  username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
  firstName,
  lastName,
  email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
  role: "USER",
});

const jan = u(1, "Jan", "Kowalski");
const anna = u(2, "Anna", "Nowak");
const piotr = u(5, "Piotr", "Wiśniewski");

export const mockUserTickets: Ticket[] = [
  { ticketId: 1, title: "Błąd logowania do systemu", description: "Użytkownik nie może się zalogować do panelu administracyjnego.", status: "OTWARTE", priority: "HIGH", assignee: jan, author: jan, createdAt: "01.12.2025, 09:00", updatedAt: "01.12.2025, 09:00" },
  { ticketId: 3, title: "Problem z połączeniem Wi-Fi", description: "Słaby sygnał Wi-Fi na drugim piętrze.", status: "OTWARTE", priority: "HIGH", assignee: null, author: jan, createdAt: "29.11.2025, 10:00", updatedAt: "29.11.2025, 10:00" },
  { ticketId: 5, title: "Brak dostępu do dysku sieciowego", description: "Pracownicy nie widzą udziału sieciowego na serwerze NAS.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: jan, createdAt: "25.11.2025, 10:00", updatedAt: "25.11.2025, 10:00" },
  { ticketId: 8, title: "Awaria serwera poczty", description: "Brak możliwości wysyłania maili przez pracowników.", status: "OTWARTE", priority: "HIGH", assignee: piotr, author: jan, createdAt: "01.12.2025, 07:30", updatedAt: "01.12.2025, 07:30" },
  { ticketId: 11, title: "Problem z wydrukiem faktur (duplikat)", description: "Faktury nie drukują się poprawnie z systemu ERP.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: jan, createdAt: "26.11.2025, 09:00", updatedAt: "26.11.2025, 09:00" },
  { ticketId: 14, title: "Problem z wydrukiem faktur (v5)", description: "Faktury nie drukują się poprawnie z systemu ERP.", status: "ZAMKNIETE", priority: "MEDIUM", assignee: anna, author: jan, createdAt: "26.11.2025, 09:00", updatedAt: "26.11.2025, 09:00" },
];
