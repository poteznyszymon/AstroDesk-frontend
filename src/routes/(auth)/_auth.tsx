import ThemeIconButton from "@/components/theme/ThemeIconButton";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-background w-full h-screen  flex items-center justify-center">
      <ThemeIconButton className="fixed top-4 right-4" />
      <div className="flex-1 flex items-center justify-center">
        <Outlet />
      </div>
    </main>
  );
}
