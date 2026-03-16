import { DataTable } from "@/components/shared/data-table";
import { demoEquipment } from "@/data/mock/mock-equipment";
import { getEquipmentColumns } from "./equipment-columns";
import { EquipmentTableToolbar } from "./equipment-table-toolbar";
import { useAdmin } from "@/data/mock/admin-context";
import type { Equipment } from "@/types/equipment";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";

const AdminEquipmentView = () => {
  const { adminView } = useAdmin();

  const columns = getEquipmentColumns();
  const mockData = adminView ? demoEquipment : demoEquipment.filter((e) => e.assignedTo?.includes("Jan"));
  const [selectedAsset, setSelectedAsset] = useState<Equipment | null>(null);
  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable isLoading={false} columns={columns} data={mockData} toolbar={EquipmentTableToolbar} onRowClick={(row) => setSelectedAsset(row)} />
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
