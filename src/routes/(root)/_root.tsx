import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import Header from "@/components/shared/header";

export const Route = createFileRoute("/(root)/_root")({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
}
