import { createFileRoute } from "@tanstack/react-router";
import { useAdmin } from "@/data/mock/admin-context";
import TicketView from "@/components/tickets/ticket-view";

export const Route = createFileRoute("/(root)/_root/tickets")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full flex flex-col gap-4">
      <TicketView />
    </div>
  );
}
