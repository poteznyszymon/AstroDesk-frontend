export type InventoryItemType =
    | "LAPTOP"
    | "KOMPUTER"
    | "DRUKARKA"
    | "ROUTER"
    | "SWITCH"
    | "TELEFON";

export type InventoryStatus =
    | "DOSTEPNE"
    | "DO_WYDANIA"
    | "WYDANE"
    | "WYPORZYCZONE"
    | "W_TRAKCIE"
    | "SERWIS"
    | "UTYLIZACJA";

export interface InventoryNote {
    id: number;
    content: string;
    author: string;
    createdAt: string;
}

export interface Inventory {
    id: number;
    name: string;
    itemType: InventoryItemType;
    serialNumber: string;
    model: string | null;
    boughtDate: string | null;
    price: number | null;
    invoiceNumber: string | null;
    location: string | null;
    assignedTo: string | null;
    assignedBy: string | null;
    assignedDate: string | null;
    status: InventoryStatus;
    author: string;
    notes: InventoryNote[];
}

export type CreateInventoryPayload = Omit<
    Inventory,
    "id" | "author" | "assignedBy" | "notes"
>;

export type UpdateInventoryPayload = Partial<CreateInventoryPayload>;
