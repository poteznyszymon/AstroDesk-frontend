import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Spinner } from '../ui/spinner'
import { createEquipmentSchema, equipmentStatuses, equipmentTypes, type CreateEquipmentSchema } from '@/types/create-equipment'
import type { Equipment } from '@/types/equipment'
import {useCreateEquipment} from "@/hooks/inventory/useInventory.tsx";

const equipmentTypeLabels: Record<string, string> = {
    laptop: "Laptop",
    desktop: "Komputer stacjonarny",
    monitor: "Monitor",
    printer: "Drukarka",
    phone: "Telefon",
    server: "Serwer",
    other: "Inne",
};

const equipmentStatusLabels: Record<string, string> = {
    active: "Aktywny",
    available: "Dostępny",
    "in-repair": "W naprawie",
    retired: "Wycofany",
};

const AddEquipmentDialog = () => {
    const { createEquipment, isLoading: isCreating } = useCreateEquipment();
    const [open, setOpen] = useState(false);

    const form = useForm<CreateEquipmentSchema>({
        resolver: zodResolver(createEquipmentSchema),
        defaultValues: {
            name: "",
            type: "laptop",
            serialNumber: "",
            status: "active",
            location: "",
            assignedTo: "",
            assignedDate: "",
        },
    });

    const watchedStatus = form.watch("status");
    const isAssigned = watchedStatus === "active";

    const handleCreate = async (values: CreateEquipmentSchema) => {
        const newEquipment: Omit<Equipment, "id"> = {
            name: values.name,
            type: values.type,
            serialNumber: values.serialNumber,
            status: values.status,
            location: values.location,
            assignedTo: isAssigned && values.assignedTo ? values.assignedTo : null,
            assignedDate: isAssigned && values.assignedDate ? values.assignedDate : null,
        };
        await createEquipment(newEquipment);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Dodaj sprzęt</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
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
                                name="type"
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
                                                {equipmentTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {equipmentTypeLabels[type]}
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
                                                {equipmentStatuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {equipmentStatusLabels[status]}
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
                            name="serialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numer seryjny</FormLabel>
                                    <FormControl>
                                        <Input placeholder="np. DL5520-2024-001" {...field} />
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
                                        <Input placeholder="np. Pokój 204" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isAssigned && (
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="assignedTo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Przypisany do</FormLabel>
                                            <FormControl>
                                                <Input placeholder="np. dr Jan Kowalski" {...field} />
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
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" size="sm">
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