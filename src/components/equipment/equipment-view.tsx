import { DataTable } from "@/components/shared/data-table";
import { EquipmentTableToolbar } from "./equipment-table-toolbar";
import { useAdmin } from "@/data/mock/admin-context";
import {useMemo} from "react";
import {useMe} from "@/hooks/auth/useAuth.tsx";
import { useInventory } from "@/hooks/inventory/useInventory";
import { getInventoryColumns } from "./equipment-columns";

const AdminEquipmentView = () => {
  const { adminView } = useAdmin();
  const { data, isLoading } = useInventory();
  const { user } = useMe();
  const columns = getInventoryColumns(adminView);

  const filteredData = useMemo(() => {
      const equipment = data ?? [];

      if (!adminView) {
        return equipment.filter((e) => e.assignedTo == user?.name);
      }

      return equipment;
  }, [adminView, data, user?.name]);

  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable isLoading={isLoading} columns={columns} data={filteredData} toolbar={EquipmentTableToolbar} getRowHref={(row) => `/inventory/${row.id}`} initialColumnVisibility={{ hasNotes: false }} />
    </div>
  );
};

export default AdminEquipmentView;
