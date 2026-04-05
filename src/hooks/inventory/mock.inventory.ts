import type {
    Inventory,
    InventoryNote,
    InventoryStatus,
    CreateInventoryPayload,
    UpdateInventoryPayload,
} from "@/types/inventory";
import { mockInventoryHistory } from "./mock.inventory-history";
import type { HistoryEntry } from "@/types/history";

const statusLabels: Record<InventoryStatus, string> = {
    DOSTEPNE: 'Dostępne',
    DO_WYDANIA: 'Do wydania',
    WYDANE: 'Wydane',
    ZAJETE: 'Zajęte',
    W_TRAKCIE: 'W trakcie',
    PRZYJETY: 'Przyjęty',
    SERWIS: 'W serwisie',
    UTYLIZACJA: 'Utylizacja',
    ANULOWANE: 'Anulowane',
};

const editableFieldLabels: Partial<Record<keyof Inventory, string>> = {
    name: 'Nazwa',
    model: 'Model',
    serialNumber: 'Numer seryjny',
    location: 'Lokalizacja',
    boughtDate: 'Data zakupu',
    price: 'Cena',
    invoiceNumber: 'Numer faktury',
    itemType: 'Typ sprzętu',
};

let historyIdCounter = 1000;
const nextHistoryId = () => `ih-gen-${historyIdCounter++}`;

function pushHistory(inventoryId: number, entry: Omit<HistoryEntry, 'id'>) {
    if (!mockInventoryHistory[inventoryId]) mockInventoryHistory[inventoryId] = [];
    mockInventoryHistory[inventoryId].unshift({ ...entry, id: nextHistoryId() });
}


export const mockInventory: Inventory[] = [
    {
        id: 1,
        name: "Dell Latitude 5520",
        itemType: "LAPTOP",
        serialNumber: "DL5520-2024-001",
        model: "Latitude 5520",
        boughtDate: "2024-03-01",
        price: 4299.99,
        invoiceNumber: "FV/2024/03/0041",
        location: "Pokój 204",
        assignedTo: "dr hab. Jan Kowalski",
        assignedBy: "admin",
        assignedDate: "2024-03-15",
        status: "WYDANE",
        author: "admin",
        notes: [],
    },
    {
        id: 2,
        name: "HP ProDesk 400 G7",
        itemType: "KOMPUTER",
        serialNumber: "HP400G7-2024-002",
        model: "ProDesk 400 G7",
        boughtDate: "2024-01-05",
        price: 2899.0,
        invoiceNumber: "FV/2024/01/0012",
        location: "Dziekanat",
        assignedTo: "mgr Anna Nowak",
        assignedBy: "admin",
        assignedDate: "2024-01-10",
        status: "WYDANE",
        author: "admin",
        notes: [],
    },
    {
        id: 3,
        name: "HP LaserJet Pro M404dn",
        itemType: "DRUKARKA",
        serialNumber: "HPM404DN-2023-003",
        model: "LaserJet Pro M404dn",
        boughtDate: "2023-06-10",
        price: 1299.0,
        invoiceNumber: "FV/2023/06/0088",
        location: "Sala wykładowa A1",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "SERWIS",
        author: "admin",
        notes: [
            { id: 1, content: "Wymiana bębna drukującego - oddana do serwisu 2024-11-20.", author: "admin", createdAt: "2024-11-20T10:30:00Z" },
            { id: 2, content: "Serwis poinformował, że naprawa potrwa ok. 2 tygodnie.", author: "Jan Kowalski", createdAt: "2024-11-22T14:15:00Z" },
        ],
    },
    {
        id: 4,
        name: "TP-Link TL-ER7206",
        itemType: "ROUTER",
        serialNumber: "TPLER7206-2023-004",
        model: "TL-ER7206",
        boughtDate: "2023-09-15",
        price: 849.0,
        invoiceNumber: "FV/2023/09/0155",
        location: "Serwerownia",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "DOSTEPNE",
        author: "admin",
        notes: [
            { id: 3, content: "Router zapasowy – nie podłączać bez konsultacji z IT.", author: "admin", createdAt: "2023-09-16T08:00:00Z" },
        ],
    },
    {
        id: 5,
        name: "Cisco Catalyst 2960-X",
        itemType: "SWITCH",
        serialNumber: "CC2960X-2022-005",
        model: "Catalyst 2960-X 24-port",
        boughtDate: "2022-04-20",
        price: 3200.0,
        invoiceNumber: "FV/2022/04/0033",
        location: "Serwerownia",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "ZAJETE",
        author: "admin",
        notes: [],
    },
    {
        id: 6,
        name: "iPhone 14 Pro",
        itemType: "TELEFON",
        serialNumber: "IP14P-2023-006",
        model: "iPhone 14 Pro 256GB",
        boughtDate: "2023-11-01",
        price: 5499.0,
        invoiceNumber: "FV/2023/11/0201",
        location: "Sekretariat",
        assignedTo: "mgr inż. Katarzyna Zielińska",
        assignedBy: "admin",
        assignedDate: "2023-11-05",
        status: "WYDANE",
        author: "admin",
        notes: [],
    },
    {
        id: 7,
        name: "Lenovo ThinkPad X1 Carbon",
        itemType: "LAPTOP",
        serialNumber: "LTX1C-2024-007",
        model: "ThinkPad X1 Carbon Gen 11",
        boughtDate: "2024-02-14",
        price: 6799.0,
        invoiceNumber: "FV/2024/02/0029",
        location: "Magazyn IT",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "DOSTEPNE",
        author: "admin",
        notes: [
            { id: 4, content: "Nowy, nierozpakowany. Czeka na przypisanie.", author: "admin", createdAt: "2024-02-14T12:00:00Z" },
        ],
    },
    {
        id: 8,
        name: "Dell Precision 5570",
        itemType: "LAPTOP",
        serialNumber: "DP5570-2024-008",
        model: "Precision 5570",
        boughtDate: "2024-07-01",
        price: 7299.0,
        invoiceNumber: "FV/2024/07/0077",
        location: "Pokój 405",
        assignedTo: "dr inż. Tomasz Lewandowski",
        assignedBy: "admin",
        assignedDate: "2024-07-05",
        status: "WYDANE",
        author: "admin",
        notes: [],
    },
    {
        id: 9,
        name: "Dell OptiPlex 7090",
        itemType: "KOMPUTER",
        serialNumber: "DO7090-2023-009",
        model: "OptiPlex 7090",
        boughtDate: "2023-03-12",
        price: 3199.0,
        invoiceNumber: "FV/2023/03/0061",
        location: "Laboratorium 203",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "DOSTEPNE",
        author: "admin",
        notes: [],
    },
    {
        id: 10,
        name: "MacBook Pro 14 M3",
        itemType: "LAPTOP",
        serialNumber: "MBP14M3-2024-010",
        model: "MacBook Pro 14\" M3",
        boughtDate: "2024-10-01",
        price: 9299.0,
        invoiceNumber: "FV/2024/10/0110",
        location: "Pokój 210",
        assignedTo: "Jan Kowalski",
        assignedBy: "admin",
        assignedDate: "2024-10-03",
        status: "WYDANE",
        author: "admin",
        notes: [],
    },
    {
        id: 11,
        name: "Epson EcoTank ET-4850",
        itemType: "DRUKARKA",
        serialNumber: "EPT4850-2024-011",
        model: "EcoTank ET-4850",
        boughtDate: "2024-01-20",
        price: 899.0,
        invoiceNumber: "FV/2024/01/0020",
        location: "Dziekanat",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "DOSTEPNE",
        author: "admin",
        notes: [],
    },
    {
        id: 12,
        name: "HP EliteDesk 800 G6",
        itemType: "KOMPUTER",
        serialNumber: "HPE800G6-2023-012",
        model: "EliteDesk 800 G6",
        boughtDate: "2021-05-10",
        price: 2499.0,
        invoiceNumber: "FV/2021/05/0050",
        location: "Magazyn IT",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "UTYLIZACJA",
        author: "admin",
        notes: [
            { id: 5, content: "Sprzęt przeznaczony do utylizacji — dysk wymontowany i zniszczony.", author: "admin", createdAt: "2023-06-01T09:00:00Z" },
        ],
    },
    {
        id: 13,
        name: "Samsung Galaxy S24",
        itemType: "TELEFON",
        serialNumber: "SGS24-2024-013",
        model: "Galaxy S24 128GB",
        boughtDate: "2024-04-01",
        price: 3799.0,
        invoiceNumber: "FV/2024/04/0044",
        location: "Magazyn IT",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "DO_WYDANIA",
        author: "admin",
        notes: [
            { id: 6, content: "Przygotowany do wydania dla nowego pracownika.", author: "admin", createdAt: "2024-04-01T11:00:00Z" },
        ],
    },
    {
        id: 14,
        name: "TP-Link TL-SG1024",
        itemType: "SWITCH",
        serialNumber: "TPSG1024-2023-014",
        model: "TL-SG1024 24-port",
        boughtDate: "2023-08-22",
        price: 499.0,
        invoiceNumber: "FV/2023/08/0140",
        location: "Laboratorium 101",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "PRZYJETY",
        author: "admin",
        notes: [
            { id: 7, content: "Przyjęty na stan, czeka na konfigurację.", author: "admin", createdAt: "2023-08-22T13:00:00Z" },
        ],
    },
    {
        id: 15,
        name: "MikroTik hEX S",
        itemType: "ROUTER",
        serialNumber: "MTHEX-2022-015",
        model: "hEX S RB760iGS",
        boughtDate: "2022-11-05",
        price: 379.0,
        invoiceNumber: "FV/2022/11/0095",
        location: "Laboratorium 101",
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "W_TRAKCIE",
        author: "admin",
        notes: [
            { id: 8, content: "W trakcie konfiguracji sieci laboratoryjnej.", author: "admin", createdAt: "2022-11-06T10:00:00Z" },
        ],
    },
];

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

const nextId = (): number =>
    mockInventory.reduce((max, item) => Math.max(max, item.id), 0) + 1;

const nextNoteId = (): number => {
    let max = 0;
    for (const item of mockInventory) {
        for (const note of item.notes) {
            if (note.id > max) max = note.id;
        }
    }
    return max + 1;
};


export const getAllInventoryMock = async (): Promise<Inventory[]> => {
    await delay(800);
    return [...mockInventory];
};


export const getInventoryByIdMock = async (id: number): Promise<Inventory> => {
    await delay(400);
    const item = mockInventory.find(i => i.id === id);
    if (!item) throw new Error(`Inventory item with id ${id} not found`);
    return { ...item };
};



export const createInventoryMock = async (
    payload: CreateInventoryPayload
): Promise<Inventory> => {
    await delay(600);
    const newItem: Inventory = {
        ...payload,
        author: "admin",
        id: nextId(),
        assignedTo: payload.assignedTo ?? null,
        assignedBy: null,
        assignedDate: null,
        status: payload.status,
        notes: [],
    };
    mockInventory.unshift(newItem);
    const now = new Date().toISOString();
    pushHistory(newItem.id, { author: 'admin', timestamp: now, type: 'created', description: 'Sprzęt został dodany do inwentarza.' });
    return { ...newItem };
};


export const updateInventoryMock = async (
    id: number,
    updates: UpdateInventoryPayload
): Promise<Inventory> => {
    await delay(400);
    const idx = mockInventory.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Inventory item with id ${id} not found`);
    const old = mockInventory[idx];
    mockInventory[idx] = { ...old, ...updates };
    const now = new Date().toISOString();

    if (updates.status !== undefined && updates.status !== old.status) {
        pushHistory(id, { author: 'admin', timestamp: now, type: 'status_changed', description: 'Zmieniono status sprzętu.', from: statusLabels[old.status], to: statusLabels[updates.status] });
    }
    const editableFields = Object.keys(editableFieldLabels) as (keyof typeof editableFieldLabels)[];
    for (const field of editableFields) {
        const oldVal = old[field];
        const newVal = updates[field as keyof UpdateInventoryPayload];
        if (newVal !== undefined && String(newVal) !== String(oldVal ?? '')) {
            const label = editableFieldLabels[field]!;
            const fromStr = oldVal != null ? String(oldVal) : undefined;
            const toStr = String(newVal);
            pushHistory(id, { author: 'admin', timestamp: now, type: 'edited', description: `Zmieniono pole: ${label}.`, from: fromStr, to: toStr });
        }
    }

    return { ...mockInventory[idx] };
};



export const assignInventoryMock = async (
    id: number,
    assignedTo: string,
    assignedBy: string
): Promise<Inventory> => {
    await delay(400);
    const idx = mockInventory.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Inventory item with id ${id} not found`);
    const item = mockInventory[idx];
    if (item.status !== "DOSTEPNE") {
        throw new Error("Inventory item must be DOSTEPNE to assign");
    }
    mockInventory[idx] = {
        ...item,
        assignedTo,
        assignedBy,
        assignedDate: new Date().toISOString().split("T")[0],
        status: "WYDANE",
    };
    pushHistory(id, { author: assignedBy, timestamp: new Date().toISOString(), type: 'assigned', description: `Sprzęt wydano użytkownikowi ${assignedTo}.`, to: assignedTo });
    return { ...mockInventory[idx] };
};



export const returnInventoryMock = async (id: number): Promise<Inventory> => {
    await delay(400);
    const idx = mockInventory.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Inventory item with id ${id} not found`);
    const item = mockInventory[idx];
    if (item.status !== "WYDANE") {
        throw new Error("Inventory item must be WYDANE to return");
    }
    mockInventory[idx] = {
        ...item,
        assignedTo: null,
        assignedBy: null,
        assignedDate: null,
        status: "DOSTEPNE",
    };
    pushHistory(id, { author: 'admin', timestamp: new Date().toISOString(), type: 'returned', description: `Sprzęt zwrócony do magazynu${item.assignedTo ? ` przez ${item.assignedTo}` : ''}.`, from: item.assignedTo ?? undefined });
    return { ...mockInventory[idx] };
};



export const sendToServiceMock = async (id: number): Promise<Inventory> => {
    await delay(400);
    const idx = mockInventory.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Inventory item with id ${id} not found`);
    const item = mockInventory[idx];
    if (item.status === "UTYLIZACJA") {
        throw new Error("Inventory item in UTYLIZACJA cannot be sent to service");
    }
    mockInventory[idx] = { ...item, status: "SERWIS" };
    pushHistory(id, { author: 'admin', timestamp: new Date().toISOString(), type: 'sent_to_service', description: 'Sprzęt oddany do serwisu.' });
    return { ...mockInventory[idx] };
};



export const disposeInventoryMock = async (id: number): Promise<Inventory> => {
    await delay(400);
    const idx = mockInventory.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Inventory item with id ${id} not found`);
    mockInventory[idx] = { ...mockInventory[idx], status: "UTYLIZACJA" };
    pushHistory(id, { author: 'admin', timestamp: new Date().toISOString(), type: 'disposed', description: 'Sprzęt przeznaczony do utylizacji.' });
    return { ...mockInventory[idx] };
};



export const deleteInventoryMock = async (id: number): Promise<void> => {
    await delay(400);
    const idx = mockInventory.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Inventory item with id ${id} not found`);
    mockInventory.splice(idx, 1);
};



export const deleteInventoryNoteMock = async (
    inventoryId: number,
    noteId: number,
): Promise<void> => {
    await delay(800);
    const idx = mockInventory.findIndex(i => i.id === inventoryId);
    if (idx === -1) throw new Error(`Inventory item with id ${inventoryId} not found`);
    const noteIdx = mockInventory[idx].notes.findIndex(n => n.id === noteId);
    if (noteIdx === -1) throw new Error(`Note with id ${noteId} not found`);
    mockInventory[idx].notes.splice(noteIdx, 1);
};



export const addInventoryNoteMock = async (
    id: number,
    content: string,
    author: string,
): Promise<InventoryNote> => {
    await delay(900);
    const idx = mockInventory.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Inventory item with id ${id} not found`);
    const note: InventoryNote = {
        id: nextNoteId(),
        content,
        author,
        createdAt: new Date().toISOString(),
    };
    mockInventory[idx].notes.push(note);
    return { ...note };
};