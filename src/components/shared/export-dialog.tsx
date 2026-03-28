import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ExportFormat } from '@/lib/export';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rowCount: number;
  onExport: (format: ExportFormat) => Promise<void>;
}

const formats: { value: ExportFormat; label: string; icon: React.ElementType }[] = [
  {
    value: 'xlsx',
    label: 'Excel (.xlsx)',
    icon: FileSpreadsheet,
  },
  {
    value: 'csv',
    label: 'CSV (.csv)',
    icon: FileText,
  },
];

export function ExportDialog({ open, onOpenChange, rowCount, onExport }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('xlsx');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(format);
      onOpenChange(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Eksportuj dane</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Zostanie wyeksportowanych{' '}
          <span className="font-medium text-foreground">{rowCount} {rowCount === 1 ? 'rekord' : rowCount < 5 ? 'rekordy' : 'rekordów'}</span>
          {' '}(zgodnie z aktywnymi filtrami).
        </p>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Format pliku</p>
          <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)} className="flex flex-col gap-2">
            {formats.map(({ value, label, icon: Icon }) => (
              <label
                key={value}
                htmlFor={`format-${value}`}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  format === value ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={value} id={`format-${value}`} className="mt-0.5 shrink-0" />
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${format === value ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="flex items-center">
                  <p className="font-medium text-sm cursor-pointer">{label}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" disabled={isExporting} onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button size="sm" disabled={isExporting} onClick={handleExport}>
            {isExporting ? 'Eksportowanie…' : 'Eksportuj'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
