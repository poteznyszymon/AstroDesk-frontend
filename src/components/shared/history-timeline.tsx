import { Skeleton } from '@/components/ui/skeleton';
import type { HistoryEntry, HistoryEntryType } from '@/types/history';
import {
  PlusCircle,
  RefreshCw,
  Flag,
  UserCheck,
  UserMinus,
  Pencil,
  Monitor,
  RotateCcw,
  Wrench,
  Trash2,
} from 'lucide-react';

const entryConfig: Record<HistoryEntryType, { icon: React.ElementType; color: string }> = {
  created:        { icon: PlusCircle,  color: 'text-blue-500' },
  status_changed: { icon: RefreshCw,   color: 'text-violet-500' },
  priority_changed:{ icon: Flag,       color: 'text-orange-500' },
  assigned:       { icon: UserCheck,   color: 'text-green-500' },
  unassigned:     { icon: UserMinus,   color: 'text-muted-foreground' },
  edited:         { icon: Pencil,      color: 'text-slate-500' },
  linked_device:  { icon: Monitor,     color: 'text-teal-500' },
  returned:       { icon: RotateCcw,   color: 'text-muted-foreground' },
  sent_to_service:{ icon: Wrench,      color: 'text-orange-500' },
  disposed:       { icon: Trash2,      color: 'text-destructive' },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

function HistoryEntryItem({ entry }: { entry: HistoryEntry }) {
  const config = entryConfig[entry.type];
  const Icon = config.icon;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className={`mt-0.5 ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-px flex-1 bg-border mt-2" />
      </div>
      <div className="pb-6 flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
            {getInitials(entry.author)}
          </div>
          <span className="text-sm font-medium text-foreground">{entry.author}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(entry.timestamp).toLocaleString('pl-PL', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{entry.description}</p>
        {(entry.from || entry.to) && (
          <div className="flex items-center gap-1.5 mt-0.5">
            {entry.from && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground line-through">
                {entry.from}
              </span>
            )}
            {entry.from && entry.to && <span className="text-xs text-muted-foreground">→</span>}
            {entry.to && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-foreground font-medium">
                {entry.to}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryTimelineSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center shrink-0">
            <Skeleton className="w-4 h-4 rounded-full mt-0.5" />
            <div className="w-px flex-1 bg-border mt-2" />
          </div>
          <div className="pb-6 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HistoryTimeline({
  entries,
  isLoading,
}: {
  entries?: HistoryEntry[];
  isLoading: boolean;
}) {
  if (isLoading) return <HistoryTimelineSkeleton />;

  if (!entries || entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak historii dla tego elementu.</p>;
  }

  return (
    <div className="flex flex-col">
      {entries.map((entry, idx) => (
        <div key={entry.id} className={idx === entries.length - 1 ? '[&_.border]:hidden' : ''}>
          <HistoryEntryItem entry={entry} />
        </div>
      ))}
    </div>
  );
}
