import { DataTable } from "@/components/shared/data-table";
import { EquipmentTableToolbar } from "./equipment-table-toolbar";
import { useAdmin } from "@/data/mock/admin-context";
import type { Inventory } from "@/types/inventory";
import {useMemo} from "react";
import {useMe} from "@/hooks/auth/useAuth.tsx";
import { useNavigate } from "@tanstack/react-router";
import { useInventory } from "@/hooks/inventory/useInventory";
import { getInventoryColumns } from "./equipment-columns";

const AdminEquipmentView = () => {
  const { adminView } = useAdmin();
  const { data, isLoading } = useInventory();
  const { user } = useMe();
  const columns = getInventoryColumns();
  const navigate = useNavigate()

  const filteredData = useMemo(() => {
      const equipment = data ?? [];

      if (!adminView) {
        return equipment.filter((e) => e.assignedTo == user?.name);
      }

      return equipment;
  }, [adminView, data, user?.name]);

  const handleRowClick = (row: Inventory) => {
    navigate({to: `/inventory/${row.id}`})
  }
  
  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable isLoading={isLoading} columns={columns} data={filteredData} toolbar={EquipmentTableToolbar} onRowClick={handleRowClick} />
    </div>
  );
};

export default AdminEquipmentView;
