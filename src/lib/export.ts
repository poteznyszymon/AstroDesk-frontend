import type { Ticket } from '@/types/tickets';
import type { Inventory, InventoryItemType, InventoryStatus } from '@/types/inventory';
import type { HistoryRecord } from '@/types/history';
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
  WYPORZYCZONE: 'Wypożyczone',
  W_TRAKCIE: 'W trakcie',
  SERWIS: 'W serwisie',
  UTYLIZACJA: 'Utylizacja',
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
    'ID': t.ticketId,
    'Tytuł': t.title,
    'Opis': t.description,
    'Status': statusConfig[t.status].label,
    'Priorytet': priorityConfig[t.priority].label,
    'Przypisany do': t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName}` : '—',
    'Zgłoszone przez': `${t.author.firstName} ${t.author.lastName}`,
    'Data utworzenia': t.createdAt,
    'ID urządzenia': t.linkedInventoryId ?? '—',
  }));
  await writeFile(rows, 'Zgłoszenia', `zgłoszenia_${today()}`, format);
}

export async function exportHistory(records: HistoryRecord[], format: ExportFormat) {
  const rows = records.map((r) => ({
    'ID': r.id,
    'Typ obiektu': r.targetType === 'INVENTORY' ? 'Sprzęt' : 'Ticket',
    'ID obiektu': r.targetId,
    'Pole': r.fieldName ?? '—',
    'Poprzednia wartość': r.oldValue ?? '—',
    'Nowa wartość': r.newValue ?? '—',
    'Wiadomość': r.message ?? '—',
    'Zmienione przez': r.changedBy,
    'Data zmiany': r.changedAt,
  }));
  await writeFile(rows, 'Historia zmian', `historia_zmian_${today()}`, format);
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
    'Przypisany do': i.assignedTo ? `${i.assignedTo.firstName} ${i.assignedTo.lastName}` : '—',
    'Przypisany przez': i.assignedBy ? `${i.assignedBy.firstName} ${i.assignedBy.lastName}` : '—',
    'Data przypisania': i.assignedDate ?? '—',
    'Data zakupu': i.boughtDate ?? '—',
    'Cena': i.price ?? '—',
    'Numer faktury': i.invoiceNumber ?? '—',
  }));
  await writeFile(rows, 'Inwentarz', `inwentarz_${today()}`, format);
}
