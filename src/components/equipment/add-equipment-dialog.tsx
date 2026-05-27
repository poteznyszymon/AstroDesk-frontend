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
    SFP: "SFP",
};

const inventoryStatusLabels: Partial<Record<InventoryStatus, string>> = {
    DOSTEPNE: "Dostępne",
    DO_WYDANIA: "Do wydania",
    W_TRAKCIE: "W trakcie",
    SERWIS: "W serwisie",
    UTYLIZACJA: "Utylizacja",
};

type AddEquipmentDialogProps = {
    isLoading?: boolean;
    triggerClassName?: string;
}

const AddEquipmentDialog = ({ isLoading = false, triggerClassName }: AddEquipmentDialogProps) => {
    const [open, setOpen] = useState(false);
    const { createInventory, isLoading: isCreating } = useCreateInventory();

    const form = useForm<CreateInventorySchema>({
        resolver: zodResolver(createInventorySchema),
        defaultValues: {
            name: "",
            itemType: "LAPTOP",
            serialNumber: "",
            inventoryNumber: "",
            status: "DOSTEPNE",
            location: "",
            model: "",
            boughtDate: "",
            invoiceNumber: "",
        },
    });

    const handleCreate = async (values: CreateInventorySchema) => {
        const payload: CreateInventoryPayload = {
            name: values.name,
            itemType: values.itemType,
            serialNumber: values.serialNumber,
            inventoryNumber: values.inventoryNumber || null,
            status: values.status,
            model: values.model || null,
            boughtDate: values.boughtDate || null,
            price: values.price ?? null,
            invoiceNumber: values.invoiceNumber || null,
            location: values.location || null,
            port: values.port || null,
            assignedTo: null,
            assignedDate: null,
        };

        await createInventory(payload);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={"sm"} disabled={isLoading} className={triggerClassName}>
                    Dodaj sprzęt
                </Button>
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
                                                        {inventoryStatusLabels[status]!}
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
                                name="inventoryNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nr inwentarza</FormLabel>
                                        <FormControl>
                                            <Input placeholder="np. INV/2024/001" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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

                        <FormField
                            control={form.control}
                            name="port"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Port</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Port urządzenia" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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