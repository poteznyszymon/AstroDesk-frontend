import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Spinner } from '../ui/spinner'
import { Edit } from 'lucide-react'

import { createInventorySchema, type CreateInventorySchema } from '@/types/create-inventory'
import type { Inventory, InventoryItemType, InventoryStatus, UpdateInventoryPayload } from '@/types/inventory'
import { useUpdateInventory } from '@/hooks/inventory/useInventory'

const inventoryTypeLabels: Record<InventoryItemType, string> = {
    LAPTOP: "Laptop",
    KOMPUTER: "Komputer stacjonarny",
    DRUKARKA: "Drukarka",
    ROUTER: "Router",
    SWITCH: "Switch",
    TELEFON: "Telefon",
    SFP: "SFP",
};

const inventoryStatusLabels: Record<InventoryStatus, string> = {
    DOSTEPNE: "Dostępne",
    DO_WYDANIA: "Do wydania",
    WYDANE: "Wydane",
    WYPORZYCZONE: "Wypożyczone",
    W_TRAKCIE: "W trakcie",
    SERWIS: "W serwisie",
    UTYLIZACJA: "Utylizacja",
};

interface EditEquipmentDialogProps {
    item: Inventory;
    showText?: boolean;
}

const EditEquipmentDialog = ({ item, showText = true }: EditEquipmentDialogProps) => {
    const [open, setOpen] = useState(false);
    const { updateInventory, isLoading: isUpdating } = useUpdateInventory();

    const form = useForm<CreateInventorySchema>({
        resolver: zodResolver(createInventorySchema),
        defaultValues: {
            name: item.name,
            itemType: item.itemType,
            serialNumber: item.serialNumber,
            status: item.status,
            model: item.model ?? "",
            boughtDate: item.boughtDate ?? "",
            price: item.price ?? undefined,
            invoiceNumber: item.invoiceNumber ?? "",
            location: item.location ?? "",
            port: item.port ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: item.name,
                itemType: item.itemType,
                serialNumber: item.serialNumber,
                status: item.status,
                model: item.model ?? "",
                boughtDate: item.boughtDate ?? "",
                price: item.price ?? undefined,
                invoiceNumber: item.invoiceNumber ?? "",
                location: item.location ?? "",
                port: item.port ?? "",
            });
        }
    }, [open, item, form]);

    const handleUpdate = async (values: CreateInventorySchema) => {
        const updates: UpdateInventoryPayload = {
            name: values.name,
            itemType: values.itemType,
            serialNumber: values.serialNumber,
            status: values.status,
            model: values.model ?? null,
            boughtDate: values.boughtDate ?? null,
            price: values.price ?? null,
            invoiceNumber: values.invoiceNumber ?? null,
            location: values.location ?? null,
            port: values.port ?? null,
        };

        await updateInventory({ id: item.id, updates });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={showText ? "sm" : "icon-sm"} variant="outline" className="gap-2 flex-1 xs:flex-none">
                    <Edit className="w-4 h-4" /> {showText && "Edytuj"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edytuj sprzęt</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model</FormLabel>
                                        <FormControl>
                                            <Input placeholder="np. Latitude 5520" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cena (zł)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="np. 4299.99"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="invoiceNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numer faktury</FormLabel>
                                        <FormControl>
                                            <Input placeholder="np. FV/2024/03/0041" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="boughtDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data zakupu</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                <Button type="button" variant="outline" size="sm">
                                    Anuluj
                                </Button>
                            </DialogClose>
                            <Button type="submit" size="sm" disabled={isUpdating}>
                                Zapisz
                                {isUpdating && <Spinner />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditEquipmentDialog;
