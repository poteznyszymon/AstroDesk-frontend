import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Spinner } from '../ui/spinner'

import { createInventorySchema, type CreateInventorySchema } from '@/types/create-inventory'
import type { InventoryItemType, InventoryStatus, CreateInventoryPayload } from '@/types/inventory' 
import { useCreateInventory } from '@/hooks/inventory/useInventory'

const inventoryTypeLabels: Record<InventoryItemType, string> = {
    LAPTOP: "Laptop",
    KOMPUTER: "Komputer stacjonarny",
    DRUKARKA: "Drukarka",
    ROUTER: "Router",
    SWITCH: "Switch",
    TELEFON: "Telefon",
};

const inventoryStatusLabels: Record<InventoryStatus, string> = {
    DO_WYDANIA: "Do wydania",
    WYDANE: "Wydane",
    DOSTEPNE: "Dostępne",
    ZAJETE: "Zajęte",
    W_TRAKCIE: "W trakcie",
    CANCELLED: "Anulowane",
    PRZYJETY: "Przyjęty",
    SERWIS: "W serwisie",
    UTYLIZACJA: "Utylizacja",
};

const AddEquipmentDialog = () => {
    const [open, setOpen] = useState(false);
    const { createInventory, isLoading: isCreating } = useCreateInventory();

    const form = useForm<CreateInventorySchema>({
        resolver: zodResolver(createInventorySchema),
        defaultValues: {
            name: "",
            itemType: "LAPTOP",
            serialNumber: "",
            status: "DOSTEPNE",
            location: "",
            assignedTo: "",
            assignedDate: "",
            model: "",
            boughtDate: "",
            invoiceNumber: "",
            notes: "",
        },
    });

    const watchedStatus = form.watch("status");
    const isAssigned = watchedStatus === "WYDANE" || watchedStatus === "ZAJETE";

    const handleCreate = async (values: CreateInventorySchema) => {
        const payload: CreateInventoryPayload = {
            name: values.name,
            itemType: values.itemType,
            serialNumber: values.serialNumber,
            status: values.status,
            model: values.model ?? null,
            boughtDate: values.boughtDate ?? null,
            price: values.price ?? null,
            invoiceNumber: values.invoiceNumber ?? null,
            location: values.location ?? null,
            notes: values.notes ?? null,
            assignedTo: isAssigned && values.assignedTo ? values.assignedTo : null,
            assignedDate: isAssigned && values.assignedDate ? values.assignedDate : null,
        };

        await createInventory(payload);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={"sm"}>Dodaj sprzęt</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Dodaj nowy sprzęt</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="np. Dell Latitude 5520" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="itemType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Typ</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Wybierz typ" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(Object.keys(inventoryTypeLabels) as InventoryItemType[]).map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {inventoryTypeLabels[type]}
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
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Wybierz status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(Object.keys(inventoryStatusLabels) as InventoryStatus[]).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {inventoryStatusLabels[status]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="serialNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numer seryjny</FormLabel>
                                        <FormControl>
                                            <Input placeholder="np. DL5520-2024-001" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lokalizacja</FormLabel>
                                        <FormControl>
                                            <Input placeholder="np. Pokój 204" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {isAssigned && (
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="assignedTo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Przypisany do</FormLabel>
                                            <FormControl>
                                                <Input placeholder="np. Jan Kowalski" {...field} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="assignedDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data przypisania</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" size="sm" onClick={() => form.reset()}>
                                    Anuluj
                                </Button>
                            </DialogClose>
                            <Button type="submit" size="sm" disabled={isCreating}>
                                Dodaj
                                {isCreating && <Spinner />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEquipmentDialog;