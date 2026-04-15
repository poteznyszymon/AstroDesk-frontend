import { Clock, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import type { User } from "@/types/user";

export type TicketStatus =
  | "OTWARTE"
  | "W_TRAKCIE"
  | "ROZWIAZANE"
  | "ZAMKNIETE"
  | "ANULOWANE"
  | "OCZEKIWANIE_NA_AKCEPTACJE";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export const ticketStatuses = [
  "OTWARTE",
  "W_TRAKCIE",
  "ROZWIAZANE",
  "ZAMKNIETE",
  "ANULOWANE",
  "OCZEKIWANIE_NA_AKCEPTACJE",
] as const;

export const ticketPriorities = ["LOW", "MEDIUM", "HIGH"] as const;

export interface Ticket {
  ticketId: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  author: User;
  createdAt: string;
  updatedAt: string;
  assignee?: User | null;
  linkedInventoryId?: number | null;
}

export const statusConfig: Record<
  TicketStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
  }
> = {
  OTWARTE: { label: "Otwarty", variant: "destructive", icon: AlertCircle },
  W_TRAKCIE: { label: "W trakcie", variant: "default", icon: Clock },
  ROZWIAZANE: { label: "Rozwiązany", variant: "secondary", icon: CheckCircle2 },
  ZAMKNIETE: { label: "Zamknięty", variant: "outline", icon: Circle },
  ANULOWANE: { label: "Anulowany", variant: "outline", icon: Circle },
  OCZEKIWANIE_NA_AKCEPTACJE: { label: "Oczekuje", variant: "secondary", icon: Clock },
};

export const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  LOW: { label: "Niski", className: "bg-green-100 text-green-800" },
  MEDIUM: { label: "Średni", className: "bg-yellow-100 text-yellow-800" },
  HIGH: { label: "Wysoki", className: "bg-orange-100 text-orange-800" },
};

export type AdminTicketSelectionType = "all" | "not-assigned" | "my-tasks" | "my-tickets";
