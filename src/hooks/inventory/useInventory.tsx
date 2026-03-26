import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getAllInventoryMock,
    getInventoryByIdMock,
    createInventoryMock,
    updateInventoryMock,
    assignInventoryMock,
    returnInventoryMock,
    sendToServiceMock,
    disposeInventoryMock,
    deleteInventoryMock,
    addInventoryNoteMock,
} from "./mock.inventory";
import { queryClient } from "@/main";
import { toast } from "sonner";
import type { CreateInventoryPayload, UpdateInventoryPayload } from "@/types/inventory";

const INVENTORY_KEY = "inventory";


export const useInventory = () => {
    const { data, isLoading } = useQuery({
        queryKey: [INVENTORY_KEY],
        queryFn: () => getAllInventoryMock(),
        staleTime: 1000 * 30,
        placeholderData: (prev) => prev,
    });
    return { data, isLoading };
};



export const useInventoryById = (id: number) => {
    const { data, isLoading } = useQuery({
        queryKey: [INVENTORY_KEY, id],
        queryFn: () => getInventoryByIdMock(id),
        staleTime: 1000 * 30,
        enabled: !!id,
    });
    return { data, isLoading };
};


export const useCreateInventory = () => {
    const { mutateAsync: createInventory, isPending: isLoading } = useMutation({
        mutationFn: (payload: CreateInventoryPayload) => createInventoryMock(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
            toast.success("Sprzęt dodany");
        },
        onError: () => toast.error("Błąd podczas dodawania"),
    });
    return { createInventory, isLoading };
};



export const useUpdateInventory = () => {
    const { mutateAsync: updateInventory, isPending: isLoading } = useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: UpdateInventoryPayload }) =>
            updateInventoryMock(id, updates),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, id] });
            toast.success("Sprzęt zaktualizowany");
        },
        onError: () => toast.error("Błąd podczas aktualizacji"),
    });
    return { updateInventory, isLoading };
};



export const useAssignInventory = () => {
    const { mutateAsync: assignInventory, isPending: isLoading } = useMutation({
        mutationFn: ({
            id,
            assignedTo,
            assignedBy,
        }: {
            id: number;
            assignedTo: string;
            assignedBy: string;
        }) => assignInventoryMock(id, assignedTo, assignedBy),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, id] });
            toast.success("Sprzęt wydany");
        },
        onError: () => toast.error("Błąd podczas wydawania sprzętu"),
    });
    return { assignInventory, isLoading };
};


export const useReturnInventory = () => {
    const { mutateAsync: returnInventory, isPending: isLoading } = useMutation({
        mutationFn: (id: number) => returnInventoryMock(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, data.id] });
            toast.success("Sprzęt zwrócony do magazynu");
        },
        onError: () => toast.error("Błąd podczas zwrotu sprzętu"),
    });
    return { returnInventory, isLoading };
};



export const useSendToService = () => {
    const { mutateAsync: sendToService, isPending: isLoading } = useMutation({
        mutationFn: (id: number) => sendToServiceMock(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, data.id] });
            toast.success("Sprzęt wysłany do serwisu");
        },
        onError: () => toast.error("Błąd podczas wysyłania do serwisu"),
    });
    return { sendToService, isLoading };
};



export const useDisposeInventory = () => {
    const { mutateAsync: disposeInventory, isPending: isLoading } = useMutation({
        mutationFn: (id: number) => disposeInventoryMock(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, data.id] });
            toast.success("Sprzęt oznaczony jako utylizacja");
        },
        onError: () => toast.error("Błąd podczas oznaczania utylizacji"),
    });
    return { disposeInventory, isLoading };
};



export const useDeleteInventory = () => {
    const { mutateAsync: deleteInventory, isPending: isLoading } = useMutation({
        mutationFn: (id: number) => deleteInventoryMock(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
            toast.success("Sprzęt usunięty");
        },
        onError: () => toast.error("Błąd podczas usuwania"),
    });
    return { deleteInventory, isLoading };
};



export const useAddInventoryNote = (inventoryId: number) => {
    const { mutateAsync: addNote, isPending: isLoading } = useMutation({
        mutationFn: ({ content, author }: { content: string; author: string }) =>
            addInventoryNoteMock(inventoryId, content, author),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, inventoryId] });
        },
        onError: () => toast.error("Błąd podczas dodawania notatki"),
    });
    return { addNote, isLoading };
};