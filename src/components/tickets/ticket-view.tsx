import { useMemo, useState } from "react";
import AdminTicketTypeSelection from "./admin-ticket-type-selection";
import type { AdminTicketSelectionType } from "@/types/tickets";
import { DataTable } from "../shared/data-table";
import { TicketTableToolbar } from "./ticket-table-toolbar";
import { useAdmin } from "@/data/mock/admin-context";
import { getColumns } from "./columns";
import { useMe } from "@/hooks/auth/useAuth";
import { useTickets } from "@/hooks/ticket/useTickets";
import { useInventory } from "@/hooks/inventory/useInventory";

const TicketView = () => {
  const [ticketsType, setTicketsType] = useState<AdminTicketSelectionType>("all");
  const { isTicketAdmin: adminView } = useAdmin();
  const { user } = useMe();
  const { data, isLoading } = useTickets();
  const { data: inventory } = useInventory();
  const columns = getColumns(adminView, inventory);

  const filteredData = useMemo(() => {
    const tickets = data ?? [];

    if (!adminView) {
      return tickets.filter((t) => t.author.username === user?.username);
    }

    switch (ticketsType) {
      case "not-assigned":
        return tickets.filter((t) => !t.assignee);
      case "my-tasks":
        return tickets.filter((t) => t.assignee?.username === user?.username);
      case "my-tickets":
        return tickets.filter((t) => t.author.username === user?.username);
      case "all":
      default:
        return tickets;
    }
  }, [ticketsType, data, user, adminView]);

  return (
    <div className="w-full flex flex-col gap-2 xs:gap-4">
      {adminView && (
        <AdminTicketTypeSelection
          ticketsType={ticketsType}
          setTicketsType={setTicketsType}
        />
      )}
      <DataTable
        columns={columns}
        data={filteredData}
        toolbar={(props) => <TicketTableToolbar {...props} />}
        getRowHref={(row) => `/tickets/${row.ticketId}`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TicketView;
