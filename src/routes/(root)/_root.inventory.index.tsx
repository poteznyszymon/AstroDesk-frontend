import { createFileRoute } from "@tanstack/react-router";

import AdminEquipmentView from "@/components/equipment/equipment-view";

export const Route = createFileRoute("/(root)/_root/inventory/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full flex flex-col gap-4">
      <AdminEquipmentView />
    </div>
  );
}
