import { createContext, useContext, type ReactNode } from "react";
import { useMe } from "@/hooks/auth/useAuth";

interface AdminContextType {
  isTicketAdmin: boolean;
  isInventoryAdmin: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useMe();

  const isTicketAdmin = user?.role === "TICKET_ADMIN" || user?.role === "HEADADMIN";
  const isInventoryAdmin = user?.role === "ASSET_ADMIN" || user?.role === "HEADADMIN";

  return (
    <AdminContext.Provider value={{ isTicketAdmin, isInventoryAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  return context ?? { isTicketAdmin: false, isInventoryAdmin: false };
};
