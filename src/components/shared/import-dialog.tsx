import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Upload, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ImportValidationResult, ImportSummary } from '@/types/import';

type Step = 'upload' | 'validating' | 'validated' | 'importing' | 'done';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validateFn: (file: File) => Promise<ImportValidationResult>;
  importFn: (file: File, skipErrors: boolean) => Promise<ImportSummary>;
  onSuccess: () => void;
}

export function ImportDialog({ open, onOpenChange, validateFn, importFn, onSuccess }: ImportDialogProps) {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<ImportValidationResult | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setStep('upload');
      setFile(null);
      setValidation(null);
      setSummary(null);
      setError(null);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
  };

  const handleValidate = async () => {
    if (!file) return;
    setStep('validating');
    setError(null);
    try {
      const result = await validateFn(file);
      setValidation(result);
      setStep('validated');
    } catch {
      setError('Błąd podczas walidacji pliku. Sprawdź format pliku i spróbuj ponownie.');
      setStep('upload');
    }
  };

  const handleImport = async (skipErrors: boolean) => {
    if (!file) return;
    setStep('importing');
    try {
      const result = await importFn(file, skipErrors);
      setSummary(result);
      setStep('done');
      onSuccess();
      toast.success(`Zaimportowano ${result.imported} rekordów`);
    } catch {
      setError('Błąd podczas importu. Spróbuj ponownie.');
      setStep('validated');
    }
  };

  const canClose = step !== 'validating' && step !== 'importing';

  return (
    <Dialog open={open} onOpenChange={(v) => canClose && onOpenChange(v)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importuj dane</DialogTitle>
        </DialogHeader>

        {(step === 'upload' || step === 'validating') && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Prześlij plik CSV lub Excel (.xlsx). Nagłówki kolumn muszą być zgodne z formatem eksportu.
            </p>

            <label
              htmlFor="import-file-input"
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                file ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
              }`}
            >
              <Upload className={`h-8 w-8 mb-2 ${file ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">
                {file ? file.name : 'Kliknij lub przeciągnij plik tutaj'}
              </span>
              <span className="text-xs text-muted-foreground mt-1">Obsługiwane formaty: .csv, .xlsx</span>
              <input
                id="import-file-input"
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {step === 'validated' && validation && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between  gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <span>
                  <span className="font-semibold text-green-700">{validation.validCount}</span>
                  {' '}poprawnych rekordów
                </span>
              </div>
              {validation.errorCount > 0 && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    <span>
                      <span className="font-semibold text-destructive">{validation.errorCount}</span>
                      {' '}wierszy z błędami
                    </span>
                  </div>
                </>
              )}
            </div>

            {validation.errors.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Błędy walidacji:</p>
                <div className="overflow-auto max-h-52 rounded-md border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium w-16">Wiersz</th>
                        <th className="text-left px-3 py-2 font-medium w-36">Pole</th>
                        <th className="text-left px-3 py-2 font-medium">Błąd</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validation.errors.map((err, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2 text-muted-foreground">{err.row}</td>
                          <td className="px-3 py-2 font-medium">{err.field}</td>
                          <td className="px-3 py-2 text-destructive">{err.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {step === 'importing' && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
            <Spinner className="h-6 w-6" />
            <p className="text-sm">Importowanie danych…</p>
          </div>
        )}

        {step === 'done' && summary && (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <p className="text-base font-semibold">Import zakończony</p>
            <p className="text-sm text-muted-foreground">
              Zaimportowano <span className="font-medium text-foreground">{summary.imported}</span> rekordów
              {summary.skipped > 0 && (
                <>, pominięto <span className="font-medium text-destructive">{summary.skipped}</span> błędnych wierszy</>
              )}
            </p>
          </div>
        )}

        <DialogFooter>
          {step === 'upload' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Anuluj</Button>
              <Button size="sm" disabled={!file} onClick={handleValidate}>
                Waliduj
              </Button>
            </>
          )}

          {step === 'validating' && (
            <Button size="sm" disabled>
              <Spinner className="mr-2 h-3.5 w-3.5" />
              Walidowanie…
            </Button>
          )}

          {step === 'validated' && validation && (
            <>
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Anuluj</Button>
              {validation.validCount > 0 && (
                <Button
                  size="sm"
                  onClick={() => handleImport(validation.errorCount > 0)}
                >
                  {validation.errorCount > 0
                    ? `Importuj ${validation.validCount} poprawnych`
                    : `Importuj wszystkie ${validation.validCount}`}
                </Button>
              )}
            </>
          )}

          {step === 'importing' && (
            <Button size="sm" disabled>
              <Spinner className="mr-2 h-3.5 w-3.5" />
              Importowanie…
            </Button>
          )}

          {step === 'done' && (
            <Button size="sm" onClick={() => onOpenChange(false)}>Zamknij</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
