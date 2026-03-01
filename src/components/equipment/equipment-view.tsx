import { DataTable } from "@/components/shared/data-table";
import { demoEquipment } from "@/data/mock/mock-equipment";
import { getEquipmentColumns } from "./equipment-columns";
import { EquipmentTableToolbar } from "./equipment-table-toolbar";
import { useAdmin } from "@/data/mock/admin-context";

const AdminEquipmentView = () => {
  const { adminView } = useAdmin();

  const columns = getEquipmentColumns();
  const mockData = adminView ? demoEquipment : demoEquipment.filter((e) => e.assignedTo?.includes("Jan"));

  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable columns={columns} data={mockData} toolbar={EquipmentTableToolbar} />
    </div>
  );
};

export default AdminEquipmentView;
