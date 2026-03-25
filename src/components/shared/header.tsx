import { useRouterState, Link } from "@tanstack/react-router";
import { menuItems } from "@/data/app-links";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import ThemeIconButton from "../theme/ThemeIconButton";

const Header = () => {
  const { location } = useRouterState();
  const segments = location.pathname.split("/").filter(Boolean);
  
  function getLabel(segment: string): string {
    const found = menuItems.find((x) => x.url === `/${segment}`);
    return found?.title ?? segment;
  }

  return (
    <header className="sticky top-0 z-10 h-16 shrink-0 border-b border-b-border bg-sidebar">
      <div className="flex items-center h-full p-4 gap-4">
        <SidebarTrigger className="p-4" />
        <Separator orientation="vertical" />

        <Breadcrumb className="hidden xs:block">
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const href = "/" + segments.slice(0, index + 1).join("/");

              return (
                <div key={href} className="flex items-center gap-1.5">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{getLabel(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={href}>{getLabel(segment)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto">
          <ThemeIconButton />
        </div>
      </div>
    </header>
  );
};

export default Header;