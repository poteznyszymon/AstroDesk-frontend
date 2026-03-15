import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Ticket } from "@/types/tickets";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useDeleteTicket } from "@/hooks/ticket/useTIcekts";
import { Spinner } from "../ui/spinner";

const TicketEditMenu = ({ ticket }: { ticket: Ticket }) => {
  const [activeDialog, setActiveDialog] = useState<"details" | "edit" | "delete" | null>(null);
  const { deleteTicket, isLoading } = useDeleteTicket()

  const handleOnDelete = async (ticketId: string) => {
    await deleteTicket(ticketId);
    setActiveDialog(null);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Otwórz menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Akcje</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(ticket.id);
              toast("ID skopiowane do schowka", { duration: 1000 });
            }}
          >
            Kopiuj ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setActiveDialog("details")}>Zobacz szczegóły</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveDialog("edit")}>Edytuj zgłoszenie</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={() => setActiveDialog("delete")}>
            Usuń zgłoszenie
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={activeDialog === "delete"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jesteś pewien?</DialogTitle>
            <DialogDescription>
              Ta akcja trwale usunie zgłoszenie <strong>{ticket.title}</strong>. Nie można tego cofnąć.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size={"sm"} onClick={() => setActiveDialog(null)}>
              Anuluj
            </Button>
            <Button variant="destructive" size={"sm"} disabled={isLoading} onClick={() => {
              handleOnDelete(ticket.id);
              
            }}>
              Usuń
              {isLoading && <Spinner />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "edit"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj zgłoszenie</DialogTitle>
          </DialogHeader>
          <div className="py-8">tu bedzie formularz do edycji</div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "details"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Szczegóły zgłoszenia</DialogTitle>
          </DialogHeader>
          <div className="py-8">tu beda szczegoly</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketEditMenu;
