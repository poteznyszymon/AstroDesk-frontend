import { useMutation, useQuery } from "@tanstack/react-query";
import {
    assignEquipmentMock,
    createEquipmentMock,
    deleteEquipmentMock,
    getEquipmentByIdMock,
    getEquipmentMock,
    unassignEquipmentMock,
    updateEquipmentMock,
} from "./mock.inventory.ts";
import { queryClient } from "@/main";
import { toast } from "sonner";
import type { Equipment } from "@/types/equipment";

const EQUIPMENT_KEY = "equipment";

export const useEquipment = () => {
    const { data, isLoading } = useQuery({
        queryKey: [EQUIPMENT_KEY],
        queryFn: () => getEquipmentMock(),
        staleTime: 1000 * 30,
        placeholderData: (prev) => prev,
    });
    return { data, isLoading };
};

export const useEquipmentById = (id: string) => {
    const { data, isLoading } = useQuery({
        queryKey: [EQUIPMENT_KEY, id],
        queryFn: () => getEquipmentByIdMock(id),
        staleTime: 1000 * 30,
        enabled: !!id,
    });
    return { data, isLoading };
};

export const useCreateEquipment = () => {
    const { mutateAsync: createEquipment, isPending: isLoading } = useMutation({
        mutationFn: (equipment: Omit<Equipment, "id">) => createEquipmentMock(equipment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EQUIPMENT_KEY] });
            toast.success("Sprzęt dodany");
        },
        onError: () => toast.error("Błąd podczas dodawania"),
    });
    return { createEquipment, isLoading };
};

export const useUpdateEquipment = () => {
    const { mutateAsync: updateEquipment, isPending: isLoading } = useMutation({
        mutationFn: ({ id, equipment }: { id: string; equipment: Partial<Equipment> }) =>
            updateEquipmentMock(id, equipment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EQUIPMENT_KEY] });
            toast.success("Sprzęt zaktualizowany");
        },
        onError: () => toast.error("Błąd podczas aktualizacji"),
    });
    return { updateEquipment, isLoading };
};

export const useDeleteEquipment = () => {
    const { mutateAsync: deleteEquipment, isPending: isLoading } = useMutation({
        mutationFn: deleteEquipmentMock,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EQUIPMENT_KEY] });
            toast.success("Sprzęt usunięty");
        },
        onError: () => toast.error("Błąd podczas usuwania"),
    });
    return { deleteEquipment, isLoading };
};

export const useAssignEquipment = () => {
    const { mutateAsync: assignEquipment, isPending: isLoading } = useMutation({
        mutationFn: ({ id, assignedTo, assignedDate }: { id: string; assignedTo: string; assignedDate: string }) =>
            assignEquipmentMock(id, assignedTo, assignedDate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EQUIPMENT_KEY] });
            toast.success("Sprzęt przypisany");
        },
        onError: () => toast.error("Błąd podczas przypisywania"),
    });
    return { assignEquipment, isLoading };
};

export const useUnassignEquipment = () => {
    const { mutateAsync: unassignEquipment, isPending: isLoading } = useMutation({
        mutationFn: unassignEquipmentMock,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EQUIPMENT_KEY] });
            toast.success("Przypisanie usunięte");
        },
        onError: () => toast.error("Błąd podczas odpinania sprzętu"),
    });
    return { unassignEquipment, isLoading };
};