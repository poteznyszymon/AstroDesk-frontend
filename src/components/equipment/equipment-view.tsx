import { DataTable } from "@/components/shared/data-table";
import { getEquipmentColumns } from "./equipment-columns";
import { EquipmentTableToolbar } from "./equipment-table-toolbar";
import { useAdmin } from "@/data/mock/admin-context";
import type { Equipment } from "@/types/equipment";
import {useMemo, useState} from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import {useEquipment} from "@/hooks/inventory/useInventory.tsx";
import {useMe} from "@/hooks/auth/useAuth.tsx";

const AdminEquipmentView = () => {
  const { adminView } = useAdmin();
  const { data, isLoading } = useEquipment();
  const { user } = useMe();
  const columns = getEquipmentColumns();

  const filteredData = useMemo(() => {
      const equipment = data?.equipment ?? [];

      if (!adminView) {
        return equipment.filter((e) => e.assignedTo == user?.name);
      }

      return equipment;
  }, [adminView, data, user?.name]);

  const [selectedAsset, setSelectedAsset] = useState<Equipment | null>(null);
  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable isLoading={isLoading} columns={columns} data={filteredData} toolbar={EquipmentTableToolbar} onRowClick={(row) => setSelectedAsset(row)} />
      <Sheet
        open={!!selectedAsset}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedAsset(null);
        }}
      >
        <SheetContent>
          {selectedAsset && (
            <SheetHeader>
              <SheetTitle>{selectedAsset.name}</SheetTitle>
              <SheetDescription>
                Tutaj beda 3 zakladki - wszystkie dane tego urzadzenia, historia (audit log) dla tego urzadzenia kiedy i do kogo byl przypsany, tickety aktualne oraz archiwalne ktore byly przypisane
                do tego urzadzenia
              </SheetDescription>
            </SheetHeader>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminEquipmentView;
