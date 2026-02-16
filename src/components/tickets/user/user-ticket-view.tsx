import { mockUserTickets } from "@/data/mock/mock-user-tickets";

import { DataTable } from "../shared/data-table";
import { getColumns } from "../shared/columns";

const UserTicketView = () => {
  const columns = getColumns();
  return (
    <div className="w-full flex flex-col gap-4">
      <DataTable columns={columns} data={mockUserTickets} />
    </div>
  );
};

export default UserTicketView;
