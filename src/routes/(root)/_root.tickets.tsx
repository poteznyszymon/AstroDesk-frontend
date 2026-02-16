import { createFileRoute } from "@tanstack/react-router";
import { useAdmin } from "@/data/mock/admin-context";
import AdminTicketView from "@/components/tickets/admin/admin-ticket-view";
import UserTicketView from "@/components/tickets/user/user-ticket-view";

export const Route = createFileRoute("/(root)/_root/tickets")({
  component: RouteComponent,
});

function RouteComponent() {
  const { adminView } = useAdmin();
  return <div className="w-full flex flex-col gap-4">{adminView ? <AdminTicketView /> : <UserTicketView />}</div>;
}
