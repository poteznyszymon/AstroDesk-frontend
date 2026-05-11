import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    acceptTicket,
    openTicket,
    resolveTicket,
    closeTicket,
    cancelTicket,
    deleteTicket,
    assignTicket,
    getTicketHistory,
    getTicketMessages,
    addTicketMessage,
    deleteTicketMessage,
    updateTicketMessage,
    type TicketMessageDTO,
} from "./api.ticket";
import { addTicketMessageMock, deleteTicketMessageMock, getTicketMessagesMock, updateTicketMessageMock } from "./mock.ticket-messages";
import { queryClient } from "@/main";
import { toast } from "sonner";
import type { Ticket, TicketPriority } from "@/types/tickets";

const TICKETS_KEY = "tickets";

export const useTickets = () => {
  const { data, isLoading } = useQuery({
    queryKey: [TICKETS_KEY],
    queryFn: getTickets,
    placeholderData: (prev) => prev,
  });
  return { data, isLoading };
};

export const useTicketById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [TICKETS_KEY, id],
    queryFn: () => getTicketById(Number(id)),
    enabled: !!id,
  });
  return { data, isLoading };
};

export const useCreateTicket = () => {
  const { mutateAsync: createTicketMutation, isPending: isLoading } = useMutation({
    mutationFn: (payload: { title: string; description: string; priority: TicketPriority; linkedInventoryId?: number | null }) =>
      createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket dodany");
    },
    onError: () => toast.error("Błąd podczas dodawania"),
  });
  return { createTicket: createTicketMutation, isLoading };
};

export const useUpdateTicket = () => {
  const { mutateAsync: updateTicketMutation, isPending: isLoading } = useMutation({
    mutationFn: ({ id, ticket }: { id: number; ticket: Partial<Pick<Ticket, "title" | "description" | "priority">> }) =>
      updateTicket(id, ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket zaktualizowany");
    },
    onError: () => toast.error("Błąd podczas aktualizacji"),
  });
  return { updateTicket: updateTicketMutation, isLoading };
};

export const useDeleteTicket = () => {
  const { mutateAsync: deleteTicketMutation, isPending: isLoading } = useMutation({
    mutationFn: (id: number) => deleteTicket(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: [TICKETS_KEY, String(id)] });
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket usunięty");
    },
    onError: () => toast.error("Błąd podczas usuwania"),
  });
  return { deleteTicket: deleteTicketMutation, isLoading };
};

export const useAcceptTicket = () => {
  const { mutateAsync: accept, isPending: isLoading } = useMutation({
    mutationFn: (id: number) => acceptTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket zaakceptowany");
    },
    onError: () => toast.error("Błąd podczas akceptowania"),
  });
  return { accept, isLoading };
};

export const useOpenTicket = () => {
  const { mutateAsync: open, isPending: isLoading } = useMutation({
    mutationFn: (id: number) => openTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket otwarty");
    },
    onError: () => toast.error("Błąd podczas otwierania"),
  });
  return { open, isLoading };
};

export const useResolveTicket = () => {
  const { mutateAsync: resolve, isPending: isLoading } = useMutation({
    mutationFn: (id: number) => resolveTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket rozwiązany");
    },
    onError: () => toast.error("Błąd podczas rozwiązywania"),
  });
  return { resolve, isLoading };
};

export const useCloseTicket = () => {
  const { mutateAsync: close, isPending: isLoading } = useMutation({
    mutationFn: (id: number) => closeTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket zamknięty");
    },
    onError: () => toast.error("Błąd podczas zamykania"),
  });
  return { close, isLoading };
};

export const useCancelTicket = () => {
  const { mutateAsync: cancel, isPending: isLoading } = useMutation({
    mutationFn: (id: number) => cancelTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket anulowany");
    },
    onError: () => toast.error("Błąd podczas anulowania"),
  });
  return { cancel, isLoading };
};

export const useTicketHistory = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [TICKETS_KEY, id, "history"],
    queryFn: () => getTicketHistory(Number(id)),
    enabled: !!id,
  });
  return { data, isLoading };
};

export const useAssignTicket = () => {
  const { mutateAsync: assign, isPending: isLoading } = useMutation({
    mutationFn: ({ ticketId, userId }: { ticketId: number; userId: number }) =>
      assignTicket(ticketId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Opiekun przypisany");
    },
    onError: () => toast.error("Błąd podczas przypisywania opiekuna"),
  });
  return { assign, isLoading };
};

export const useTicketMessages = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [TICKETS_KEY, id, "messages"],
    queryFn: () => getTicketMessages(Number(id)),
    enabled: !!id,
  });
  return { data, isLoading };
};

export const useAddTicketMessage = (ticketId: string) => {
  const { mutateAsync: addMessage, isPending: isLoading } = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      addTicketMessage(Number(ticketId), content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY, ticketId, "messages"] });
    },
    onError: () => toast.error("Błąd podczas wysyłania wiadomości"),
  });
  return { addMessage, isLoading };
};

export const useDeleteTicketMessage = (ticketId: string) => {
  const { mutateAsync: deleteMessage, isPending: isLoading } = useMutation({
    mutationFn: (messageId: string) => deleteTicketMessage(Number(ticketId), messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY, ticketId, "messages"] });
    },
    onError: () => toast.error("Błąd podczas usuwania wiadomości"),
  });
  return { deleteMessage, isLoading };
};

export const useUpdateTicketMessage = (ticketId: string) => {
  const { mutateAsync: updateMessage, isPending: isLoading } = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      updateTicketMessage(Number(ticketId), messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY, ticketId, "messages"] });
    },
    onError: () => toast.error("Błąd podczas edytowania wiadomości"),
  });
  return { updateMessage, isLoading };
};

export type { TicketMessageDTO };
