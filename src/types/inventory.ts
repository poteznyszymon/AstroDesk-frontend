export type InventoryItemType =
    | "LAPTOP"
    | "KOMPUTER"
    | "DRUKARKA"
    | "ROUTER"
    | "SWITCH"
    | "TELEFON"
    | "SFP";

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

export interface UserRef {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface Inventory {
    id: number;
    name: string;
    itemType: InventoryItemType;
    serialNumber: string;
    inventoryNumber: string | null;
    model: string | null;
    boughtDate: string | null;
    price: number | null;
    invoiceNumber: string | null;
    location: string | null;
    port: string | null;
    assignedTo: UserRef | null;
    assignedBy: UserRef | null;
    assignedDate: string | null;
    status: InventoryStatus;
    author: UserRef;
    notes: InventoryNote[];
    connectionsCount: number;
}

export type CreateInventoryPayload = Omit<
    Inventory,
    "id" | "author" | "assignedBy" | "notes" | "connectionsCount"
>;

export type UpdateInventoryPayload = Partial<CreateInventoryPayload>;

export interface InventoryConnection {
    connectionId: number;
    connectedDeviceId: number;
    connectedDeviceName: string;
    connectedDeviceSerialNumber: string;
    connectedDeviceItemType: InventoryItemType;
    connectedDeviceStatus: InventoryStatus;
    createdBy: UserRef;
    createdAt: string;
}

export interface AssignableInventory {
    id: number;
    name: string;
    serialNumber: string;
    itemType: InventoryItemType;
    status: InventoryStatus;
}
