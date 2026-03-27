import { useMutation, useQuery } from "@tanstack/react-query";
import { createTicketMock, deleteTicketMock, getTicketByIdMock, getTicketsMock, updateTicketMock } from "./mock.tickets";
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
    queryFn: () => getTicketByIdMock(id),
    staleTime: 1000 * 30,
    enabled: !!id,
  });
  return { data, isLoading };
};

export const useDeleteTicket = () => {
  const { mutateAsync: deleteTicket, isPending: isLoading } = useMutation({
    mutationFn: deleteTicketMock,
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
    mutationFn: ({ id, ticket }: { id: string; ticket: Partial<Ticket> }) => 
      updateTicketMock(id, ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket zaktualizowany");
    },
    onError: () => toast.error("Błąd podczas aktualizacji"),
  });

  return { updateTicket, isLoading };
};