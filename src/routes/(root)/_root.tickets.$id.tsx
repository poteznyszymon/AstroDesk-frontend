import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTicketById, useDeleteTicket, useTicketHistory, useAcceptTicket, useOpenTicket, useResolveTicket, useCloseTicket, useCancelTicket } from '@/hooks/ticket/useTickets';
import { useInventoryById } from '@/hooks/inventory/useInventory';
import { useAdmin } from '@/data/mock/admin-context';
import { statusConfig, priorityConfig } from '@/types/tickets';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditTicketDialog from '@/components/tickets/edit-ticket-dialog';
import AssignTicketDialog from '@/components/tickets/assign-ticket-dialog';
import { HistoryTimeline } from '@/components/shared/history-timeline';
import { TicketMessages } from '@/components/tickets/ticket-messages';
import { Spinner } from '@/components/ui/spinner';
import { Trash2, Edit, User, Calendar, Monitor, Link, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/(root)/_root/tickets/$id')({
  component: RouteComponent,
});

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground/70 shrink-0">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || '—'}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
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

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isLoading } = useTicketById(id);
  const { isTicketAdmin: adminView } = useAdmin();
  const { data: linkedDevice, isLoading: isDeviceLoading } = useInventoryById(data?.linkedInventoryId ?? 0);
  const { deleteTicket, isLoading: isDeleting } = useDeleteTicket();
  const { accept, isLoading: isAccepting } = useAcceptTicket();
  const { open, isLoading: isOpening } = useOpenTicket();
  const { resolve, isLoading: isResolving } = useResolveTicket();
  const { close, isLoading: isClosing } = useCloseTicket();
  const { cancel, isLoading: isCancelling } = useCancelTicket();
  const { data: history, isLoading: isHistoryLoading } = useTicketHistory(id);
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const statusPending = isAccepting || isOpening || isResolving || isClosing || isCancelling;

  const handleDelete = async () => {
    await deleteTicket(Number(id));
    setDeleteOpen(false);
    navigate({ to: '/tickets' });
  };

  const handleCancel = async () => {
    await cancel(Number(id));
    setCancelOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-10 p-2">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-72" />
            <div className="flex gap-2 mt-1">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
          {adminView && (
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-28" />
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-24" />
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-3/4 max-w-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const status = statusConfig[data.status];
  const priority = priorityConfig[data.priority];
  const StatusIcon = status.icon;

  const nextStep: { label: string; action: (id: number) => Promise<unknown> } | null = {
    OCZEKIWANIE_NA_AKCEPTACJE: { label: 'Zaakceptuj', action: accept   },
    OTWARTE:                   { label: 'Rozpocznij', action: open     },
    W_TRAKCIE:                 { label: 'Rozwiąż',    action: resolve  },
    ROZWIAZANE:                { label: 'Zamknij',    action: close    },
    ZAMKNIETE:                 null,
    ANULOWANE:                 null,
  }[data.status] ?? null;

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">{data.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={status.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.className}`}>
              {priority.label}
            </span>
          </div>
        </div>

        {adminView && (
          <div className="flex items-center gap-2 shrink-0">
            {nextStep && (
              <>
                <Button
                  size="sm"
                  className="gap-2"
                  disabled={statusPending}
                  onClick={() => nextStep.action(data.ticketId)}
                >
                  <ArrowRight className="w-4 h-4" />
                  {nextStep.label}
                  {statusPending && !isCancelling && <Spinner />}
                </Button>
                {data.status !== 'ROZWIAZANE' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled={statusPending}
                    onClick={() => setCancelOpen(true)}
                  >
                    Anuluj zgłoszenie
                  </Button>
                )}
              </>
            )}
            {data.status !== 'ZAMKNIETE' && data.status !== 'ANULOWANE' && (
              <AssignTicketDialog ticketId={data.ticketId} />
            )}
            <Button size="sm" variant="outline" className="gap-2" onClick={() => setEditOpen(true)}>
              <Edit className="w-4 h-4" /> Edytuj
            </Button>
            <Button size="sm" variant="destructive" className="gap-2" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="w-4 h-4" /> Usuń
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Szczegóły</TabsTrigger>
          <TabsTrigger value="messages">Wiadomości</TabsTrigger>
          <TabsTrigger value="history">Historia</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-10 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <Section title="Szczegóły">
              <Field icon={<Calendar className="w-4 h-4" />} label="Data utworzenia" value={data.createdAt} />
            </Section>

            <Section title="Osoby">
              <Field icon={<User className="w-4 h-4" />} label="Zgłoszone przez" value={`${data.author.firstName} ${data.author.lastName}`} />
              <Field icon={<User className="w-4 h-4" />} label="Przypisane do" value={data.assignee ? `${data.assignee.firstName} ${data.assignee.lastName}` : undefined} />
            </Section>

            {data.linkedInventoryId && (
              <Section title="Powiązane urządzenie">
                {isDeviceLoading ? (
                  <div className="flex items-start gap-3">
                    <Skeleton className="mt-0.5 w-4 h-4 shrink-0" />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3.5 w-20" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                ) : linkedDevice ? (
                  <a
                    href={`/inventory/${linkedDevice.id}`}
                    onClick={(e) => { e.preventDefault(); navigate({ to: `/inventory/${linkedDevice.id}` }); }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="mt-0.5 text-muted-foreground/70 shrink-0">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Urządzenie</p>
                      <p className="text-sm font-medium text-foreground group-hover:underline flex items-center gap-1">
                        {linkedDevice.name}
                        <Link className="w-3 h-3 text-muted-foreground" />
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{linkedDevice.serialNumber}</p>
                    </div>
                  </a>
                ) : null}
              </Section>
            )}
          </div>

          <Separator />

          <div className="flex flex-col gap-3 max-w-4xl">
            <h2 className="text-lg font-semibold tracking-tight">Opis</h2>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {data.description || 'Brak opisu.'}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <TicketMessages ticketId={id} />
        </TabsContent>

        <TabsContent value="history" className="mt-6 max-w-2xl">
          <HistoryTimeline entries={history} isLoading={isHistoryLoading} />
        </TabsContent>
      </Tabs>

      <EditTicketDialog
        ticket={data}
        open={editOpen}
        onOpenChange={(open) => !open && setEditOpen(false)}
      />

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Anuluj zgłoszenie</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Czy na pewno chcesz anulować{' '}
            <span className="font-medium text-foreground">{data.title}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isCancelling} onClick={() => setCancelOpen(false)}>
              Wróć
            </Button>
            <Button variant="destructive" size="sm" disabled={isCancelling} onClick={handleCancel}>
              Anuluj zgłoszenie
              {isCancelling && <Spinner />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Usuń zgłoszenie</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Czy na pewno chcesz usunąć{' '}
            <span className="font-medium text-foreground">{data.title}</span>? Tej operacji nie można cofnąć.
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isDeleting} onClick={() => setDeleteOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" size="sm" disabled={isDeleting} onClick={handleDelete}>
              Usuń
              {isDeleting && <Spinner />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
