import { Network, Ticket, Package, History, type LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { UserRole } from "@/types/user";

interface MenuLink {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  roles?: UserRole[];
}

export const menuItems: MenuLink[] = [
  { title: "System ticketowy", url: "/tickets", icon: Ticket },
  { title: "System inwentaryzacyjny", url: "/inventory", icon: Package },
  { title: "System mapy sieci", url: "/network", icon: Network, roles: ["HEADADMIN"] },
  { title: "Historia zmian", url: "/history", icon: History, roles: ["HEADADMIN"] },
];
