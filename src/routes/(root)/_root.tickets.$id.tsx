import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTicketById, useDeleteTicket } from '@/hooks/ticket/useTIcekts';
import { useInventoryById } from '@/hooks/inventory/useInventory';
import { useAdmin } from '@/data/mock/admin-context';
import { statusConfig, priorityConfig } from '@/types/tickets';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditTicketDialog from '@/components/tickets/edit-ticket-dialog';
import { Spinner } from '@/components/ui/spinner';
import { Trash2, Edit, User, Calendar, Clock, Monitor, Link } from 'lucide-react';

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
  const { adminView } = useAdmin();
  const { data: linkedDevice, isLoading: isDeviceLoading } = useInventoryById(data?.linkedInventoryId ?? 0);
  const { deleteTicket, isLoading: isDeleting } = useDeleteTicket();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    await deleteTicket(id);
    setDeleteOpen(false);
    navigate({ to: '/tickets' });
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

  return (
    <div className="space-y-10 p-2">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono text-muted-foreground">{data.id}</span>
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
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Button size="sm" variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={() => setEditOpen(true)}>
              <Edit className="w-4 h-4" /> Edytuj
            </Button>
            <Button size="sm" variant="destructive" className="gap-2 flex-1 sm:flex-none" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="w-4 h-4" /> Usuń
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <Section title="Szczegóły">
          <Field icon={<Calendar className="w-4 h-4" />} label="Data utworzenia" value={data.createdAt} />
          {data.updatedAt && (
            <Field icon={<Clock className="w-4 h-4" />} label="Ostatnia aktualizacja" value={data.updatedAt} />
          )}
        </Section>

        <Section title="Osoby">
          <Field icon={<User className="w-4 h-4" />} label="Zgłoszone przez" value={data.createdBy} />
          <Field icon={<User className="w-4 h-4" />} label="Przypisane do" value={data.assignee} />
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

      <EditTicketDialog
        ticket={data}
        open={editOpen}
        onOpenChange={(open) => !open && setEditOpen(false)}
      />

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
