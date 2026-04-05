import { useMutation, useQuery } from "@tanstack/react-query";
import { createTicketMock, deleteTicketMock, getTicketByIdMock, getTicketsMock, updateTicketMock } from "./mock.tickets";
import { getTicketHistoryMock } from "./mock.ticket-history";
import { addTicketMessageMock, deleteTicketMessageMock, getTicketMessagesMock, updateTicketMessageMock } from "./mock.ticket-messages";
import { queryClient } from "@/main";
import { toast } from "sonner";
import type { Ticket } from "@/types/tickets";

const TICKETS_KEY = "tickets";

export const useTickets = (currentUser?: string) => {
  const {data, isLoading } = useQuery({
    queryKey: [TICKETS_KEY],
    queryFn: () => getTicketsMock(currentUser),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });
  return { data, isLoading }
};

export const useTicketById = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [TICKETS_KEY, id],
    queryFn: () => getTicketByIdMock(Number(id)),
    staleTime: 1000 * 30,
    enabled: !!id,
  });
  return { data, isLoading };
};

export const useDeleteTicket = () => {
  const { mutateAsync: deleteTicket, isPending: isLoading } = useMutation({
    mutationFn: (id: number) => deleteTicketMock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket usunięty");
    },
    onError: () => toast.error("Błąd podczas usuwania"),
  });
  return { deleteTicket, isLoading };
};

export const useCreateTicket = () => {
  const { mutateAsync: createTicket, isPending: isLoading } = useMutation({
    mutationFn: (ticket: Omit<Ticket, "id" | "createdAt">) => createTicketMock(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket dodany");
    },
    onError: () => toast.error("Błąd podczas dodawania"),
  });

  return { createTicket, isLoading };
};

export const useUpdateTicket = () => {
  const { mutateAsync: updateTicket, isPending: isLoading } = useMutation({
    mutationFn: ({ id, ticket }: { id: number; ticket: Partial<Ticket> }) =>
      updateTicketMock(id, ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket zaktualizowany");
    },
    onError: () => toast.error("Błąd podczas aktualizacji"),
  });

  return { updateTicket, isLoading };
};

export const useTicketHistory = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [TICKETS_KEY, id, 'history'],
    queryFn: () => getTicketHistoryMock(id),
    staleTime: 1000 * 30,
    enabled: !!id,
  });
  return { data, isLoading };
};

export const useTicketMessages = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: [TICKETS_KEY, id, 'messages'],
    queryFn: () => getTicketMessagesMock(id),
    staleTime: 1000 * 30,
    enabled: !!id,
  });
  return { data, isLoading };
};

export const useAddTicketMessage = (ticketId: string) => {
  const { mutateAsync: addMessage, isPending: isLoading } = useMutation({
    mutationFn: ({ content, author }: { content: string; author: string }) =>
      addTicketMessageMock(ticketId, content, author),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY, ticketId, 'messages'] });
    },
    onError: () => toast.error("Błąd podczas wysyłania wiadomości"),
  });
  return { addMessage, isLoading };
};

export const useDeleteTicketMessage = (ticketId: string) => {
  const { mutateAsync: deleteMessage, isPending: isLoading } = useMutation({
    mutationFn: (messageId: string) => deleteTicketMessageMock(ticketId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY, ticketId, 'messages'] });
    },
    onError: () => toast.error("Błąd podczas usuwania wiadomości"),
  });
  return { deleteMessage, isLoading };
};

export const useUpdateTicketMessage = (ticketId: string) => {
  const { mutateAsync: updateMessage, isPending: isLoading } = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      updateTicketMessageMock(ticketId, messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY, ticketId, 'messages'] });
    },
    onError: () => toast.error("Błąd podczas edytowania wiadomości"),
  });
  return { updateMessage, isLoading };
};
