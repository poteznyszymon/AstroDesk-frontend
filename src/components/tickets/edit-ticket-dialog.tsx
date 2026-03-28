import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { editTicketSchema, type EditTicketSchema } from '@/types/edit-ticket'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ticketPriorities, ticketStatuses, statusConfig, priorityConfig, type Ticket } from '@/types/tickets'
import { Spinner } from '../ui/spinner'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useUpdateTicket } from '@/hooks/ticket/useTickets'
import { useInventory } from '@/hooks/inventory/useInventory'

interface EditTicketDialogProps {
  ticket: Ticket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditTicketDialog = ({ ticket, open, onOpenChange }: EditTicketDialogProps) => {
  const { updateTicket, isLoading } = useUpdateTicket();
  const { data: inventory } = useInventory();
  const [deviceSearch, setDeviceSearch] = useState("");

  const form = useForm<EditTicketSchema>({
    resolver: zodResolver(editTicketSchema),
    defaultValues: {
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      assignee: ticket.assignee,
      linkedInventoryId: ticket.linkedInventoryId,
    },
  });

  const handleSubmit = async (values: EditTicketSchema) => {
    await updateTicket({ id: ticket.id, ticket: { ...values, linkedInventoryId: values.linkedInventoryId ?? null } });
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
            <div className="flex gap-4 items-center justify-between">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Wybierz status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ticketStatuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {statusConfig[s].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Priorytet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
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
            </div>
            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Przypisany do</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brak"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedInventoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Powiązane urządzenie</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "NONE" ? null : Number(val))}
                    value={field.value != null ? String(field.value) : "NONE"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Opcjonalne" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <div className="flex items-center border-b px-2 pb-2 pt-1 gap-2">
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <input
                          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                          placeholder="Szukaj urządzenia..."
                          value={deviceSearch}
                          onChange={(e) => setDeviceSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                      <SelectItem value="NONE">Brak</SelectItem>
                      {(inventory ?? [])
                        .filter((item) =>
                          item.name.toLowerCase().includes(deviceSearch.toLowerCase())
                        )
                        .map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
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