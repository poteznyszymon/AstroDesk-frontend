import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import Header from "@/components/shared/header";
import { getMeApi } from "@/hooks/auth/api.auth";
import { queryClient } from "@/main";
import { AdminProvider } from "@/data/mock/admin-context";

export const Route = createFileRoute("/(root)/_root")({
  beforeLoad: async () => {
    try {
      const user = await queryClient.ensureQueryData({
        queryKey: ["me"],
        queryFn: getMeApi,
        staleTime: 1000 * 60 * 5,
      });

      if (!user) throw redirect({ to: "/login" });

    } catch (e) {
      if (e instanceof Error) throw redirect({ to: "/login" });
      throw e;
    }
  },
  component: RootLayout,
});

function RootLayout() {
  return (
    <AdminProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </AdminProvider>
  );
}
