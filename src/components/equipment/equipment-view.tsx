import { DataTable } from "@/components/shared/data-table";
import { getEquipmentColumns } from "./equipment-columns";
import { EquipmentTableToolbar } from "./equipment-table-toolbar";
import { useAdmin } from "@/data/mock/admin-context";
import type { Equipment } from "@/types/equipment";
import {useMemo} from "react";
import {useEquipment} from "@/hooks/inventory/useInventory.tsx";
import {useMe} from "@/hooks/auth/useAuth.tsx";
import { useNavigate } from "@tanstack/react-router";

const AdminEquipmentView = () => {
  const { adminView } = useAdmin();
  const { data, isLoading } = useEquipment();
  const { user } = useMe();
  const columns = getEquipmentColumns();
  const navigate = useNavigate()

  const filteredData = useMemo(() => {
      const equipment = data?.equipment ?? [];

      if (!adminView) {
        return equipment.filter((e) => e.assignedTo == user?.name);
      }

      return equipment;
  }, [adminView, data, user?.name]);

  const handleRowClick = (row: Equipment) => {
    navigate({to: `/inventory/${row.id}`})
  }
  
  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable isLoading={isLoading} columns={columns} data={filteredData} toolbar={EquipmentTableToolbar} onRowClick={handleRowClick} />
    </div>
  );
};

export default AdminEquipmentView;
