import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import EditEquipmentDialog from '@/components/equipment/edit-equipment-dialog';
import DeleteEquipmentDialog from '@/components/equipment/delete-equipment-dialog';
import AddTicketDialog from '@/components/tickets/add-ticket-dialog';
import { useAdmin } from '@/data/mock/admin-context';
import { useInventoryById, useAddInventoryNote, useDeleteInventoryNote, useInventoryHistory } from '@/hooks/inventory/useInventory';
import { useTickets } from '@/hooks/ticket/useTickets';
import { useMe } from '@/hooks/auth/useAuth';
import { statusConfig, priorityConfig } from '@/types/tickets';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Hash, MapPin, Calendar, DollarSign, FileText, User, Package, Send, TicketCheck, ArrowRight, Trash2, Loader2, StickyNote } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { HistoryTimeline } from '@/components/shared/history-timeline';

export const Route = createFileRoute('/(root)/_root/inventory/$id')({
  component: RouteComponent,
});

const statusMap: Record<string, string> = {
  DOSTEPNE:   'Dostępne',
  WYDANE:     'Wydane',
  DO_WYDANIA: 'Do wydania',
  ZAJETE:     'Zajęte',
  W_TRAKCIE:  'W trakcie',
  CANCELLED:  'Anulowane',
  PRZYJETY:   'Przyjęty',
  SERWIS:     'Serwis',
  UTYLIZACJA: 'Utylizacja',
};

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground/70 shrink-0">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "—"}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="mt-0.5 w-4 h-4 shrink-0" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

function SectionSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-28" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: fields }).map((_, i) => (
          <FieldSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isLoading } = useInventoryById(Number(id));
  const { adminView } = useAdmin();
  const { user } = useMe();
  const { addNote, isLoading: isSending } = useAddInventoryNote(Number(id));
  const { deleteNote } = useDeleteInventoryNote(Number(id));
  const { data: ticketsData, isLoading: isTicketsLoading } = useTickets();
  const { data: history, isLoading: isHistoryLoading } = useInventoryHistory(Number(id));
  const [noteContent, setNoteContent] = useState('');
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  const [notesPage, setNotesPage] = useState(0);
  const NOTES_PER_PAGE = 3;

  const activeTickets = useMemo(() => {
    if (!ticketsData?.tickets) return [];
    return ticketsData.tickets.filter(
      (t) => t.linkedInventoryId === Number(id) && (t.status === 'open' || t.status === 'in-progress')
    );
  }, [ticketsData, id]);

  if (isLoading) {
    return (
      <div className="space-y-10 p-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-28" />
            {adminView && (
              <>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          <SectionSkeleton fields={4} />
          <SectionSkeleton fields={3} />
          <SectionSkeleton fields={3} />
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Skeleton className="h-6 w-20" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-4 w-full max-w-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=" space-y-10 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{data?.name || "brak"}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {statusMap[data?.status ?? ''] ?? data?.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{data?.itemType || "brak"}</p>
        </div>

        {data && (
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <AddTicketDialog preselectedDevice={{ id: data.id, name: data.name }} />
            {adminView && (
              <>
                <EditEquipmentDialog item={data} />
                <DeleteEquipmentDialog id={data.id} name={data.name} />
              </>
            )}
          </div>
        )}
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Szczegóły</TabsTrigger>
          <TabsTrigger value="history">Historia</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-10 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            <Section title="Urządzenie">
              <Field icon={<Hash className="w-4 h-4" />} label="Numer seryjny" value={data?.serialNumber || "brak"} />
              <Field icon={<Package className="w-4 h-4" />} label="Model" value={data?.model || "brak"} />
              <Field icon={<MapPin className="w-4 h-4" />} label="Lokalizacja" value={data?.location || "brak"} />
              <Field icon={<User className="w-4 h-4" />} label="Dodane przez" value={data?.author || "brak"} />
            </Section>

            <Section title="Finanse">
              <Field icon={<DollarSign className="w-4 h-4" />} label="Cena" value={data?.price != null ? `${data.price.toFixed(2)} zł` : "brak"} />
              <Field icon={<FileText className="w-4 h-4" />} label="Numer faktury" value={data?.invoiceNumber || "brak"} />
              <Field icon={<Calendar className="w-4 h-4" />} label="Data zakupu" value={data?.boughtDate || "brak"} />
            </Section>

            <Section title="Przypisanie">
              <Field icon={<User className="w-4 h-4" />} label="Przypisano do" value={data?.assignedTo || "brak"} />
              <Field icon={<User className="w-4 h-4" />} label="Przypisano przez" value={data?.assignedBy || "brak"} />
              <Field icon={<Calendar className="w-4 h-4" />} label="Data przypisania" value={data?.assignedDate || "brak"} />
            </Section>
          </div>

          <div className="flex flex-col gap-4 max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
              <TicketCheck className="w-5 h-5 text-muted-foreground" />
              Aktywne zgłoszenia
              {!isTicketsLoading && activeTickets.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">({activeTickets.length})</span>
              )}
            </h2>

            {isTicketsLoading ? (
              <div className="flex flex-col gap-3">
                {[1].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3 gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <Skeleton className="h-4 w-48" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-4 shrink-0" />
                  </div>
                ))}
              </div>
            ) : activeTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">Brak aktywnych zgłoszeń dla tego urządzenia.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {activeTickets.map((ticket) => {
                  const status = statusConfig[ticket.status];
                  const priority = priorityConfig[ticket.priority];
                  const StatusIcon = status.icon;
                  return (
                    <Link
                      key={ticket.id}
                      to="/tickets/$id"
                      params={{ id: ticket.id }}
                      className="flex items-center justify-between rounded-lg border p-3 gap-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground shrink-0">{ticket.id}</span>
                          <span className="text-sm font-medium text-foreground truncate">{ticket.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={status.variant} className="gap-1 text-xs">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.className}`}>
                            {priority.label}
                          </span>
                          {ticket.assignee && (
                            <span className="text-xs text-muted-foreground truncate">{ticket.assignee}</span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 max-w-3xl">
            <h2 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-muted-foreground" />
              Notatki
              {data && data.notes.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">({data.notes.length})</span>
              )}
            </h2>

            <div className="flex gap-2">
              <div className="flex gap-2 flex-1">
                <Input
                  placeholder="Dodaj notatkę..."
                  value={noteContent}
                  disabled={isSending}
                  onChange={(e) => setNoteContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (noteContent.trim() && user) {
                        addNote({ content: noteContent.trim(), author: user.name }).then(() => {
                          setNoteContent('');
                          setNotesPage(0);
                        });
                      }
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="h-9 px-3"
                  disabled={!noteContent.trim() || isSending}
                  onClick={() => {
                    if (noteContent.trim() && user) {
                      addNote({ content: noteContent.trim(), author: user.name }).then(() => {
                        setNoteContent('');
                        setNotesPage(0);
                      });
                    }
                  }}
                >
                  {isSending ? <Loader2 className="animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>

            {data && data.notes.length === 0 && (
              <p className="text-sm text-muted-foreground">Brak notatek dla tego sprzętu.</p>
            )}

            {data && data.notes.length > 0 && (() => {
              const sorted = [...data.notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              const totalPages = Math.ceil(sorted.length / NOTES_PER_PAGE);
              const paginated = sorted.slice(notesPage * NOTES_PER_PAGE, (notesPage + 1) * NOTES_PER_PAGE);
              return (
                <>
                  <div className="flex flex-col gap-3">
                    {paginated.map((note) => (
                      <div key={note.id} className="group rounded-lg border bg-card p-4 shadow-xs flex flex-col gap-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                              {getInitials(note.author)}
                            </div>
                            <span className="text-sm font-medium text-foreground">{note.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(note.createdAt).toLocaleString('pl-PL', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </span>
                          </div>
                          {(adminView || note.author === user?.name) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  disabled={deletingNoteId === note.id}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {deletingNoteId === note.id
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <Trash2 className="w-3.5 h-3.5" />
                                  }
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Usuń notatkę</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Czy na pewno chcesz usunąć tę notatkę? Tej operacji nie można cofnąć.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel size={"sm"}>Anuluj</AlertDialogCancel>
                                  <AlertDialogAction
                                    size={"sm"}
                                    onClick={() => {
                                      setDeletingNoteId(note.id);
                                      deleteNote(note.id).finally(() => setDeletingNoteId(null));
                                    }}
                                  >
                                    Usuń
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {notesPage * NOTES_PER_PAGE + 1}-{Math.min((notesPage + 1) * NOTES_PER_PAGE, sorted.length)} z {sorted.length}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={notesPage === 0}
                          onClick={() => setNotesPage((p) => p - 1)}
                        >
                          Poprzednie
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={notesPage === totalPages - 1}
                          onClick={() => setNotesPage((p) => p + 1)}
                        >
                          Następne
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6 max-w-2xl">
          <HistoryTimeline entries={history} isLoading={isHistoryLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}