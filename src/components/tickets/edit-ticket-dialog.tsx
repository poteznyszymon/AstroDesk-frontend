import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { editTicketSchema, type EditTicketSchema } from '@/types/edit-ticket'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ticketPriorities, priorityConfig, type Ticket } from '@/types/tickets'
import { Spinner } from '../ui/spinner'
import { useUpdateTicket } from '@/hooks/ticket/useTickets'

interface EditTicketDialogProps {
  ticket: Ticket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditTicketDialog = ({ ticket, open, onOpenChange }: EditTicketDialogProps) => {
  const { updateTicket, isLoading } = useUpdateTicket();

  const form = useForm<EditTicketSchema>({
    resolver: zodResolver(editTicketSchema),
    defaultValues: {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
    },
  });

  const handleSubmit = async (values: EditTicketSchema) => {
    await updateTicket({ id: ticket.ticketId, ticket: values });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj zgłoszenie</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł</FormLabel>
                  <FormControl>
                    <Input placeholder="Tytuł" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Opis" {...field} className="max-h-40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorytet</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz priorytet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ticketPriorities.map((p) => (
                        <SelectItem key={p} value={p}>
                          {priorityConfig[p].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm">
                  Anuluj
                </Button>
              </DialogClose>
              <Button type="submit" size="sm" disabled={isLoading}>
                Zapisz
                {isLoading && <Spinner />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTicketDialog;
