import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { createTicketSchema, type CreateTicketSchema } from '@/types/create-ticket'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTicket } from '@/hooks/ticket/useTickets'
import { useAssignableInventory } from '@/hooks/inventory/useInventory'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { ticketPriorities, ticketPriorityLabels } from '@/types/tickets'
import { Spinner } from '../ui/spinner'
import { useState } from 'react'
import { TicketPlus, Monitor, Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddTicketDialogProps {
    preselectedDevice?: { id: number; name: string };
    trigger?: React.ReactNode;
    triggerClassName?: string;
}

const AddTicketDialog = ({ preselectedDevice, trigger, triggerClassName }: AddTicketDialogProps = {}) => {
    const { createTicket, isLoading } = useCreateTicket();
    const [open, setOpen] = useState(false);
    const [devicePickerOpen, setDevicePickerOpen] = useState(false);

    const { data: assignableDevices, isLoading: devicesLoading } = useAssignableInventory(open && !preselectedDevice);

    const defaultValues: CreateTicketSchema = {
        title: "",
        description: "",
        priority: "LOW",
        linkedInventoryId: preselectedDevice?.id ?? null,
    };

    const form = useForm<CreateTicketSchema>({
        resolver: zodResolver(createTicketSchema),
        defaultValues,
    });

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) form.reset(defaultValues);
    };

    const handleSubmit = async (values: CreateTicketSchema) => {
        await createTicket({
            title: values.title,
            description: values.description,
            priority: values.priority,
            linkedInventoryId: preselectedDevice?.id ?? values.linkedInventoryId ?? null,
        });
        setOpen(false);
        form.reset(defaultValues);
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
                                                    {ticketPriorityLabels[priority]}
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
                                render={({ field }) => {
                                    const selected = assignableDevices?.find((d) => d.id === field.value) ?? null;
                                    return (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Urządzenie (opcjonalnie)</FormLabel>
                                            <Popover open={devicePickerOpen} onOpenChange={setDevicePickerOpen}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between font-normal",
                                                                !selected && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <span className="truncate">
                                                                {selected
                                                                    ? `${selected.name} · ${selected.serialNumber}`
                                                                    : devicesLoading
                                                                        ? "Ładowanie urządzeń…"
                                                                        : "Wybierz urządzenie"}
                                                            </span>
                                                            {selected ? (
                                                                <X
                                                                    className="ml-2 h-4 w-4 shrink-0 opacity-60 hover:opacity-100"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        field.onChange(null);
                                                                    }}
                                                                />
                                                            ) : (
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Szukaj po nazwie lub numerze seryjnym…" />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                {devicesLoading ? "Ładowanie…" : "Brak urządzeń"}
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {assignableDevices?.map((device) => (
                                                                    <CommandItem
                                                                        key={device.id}
                                                                        value={`${device.name} ${device.serialNumber}`}
                                                                        onSelect={() => {
                                                                            field.onChange(device.id === field.value ? null : device.id);
                                                                            setDevicePickerOpen(false);
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                field.value === device.id ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className="truncate font-medium text-sm">{device.name}</span>
                                                                            <span className="truncate text-xs text-muted-foreground">
                                                                                {device.serialNumber}
                                                                            </span>
                                                                        </div>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}

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
