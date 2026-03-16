import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { priorityConfig, statusConfig, type Ticket } from "@/types/tickets";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useDeleteTicket } from "@/hooks/ticket/useTIcekts";
import { Spinner } from "../ui/spinner";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import EditTicketDialog from "./edit-ticket-dialog";

const TicketEditMenu = ({ ticket }: { ticket: Ticket }) => {
  const [activeDialog, setActiveDialog] = useState<"details" | "edit" | "delete" | null>(null);
  const { deleteTicket, isLoading } = useDeleteTicket()

  const handleOnDelete = async (ticketId: string) => {
    await deleteTicket(ticketId);
    setActiveDialog(null);
  }

  console.log(ticket)

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
          {/* <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(ticket.id);
              toast("ID skopiowane do schowka", { duration: 1000 });
            }}
          >
            Kopiuj ID
          </DropdownMenuItem> */}
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

      <EditTicketDialog
        ticket={ticket}
        open={activeDialog === "edit"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      />

      <Dialog open={activeDialog === "details"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Szczegóły zgłoszenia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Tytuł</p>
              <p className="text-base font-semibold">{ticket.title}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Opis</p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <Separator />

            <div className="flex gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                {(() => {
                  const { label, variant, icon: Icon } = statusConfig[ticket.status];
                  return (
                    <Badge variant={variant} className="flex items-center gap-1 w-fit">
                      <Icon className="h-3 w-3" />
                      {label}
                    </Badge>
                  );
                })()}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Priorytet</p>
                {(() => {
                  const { label, className } = priorityConfig[ticket.priority];
                  return (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${className}`}>
                      {label}
                    </span>
                  );
                })()}
              </div>
            </div>

            <Separator />

            <div className="flex gap-6 items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Przypisany do</p>
                <p className="text-sm">{ticket.assignee ?? <span className="italic text-muted-foreground">Brak</span>}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Utworzony przez</p>
                <p className="text-sm">{ticket.createdBy}</p>
              </div>
            </div>

            <div className="flex gap-6 items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Data utworzenia</p>
                <p className="text-sm">{new Date(ticket.createdAt).toLocaleString("pl-PL")}</p>
              </div>
              {ticket.updatedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Ostatnia aktualizacja</p>
                  <p className="text-sm">{new Date(ticket.updatedAt).toLocaleString("pl-PL")}</p>
                </div>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketEditMenu;
