export interface ImportRowError {
  row: number;
  field: string;
  message: string;
}

export interface ImportValidationResult {
  totalRows: number;
  validCount: number;
  errorCount: number;
  errors: ImportRowError[];
}

export interface ImportSummary {
  imported: number;
  skipped: number;
  errors: ImportRowError[];
}
