import { api, uploadFile } from "@/lib/api";
import type { ImportValidationResult, ImportSummary } from "@/types/import";
import type { Inventory, CreateInventoryPayload, UpdateInventoryPayload, InventoryNote, AssignableInventory } from "@/types/inventory";
import type { HistoryEntry } from "@/types/history";

interface BackendHistoryEntry {
    id: number;
    targetType: string;
    targetId: number;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    message: string | null;
    changedBy: string;
    changedAt: string;
}

const fieldLabels: Record<string, string> = {
    name: "Nazwa",
    itemType: "Typ sprzętu",
    serialNumber: "Numer seryjny",
    model: "Model",
    boughtDate: "Data zakupu",
    price: "Cena",
    invoiceNumber: "Numer faktury",
    location: "Lokalizacja",
    assignedTo: "Przypisano do",
    assignedBy: "Przypisano przez",
    assignedDate: "Data przypisania",
    status: "Status",
    priority: "Priorytet",
    author: "Autor",
    title: "Tytuł",
    description: "Opis",
    assigneeId: "Przypisany",
    linkedInventoryId: "Powiązane urządzenie",
};

const fieldNameToType = (fieldName: string): HistoryEntry["type"] => {
    switch (fieldName) {
        case "assignedTo": return "assigned";
        case "status": return "status_changed";
        case "priority": return "priority_changed";
        default: return "edited";
    }
};

const mapHistoryEntry = (entry: BackendHistoryEntry): HistoryEntry => {
    if (entry.message && !entry.fieldName) {
        const msg = entry.message.toLowerCase();
        let type: HistoryEntry["type"] = "edited";
        if (msg.includes("utworzon")) type = "created";
        else if (msg.includes("przypisano")) type = "assigned";
        else if (msg.includes("zwrócon")) type = "returned";
        else if (msg.includes("serwis")) type = "sent_to_service";
        else if (msg.includes("zutylizow") || msg.includes("utylizacj")) type = "disposed";

        return {
            id: String(entry.id),
            author: entry.changedBy,
            timestamp: entry.changedAt,
            type,
            description: entry.message,
        };
    }

    return {
        id: String(entry.id),
        author: entry.changedBy,
        timestamp: entry.changedAt,
        type: fieldNameToType(entry.fieldName ?? ""),
        description: entry.fieldName ? `Zmieniono: ${fieldLabels[entry.fieldName] ?? entry.fieldName}` : "",
        from: entry.oldValue ?? undefined,
        to: entry.newValue ?? undefined,
    };
};

export const getAllInventory = (): Promise<Inventory[]> =>
    api.get<Inventory[]>("/inventory");

export const getAssignableInventory = (): Promise<AssignableInventory[]> =>
    api.get<AssignableInventory[]>("/inventory/assignable");

export const getInventoryById = (id: number): Promise<Inventory> =>
    api.get<Inventory>(`/inventory/${id}`);

export const createInventory = (payload: CreateInventoryPayload): Promise<Inventory> =>
    api.post<Inventory>("/inventory", payload);

export const updateInventory = (id: number, updates: UpdateInventoryPayload): Promise<Inventory> =>
    api.patch<Inventory>(`/inventory/${id}`, updates);

export const assignInventory = (id: number, assignedTo: string, assignedBy: string): Promise<Inventory> =>
    api.patch<Inventory>(`/inventory/${id}/assign?assignedTo=${encodeURIComponent(assignedTo)}&assignedBy=${encodeURIComponent(assignedBy)}`);

export const returnInventory = (id: number): Promise<Inventory> =>
    api.patch<Inventory>(`/inventory/${id}/return`);

export const sendToService = (id: number): Promise<Inventory> =>
    api.patch<Inventory>(`/inventory/${id}/service`);

export const disposeInventory = (id: number): Promise<Inventory> =>
    api.patch<Inventory>(`/inventory/${id}/dispose`);

export const deleteInventory = (id: number): Promise<void> =>
    api.delete<void>(`/inventory/${id}`);

export const getInventoryNotes = (inventoryId: number): Promise<InventoryNote[]> =>
    api.get<InventoryNote[]>(`/inventory/${inventoryId}/notes`);

export const addInventoryNote = (inventoryId: number, content: string, author: string): Promise<InventoryNote> =>
    api.post<InventoryNote>(`/inventory/${inventoryId}/notes`, { content, author });

export const deleteInventoryNote = (inventoryId: number, noteId: number): Promise<void> =>
    api.delete<void>(`/inventory/${inventoryId}/notes/${noteId}`);

export const validateInventoryImport = (file: File): Promise<ImportValidationResult> =>
    uploadFile<ImportValidationResult>('/import/inventory/validate', file);

export const importInventory = (file: File, skipErrors: boolean): Promise<ImportSummary> =>
    uploadFile<ImportSummary>(`/import/inventory?skipErrors=${skipErrors}`, file);

export const getInventoryHistory = async (inventoryId: number): Promise<HistoryEntry[]> => {
    const entries = await api.get<BackendHistoryEntry[]>(`/inventory/${inventoryId}/history`);
    return entries.map(mapHistoryEntry);
};
