import { Network, Ticket, Package, type LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

interface MenuLink {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export const menuItems: MenuLink[] = [
  { title: "System ticketowy", url: "/tickets", icon: Ticket },
  { title: "System inwentaryzacyjny", url: "/inventory", icon: Package },
  { title: "System mapy sieci", url: "/network", icon: Network },
];
