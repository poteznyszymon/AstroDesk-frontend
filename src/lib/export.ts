import type { Ticket } from '@/types/tickets';
import type { Inventory, InventoryItemType, InventoryStatus } from '@/types/inventory';
import { statusConfig, priorityConfig } from '@/types/tickets';

const itemTypeLabels: Record<InventoryItemType, string> = {
  LAPTOP: 'Laptop',
  KOMPUTER: 'Komputer',
  DRUKARKA: 'Drukarka',
  ROUTER: 'Router',
  SWITCH: 'Switch',
  TELEFON: 'Telefon',
};

const inventoryStatusLabels: Record<InventoryStatus, string> = {
  DOSTEPNE: 'Dostępne',
  DO_WYDANIA: 'Do wydania',
  WYDANE: 'Wydane',
  ZAJETE: 'Zajęte',
  W_TRAKCIE: 'W trakcie',
  PRZYJETY: 'Przyjęty',
  SERWIS: 'W serwisie',
  UTYLIZACJA: 'Utylizacja',
  CANCELLED: 'Anulowane',
};

export type ExportFormat = 'xlsx' | 'csv';

const today = () => new Date().toISOString().split('T')[0];

async function writeFile(rows: Record<string, unknown>[], sheetName: string, filename: string, format: ExportFormat) {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.${format}`);
}

export async function exportTickets(tickets: Ticket[], format: ExportFormat) {
  const rows = tickets.map((t) => ({
    'ID': t.id,
    'Tytuł': t.title,
    'Opis': t.description,
    'Status': statusConfig[t.status].label,
    'Priorytet': priorityConfig[t.priority].label,
    'Przypisany do': t.assignee ?? '—',
    'Zgłoszone przez': t.createdBy,
    'Data utworzenia': t.createdAt,
    'Ostatnia aktualizacja': t.updatedAt ?? '—',
    'ID urządzenia': t.linkedInventoryId ?? '—',
  }));
  await writeFile(rows, 'Zgłoszenia', `zgłoszenia_${today()}`, format);
}

export async function exportInventory(items: Inventory[], format: ExportFormat) {
  const rows = items.map((i) => ({
    'ID': i.id,
    'Nazwa': i.name,
    'Typ': itemTypeLabels[i.itemType],
    'Numer seryjny': i.serialNumber,
    'Model': i.model ?? '—',
    'Status': inventoryStatusLabels[i.status],
    'Lokalizacja': i.location ?? '—',
    'Przypisany do': i.assignedTo ?? '—',
    'Przypisany przez': i.assignedBy ?? '—',
    'Data przypisania': i.assignedDate ?? '—',
    'Data zakupu': i.boughtDate ?? '—',
    'Cena': i.price ?? '—',
    'Numer faktury': i.invoiceNumber ?? '—',
  }));
  await writeFile(rows, 'Inwentarz', `inwentarz_${today()}`, format);
}
