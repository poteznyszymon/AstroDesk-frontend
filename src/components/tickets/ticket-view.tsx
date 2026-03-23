import { useMemo, useState } from "react";
import AdminTicketTypeSelection from "./admin-ticket-type-selection";
import type { AdminTicketSelectionType, Ticket } from "@/types/tickets";
import { DataTable } from "../shared/data-table";
import { TicketTableToolbar } from "./ticket-table-toolbar";
import { useAdmin } from "@/data/mock/admin-context";
import { getColumns } from "./columns";
import { useMe } from "@/hooks/auth/useAuth";
import { useTickets } from "@/hooks/ticket/useTIcekts";
import { useNavigate } from "@tanstack/react-router";

const TicketView = () => {
  const [ticketsType, setTicketsType] = useState<AdminTicketSelectionType>("all");
  const columns = getColumns();
  const { adminView } = useAdmin();
  const { user } = useMe();
  const { data, isLoading } = useTickets(user?.name);
  const navigate = useNavigate()

  const filteredData = useMemo(() => {
      const tickets = data?.tickets ?? [];

      if (!adminView) {
        return tickets.filter((t) => t.createdBy === user?.name);
      }

      switch (ticketsType) {
        case "not-assigned":
          return tickets.filter((t) => !t.assignee);
        case "my-tasks":
          return tickets.filter((t) => t.assignee === user?.name);
        case "my-tickets":
          return tickets.filter((t) => t.createdBy === user?.name);
        case "all":
        default:
          return tickets;
      }
    }, [ticketsType, data, user?.name, adminView]);

  const handleRowClick = (row: Ticket) => {
    navigate({to: `/tickets/${row.id}`})
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {adminView && (
        <AdminTicketTypeSelection
          ticketsType={ticketsType}
          setTicketsType={setTicketsType}
        />
      )}
      <DataTable
        columns={columns}
        data={filteredData}
        toolbar={TicketTableToolbar}
        onRowClick={handleRowClick}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TicketView;