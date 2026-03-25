export type InventoryItemType =
    | "LAPTOP"
    | "KOMPUTER"
    | "DRUKARKA"
    | "ROUTER"
    | "SWITCH"
    | "TELEFON";

export type InventoryStatus =
    | "DO_WYDANIA"
    | "WYDANE"
    | "DOSTEPNE"
    | "ZAJETE"
    | "W_TRAKCIE"
    | "CANCELLED"
    | "PRZYJETY"
    | "SERWIS"
    | "UTYLIZACJA";

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
    notes: string | null;
}

export type CreateInventoryPayload = Omit<
    Inventory,
    "id" | "author" | "assignedBy"
>;

export type UpdateInventoryPayload = Partial<CreateInventoryPayload>;