import { useRouterState } from "@tanstack/react-router";
import ThemeIconButton from "../theme/ThemeIconButton";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { menuItems } from "@/data/app-links";

const Header = () => {
  const { location } = useRouterState();

  function getLocationDescription(pathname: string): string {
    return menuItems.find((x) => x.url === pathname)?.title || "";
  }

  return (
    <header className="sticky top-0 z-10 h-16 shrink-0 border-b border-b-border bg-sidebar">
      <div className="flex items-center h-full p-4 gap-4">
        <SidebarTrigger className="p-4" />
        <Separator orientation="vertical" />
        <div className="flex-1 flex items-center text-sm h-full">
          <p className="text-sm">{getLocationDescription(location.pathname)}</p>
        </div>
        <ThemeIconButton />
      </div>
    </header>
  );
};

export default Header;
