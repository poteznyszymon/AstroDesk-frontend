import { createContext, useState, useContext, type ReactNode } from "react";

interface AdminContextType {
  adminView: boolean;
  toggleAdminView: () => void;
  setAdminView: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [adminView, setAdminView] = useState<boolean>(true);

  const toggleAdminView = () => {
    setAdminView((prev) => !prev);
  };

  const value: AdminContextType = {
    adminView,
    toggleAdminView,
    setAdminView,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
};
