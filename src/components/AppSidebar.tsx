import { Home, Network, Ticket, Package, LogOutIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import logo from "@/astrodesk.jpg";
import { Button } from "./ui/button";

const menuItems = [
  { title: "Strona główna", url: "/", icon: Home },
  { title: "System ticketowy", url: "/tickets", icon: Ticket },
  { title: "System inwentaryzacyjny", url: "/inventory", icon: Package },
  { title: "System mapy sieci", url: "/network", icon: Network },
];

export const AppSidebar = () => {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-1 p-2 py-4">
          <img src={logo} alt="logo" className="size-6 rounded-[50%]" />
          <h2 className="text-lg font-semibold">AstroDesk</h2>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  navigate({ to: "/login" });
                }}
              >
                <LogOutIcon />
                <p>Wyloguj się</p>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
