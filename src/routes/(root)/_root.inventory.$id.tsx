import { Button } from '@/components/ui/button';
import { useInventoryById } from '@/hooks/inventory/useInventory';
import { createFileRoute } from '@tanstack/react-router';
import { Edit, Trash2, Hash, MapPin, Calendar, DollarSign, FileText, User, Package } from 'lucide-react';

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

// Znacznie prostsze pole z danymi - bez ramek, po prostu ikona, labelka i wartość
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

// Sekcja to teraz tylko tytuł i flexbox, zero borderów
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

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useInventoryById(Number(id));

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

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-2 flex-1 xs:flex-none">
            <Edit className="w-4 h-4" /> Edytuj
          </Button>
          <Button size="sm" variant="destructive" className="gap-2 flex-1 xs:flex-none">
            <Trash2 className="w-4 h-4" /> Usuń
          </Button>
        </div>
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

        <div className="pt-4">
          <h2 className="text-lg font-semibold text-foreground tracking-tight mb-2">Notatki</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {data?.notes || "Brak notatek dla tego sprzętu."}
          </p>
        </div>
      
    </div>
  );
}