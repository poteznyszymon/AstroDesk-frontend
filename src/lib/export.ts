import { downloadFile } from '@/lib/api';

export type ExportFormat = 'xlsx' | 'csv';

const today = () => new Date().toISOString().split('T')[0];

export async function exportTickets(format: ExportFormat) {
  await downloadFile(`/export/tickets?format=${format}`, `zgłoszenia_${today()}.${format}`);
}

export async function exportHistory(format: ExportFormat) {
  await downloadFile(`/export/history?format=${format}`, `historia_zmian_${today()}.${format}`);
}

export async function exportInventory(format: ExportFormat) {
  await downloadFile(`/export/inventory?format=${format}`, `inwentarz_${today()}.${format}`);
}
