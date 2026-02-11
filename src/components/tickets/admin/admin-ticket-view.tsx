import { useState, useMemo } from "react";
import AdminTicketTypeSelection from "./admin-ticket-type-selection";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { demoTickets } from "@/data/mock/mock-tickets";
import type { AdminTicketSelectionType } from "@/types/tickets";

const AdminTicketView = () => {
  const [ticketsType, setTicketsType] = useState<AdminTicketSelectionType>("all");

  const filteredData = useMemo(() => {
    switch (ticketsType) {
      case "not-assigned":
        return demoTickets.filter((t) => !t.assignee);
      case "my-tasks":
        return demoTickets.filter((t) => t.assignee === "Jan Kowalski");
      case "my-tickets":
        return [];
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
