import { useState, useMemo } from "react";
import AdminTicketTypeSelection from "./admin-ticket-type-selection";
import { getColumns } from "../shared/columns";
import { demoTickets } from "@/data/mock/mock-tickets";
import type { AdminTicketSelectionType } from "@/types/tickets";
import { DataTable } from "../shared/data-table";

const AdminTicketView = () => {
  const [ticketsType, setTicketsType] = useState<AdminTicketSelectionType>("all");
  const columns = getColumns();

  const filteredData = useMemo(() => {
    switch (ticketsType) {
      case "not-assigned":
        return demoTickets.filter((t) => !t.assignee);
      case "my-tasks":
        return demoTickets.filter((t) => t.assignee === "Jan Kowalski");
      case "my-tickets":
        return demoTickets.filter((t) => t.createdBy === "Jan Kowalski");
      case "all":
      default:
        return demoTickets;
    }
  }, [ticketsType]);

  return (
    <div className="w-full flex flex-col gap-4">
      <AdminTicketTypeSelection ticketsType={ticketsType} setTicketsType={setTicketsType} />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default AdminTicketView;
