import { Clock, CheckCircle2, AlertCircle, Circle } from "lucide-react";

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const statusConfig: Record<
  TicketStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
  }
> = {
  open: { label: "Otwarty", variant: "destructive", icon: AlertCircle },
  "in-progress": { label: "W trakcie", variant: "default", icon: Clock },
  resolved: { label: "Rozwiązany", variant: "secondary", icon: CheckCircle2 },
  closed: { label: "Zamknięty", variant: "outline", icon: Circle },
};

export const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: "Niski", className: "bg-green-100 text-green-800" },
  medium: { label: "Średni", className: "bg-yellow-100 text-yellow-800" },
  high: { label: "Wysoki", className: "bg-orange-100 text-orange-800" },
  critical: { label: "Krytyczny", className: "bg-red-100 text-red-800" },
};

export type AdminTicketSelectionType = "all" | "not-assigned" | "my-tasks" | "my-tickets";
