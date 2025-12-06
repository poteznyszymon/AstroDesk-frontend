import { LogOutIcon } from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/astrodesk.jpg";
import { Button } from "../ui/button";
import { menuItems } from "@/data/app-links";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const { toggleSidebar, isMobile } = useSidebar();

  function handleLinkClick() {
    if (isMobile) {
      toggleSidebar();
    }
  }

  return (
    <Sidebar className="border-r! border-r-border!">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-1 p-2 py-4" onClick={handleLinkClick}>
          <img src={logo} alt="logo" className="size-6 rounded-[50%]" />
          <h2 className="font-medium text-xl">Astrodesk</h2>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={location.pathname === item.url ? "text-foreground bg-sidebar-accent" : "text-muted-foreground"}>
                    <Link to={item.url} onClick={handleLinkClick}>
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
                className="text-xs"
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  if (isMobile) {
                    toggleSidebar();
                  }
                  navigate({ to: "/login" });
                }}
              >
                <LogOutIcon size={2} />
                <p>Wyloguj się</p>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
