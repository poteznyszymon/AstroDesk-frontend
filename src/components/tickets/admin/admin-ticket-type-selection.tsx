import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminTicketSelectionType } from "@/types/tickets";
import type { Dispatch, SetStateAction } from "react";

interface AdminTicketTypeSelectionProps {
  ticketsType: AdminTicketSelectionType;
  setTicketsType: Dispatch<SetStateAction<AdminTicketSelectionType>>;
}

const AdminTicketTypeSelection = ({ ticketsType, setTicketsType }: AdminTicketTypeSelectionProps) => {
  return (
    <Tabs value={ticketsType} onValueChange={(val) => setTicketsType(val as typeof ticketsType)} className="w-full">
      <TabsList className="w-full hidden xs:flex">
        <TabsTrigger value="all">Wszystkie</TabsTrigger>
        <TabsTrigger value="not-assigned">Nieprzypisane</TabsTrigger>
        <TabsTrigger value="my-tasks">Moje zadania</TabsTrigger>
        <TabsTrigger value="my-tickets">Moje zgłoszenia</TabsTrigger>
      </TabsList>
      <div className="xs:hidden w-full">
        <Select value={ticketsType} onValueChange={(val) => setTicketsType(val as typeof ticketsType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Wybierz widok" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="not-assigned">Nieprzypisane</SelectItem>
            <SelectItem value="my-tasks">Moje zadania</SelectItem>
            <SelectItem value="my-tickets">Moje zgłoszenia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Tabs>
  );
};

export default AdminTicketTypeSelection;
