import { useMutation, useQuery } from "@tanstack/react-query";
import { createTicketMock, deleteTicketMock, getTicketsMock } from "./mock.tickets";
import { queryClient } from "@/main";
import { toast } from "sonner";

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
  const {} = useMutation({
    mutationFn: createTicketMock,
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY] });
      toast.success("Ticket dodany");
    },
    onError: () => toast.error("Błąd podczas dodawania"),
  })
}