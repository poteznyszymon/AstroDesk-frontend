import { LogOut } from "lucide-react";
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
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
} from "@/components/ui/sidebar";
import logo from "@/astrodesk.jpg";
import { menuItems } from "@/data/app-links";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { useAdmin } from "@/data/mock/admin-context";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const { toggleSidebar, isMobile } = useSidebar();
  const { adminView, toggleAdminView } = useAdmin();

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
                  <SidebarMenuButton asChild className={location.pathname === item.url ? "text-foreground bg-sidebar-accent outline-solid outline-1 outline-border" : "text-muted-foreground"}>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={""} alt={"user avatar"} />
                    <AvatarFallback className="rounded-lg border">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">johndoe</span>
                    <span className="truncate text-xs">johndoe@gmail.com</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-lg" side="bottom" align="end" sideOffset={4} style={{ minWidth: `calc(${isMobile ? SIDEBAR_WIDTH_MOBILE : SIDEBAR_WIDTH} - 1rem)` }}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={""} alt={"user avatar"} />
                        <AvatarFallback className="rounded-lg border">JD</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">johndoe</span>
                        <span className="truncate text-xs">johndoe@gmail.com</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="flex items-center justify-between p-1 text-xs">
                  Set admin view <Switch checked={adminView} onCheckedChange={toggleAdminView} />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer text-xs"
                    onClick={() => {
                      navigate({ to: "/login" });
                    }}
                  >
                    <LogOut />
                    Wyloguj sie
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
