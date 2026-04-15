import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { createTicketSchema, type CreateTicketSchema } from '@/types/create-ticket'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTicket } from '@/hooks/ticket/useTickets'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ticketPriorities } from '@/types/tickets'
import { Spinner } from '../ui/spinner'
import { useState } from 'react'
import { TicketPlus, Monitor } from 'lucide-react'

interface AddTicketDialogProps {
    preselectedDevice?: { id: number; name: string };
    trigger?: React.ReactNode;
    triggerClassName?: string;
}

const AddTicketDialog = ({ preselectedDevice, trigger, triggerClassName }: AddTicketDialogProps = {}) => {
    const { createTicket, isLoading } = useCreateTicket();
    const [open, setOpen] = useState(false);

    const form = useForm<CreateTicketSchema>({
        resolver: zodResolver(createTicketSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "LOW",
        },
    });

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) form.reset({ title: "", description: "", priority: "LOW" });
    };

    const handleSubmit = async (values: CreateTicketSchema) => {
        await createTicket({ ...values, linkedInventoryId: preselectedDevice?.id ?? null });
        setOpen(false);
        form.reset();
    };

    const defaultTrigger = preselectedDevice
        ? (
            <Button size="sm" variant="outline" className="gap-2 flex-1 sm:flex-none">
                <TicketPlus className="w-4 h-4" /> Zgłoś problem
            </Button>
        )
        : (
            <Button size="sm" className={triggerClassName}>Dodaj nowy</Button>
        );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger ?? defaultTrigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dodaj nowy ticket</DialogTitle>
                </DialogHeader>

                {preselectedDevice && (
                    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
                        <Monitor className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Urządzenie:</span>
                        <span className="font-medium text-foreground">{preselectedDevice.name}</span>
                    </div>
                )}

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
                            <Button type="submit" size="sm" disabled={isLoading}>
                                Dodaj
                                {isLoading && <Spinner />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTicketDialog;
