import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { createTicketSchema, type CreateTicketSchema } from '@/types/create-ticket'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMe } from '@/hooks/auth/useAuth'
import { useCreateTicket, useTickets } from '@/hooks/ticket/useTIcekts'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ticketPriorities, type Ticket } from '@/types/tickets'
import { Spinner } from '../ui/spinner'
import { useState } from 'react'


const AddTicketDialog = () => {
    const { user } = useMe();
    const { isLoading } = useTickets(user?.name);
    const { createTicket, isLoading: isTicketCreating} = useCreateTicket();
    const [open, setOpen] = useState(false);

    const form = useForm<CreateTicketSchema>({
        resolver: zodResolver(createTicketSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "low",
            createdBy: user?.name,
        },
    });

    const handleCreateTicket = async (values: CreateTicketSchema) => {
    const newTicket: Omit<Ticket, "id" | "createdAt"> = {
        title: values.title,
        description: values.description,
        createdBy: user?.name || "",
        priority: values.priority,
        status: 'open',
        updatedAt: null,
        assignee: null,
    }
    await createTicket(newTicket);
    setOpen(false);
    form.reset(); 
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button disabled={isLoading}>Dodaj nowy</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Dodaj nowy ticket</DialogTitle>
            </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateTicket)} className="space-y-4">
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
                    <Textarea placeholder="Opis" {...field} className='max-h-40'/>
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
                        <SelectTrigger className='min-w-32'>
                            <SelectValue placeholder="Wybierz priorytet" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {ticketPriorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                            {priority}
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
                <Button type="submit" size="sm" disabled={isTicketCreating}>
                Dodaj
                {isTicketCreating && <Spinner />}
                </Button>
            </DialogFooter>
        </form>
    </Form>
    </DialogContent>
</Dialog>
)
}

export default AddTicketDialog