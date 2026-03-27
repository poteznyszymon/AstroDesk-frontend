import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { createTicketSchema, type CreateTicketSchema } from '@/types/create-ticket'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMe } from '@/hooks/auth/useAuth'
import { useCreateTicket, useTickets } from '@/hooks/ticket/useTIcekts'
import { useInventory } from '@/hooks/inventory/useInventory'
import { useAdmin } from '@/data/mock/admin-context'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ticketPriorities, type Ticket } from '@/types/tickets'
import { Spinner } from '../ui/spinner'
import { useState } from 'react'
import { TicketPlus, Monitor, Search } from 'lucide-react'

interface AddTicketDialogProps {
    preselectedDevice?: { id: number; name: string };
    trigger?: React.ReactNode;
}

const AddTicketDialog = ({ preselectedDevice, trigger }: AddTicketDialogProps = {}) => {
    const { user } = useMe();
    const { adminView } = useAdmin();
    const { isLoading } = useTickets(user?.name);
    const { createTicket, isLoading: isTicketCreating } = useCreateTicket();
    const { data: inventory } = useInventory();
    const availableDevices = adminView
        ? (inventory ?? [])
        : (inventory ?? []).filter((item) => item.assignedTo === user?.name);
    const [open, setOpen] = useState(false);
    const [deviceSearch, setDeviceSearch] = useState("");

    const form = useForm<CreateTicketSchema>({
        resolver: zodResolver(createTicketSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "low",
            createdBy: user?.name,
            linkedInventoryId: preselectedDevice?.id ?? null,
        },
    });

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) form.reset({
            title: "",
            description: "",
            priority: "low",
            createdBy: user?.name,
            linkedInventoryId: preselectedDevice?.id ?? null,
        });
    };

    const handleCreateTicket = async (values: CreateTicketSchema) => {
        const newTicket: Omit<Ticket, "id" | "createdAt"> = {
            title: values.title,
            description: values.description,
            createdBy: user?.name || "",
            priority: values.priority,
            status: 'open',
            updatedAt: null,
            assignee: null,
            linkedInventoryId: values.linkedInventoryId ?? null,
        };
        await createTicket(newTicket);
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
            <Button disabled={isLoading} size="sm">Dodaj nowy</Button>
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
                                        <Textarea placeholder="Opis" {...field} className="max-h-40" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className={preselectedDevice ? undefined : "grid grid-cols-2 gap-4"}>
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
                            {!preselectedDevice && (
                                <FormField
                                    control={form.control}
                                    name="linkedInventoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Powiązane urządzenie</FormLabel>
                                            <Select
                                                onValueChange={(val) =>
                                                    field.onChange(val === "NONE" ? null : Number(val))
                                                }
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
                                                    {availableDevices
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
                            )}
                        </div>
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
    );
};

export default AddTicketDialog;
