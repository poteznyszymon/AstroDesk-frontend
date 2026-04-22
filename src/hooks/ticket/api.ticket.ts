import { api } from "@/lib/api";
import type { Ticket, TicketPriority } from "@/types/tickets";
import type { HistoryEntry } from "@/types/history";

interface BackendHistoryEntry {
    id: number;
    targetType: string;
    targetId: number;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    message: string | null;
    changedBy: string;
    changedAt: string;
}

const fieldNameToType = (fieldName: string): HistoryEntry["type"] => {
    switch (fieldName) {
        case "Zmiana statusu": return "status_changed";
        case "Zmiana priorytetu": return "priority_changed";
        case "Zmiana opiekuna zgłoszenia": return "assigned";
        default: return "edited";
    }
};

const mapHistoryEntry = (entry: BackendHistoryEntry): HistoryEntry => {
    if (entry.message && !entry.fieldName) {
        const msg = entry.message.toLowerCase();
        let type: HistoryEntry["type"] = "edited";
        if (msg.includes("utworzen")) type = "created";
        else if (msg.includes("przypisano")) type = "assigned";

        return {
            id: String(entry.id),
            author: entry.changedBy,
            timestamp: entry.changedAt,
            type,
            description: entry.message,
        };
    }

    return {
        id: String(entry.id),
        author: entry.changedBy,
        timestamp: entry.changedAt,
        type: fieldNameToType(entry.fieldName ?? ""),
        description: entry.fieldName ?? "",
        from: entry.oldValue ?? undefined,
        to: entry.newValue ?? undefined,
    };
};

export const getTickets = (): Promise<Ticket[]> =>
    api.get<Ticket[]>("/tickets");

export const getTicketById = (id: number): Promise<Ticket> =>
    api.get<Ticket>(`/tickets/${id}`);

export const createTicket = (payload: {
    title: string;
    description: string;
    priority: TicketPriority;
    linkedInventoryId?: number | null;
}): Promise<Ticket> =>
    api.post<Ticket>("/tickets/add", payload);

export const updateTicket = (
    id: number,
    updates: Partial<Pick<Ticket, "title" | "description" | "priority">>
): Promise<Ticket> =>
    api.patch<Ticket>(`/tickets/${id}`, updates);

export const acceptTicket = (id: number): Promise<Ticket> =>
    api.patch<Ticket>(`/tickets/${id}/accept`);

export const openTicket = (id: number): Promise<Ticket> =>
    api.patch<Ticket>(`/tickets/${id}/open`);

export const resolveTicket = (id: number): Promise<Ticket> =>
    api.patch<Ticket>(`/tickets/${id}/resolve`);

export const closeTicket = (id: number): Promise<Ticket> =>
    api.patch<Ticket>(`/tickets/${id}/close`);

export const cancelTicket = (id: number): Promise<Ticket> =>
    api.patch<Ticket>(`/tickets/${id}/cancel`);

export const deleteTicket = (id: number): Promise<void> =>
    api.delete<void>(`/tickets/${id}`);

export const assignTicket = (ticketId: number, userId: number): Promise<Ticket> =>
    api.patch<Ticket>(`/tickets/${ticketId}/assign`, { userId });

export interface TicketMessageDTO {
    id: string;
    content: string;
    timestamp: string;
    sender: {
        userId: number;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}

export const getTicketMessages = (ticketId: number): Promise<TicketMessageDTO[]> =>
    api.get<TicketMessageDTO[]>(`/tickets/${ticketId}/messages`);

export const addTicketMessage = (ticketId: number, content: string): Promise<TicketMessageDTO> =>
    api.post<TicketMessageDTO>(`/tickets/${ticketId}/messages`, { content });

export const deleteTicketMessage = (ticketId: number, messageId: string): Promise<void> =>
    api.delete<void>(`/tickets/${ticketId}/messages/${messageId}`);

export const updateTicketMessage = (ticketId: number, messageId: string, content: string): Promise<TicketMessageDTO> =>
    api.patch<TicketMessageDTO>(`/tickets/${ticketId}/messages/${messageId}`, { content });

export const getTicketHistory = async (id: number): Promise<HistoryEntry[]> => {
    const entries = await api.get<BackendHistoryEntry[]>(`/tickets/${id}/history`);
    return entries.map(mapHistoryEntry);
};
