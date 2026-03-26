import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import EditEquipmentDialog from '@/components/equipment/edit-equipment-dialog';
import DeleteEquipmentDialog from '@/components/equipment/delete-equipment-dialog';
import { useAdmin } from '@/data/mock/admin-context';
import { useInventoryById, useAddInventoryNote } from '@/hooks/inventory/useInventory';
import { useMe } from '@/hooks/auth/useAuth';
import { createFileRoute } from '@tanstack/react-router';
import { Hash, MapPin, Calendar, DollarSign, FileText, User, Package, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const [noteContent, setNoteContent] = useState('');

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
          {adminView && (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          )}
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

        {adminView && data && (
          <div className="flex items-center gap-2">
            <EditEquipmentDialog item={data} />
            <DeleteEquipmentDialog id={data.id} name={data.name} />
          </div>
        )}
      </div>

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

        <div className="pt-4 flex flex-col gap-4 max-w-3xl">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            Notatki
            {data && data.notes.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">({data.notes.length})</span>
            )}
          </h2>

          {data && data.notes.length === 0 && (
            <p className="text-sm text-muted-foreground">Brak notatek dla tego sprzętu.</p>
          )}

          {data && data.notes.length > 0 && (
            <div className="flex flex-col gap-4">
              {data.notes.map((note) => (
                <div key={note.id} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                    {getInitials(note.author)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-foreground">{note.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleString('pl-PL', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Input
              placeholder="Dodaj notatkę..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (noteContent.trim() && user) {
                    addNote({ content: noteContent.trim(), author: user.name }).then(() =>
                      setNoteContent('')
                    );
                  }
                }
              }}
            />
            <Button
              size="sm"
              className="self-end"
              disabled={!noteContent.trim() || isSending}
              onClick={() => {
                if (noteContent.trim() && user) {
                  addNote({ content: noteContent.trim(), author: user.name }).then(() =>
                    setNoteContent('')
                  );
                }
              }}
            >
              <Send  />
            </Button>
          </div>
        </div>
    </div>
  );
}