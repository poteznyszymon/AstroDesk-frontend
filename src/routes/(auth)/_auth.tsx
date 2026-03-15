import ThemeIconButton from "@/components/theme/ThemeIconButton";
import { getMeMock } from "@/hooks/auth/mock.auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth")({
  component: RouteComponent,
  beforeLoad: async () => {
    try {
      const user = await getMeMock();
      if (user) {
        throw redirect({ to: "/" });
      }
    } catch (e) {
      if (e instanceof Response) throw e;
    }
  },
});

function RouteComponent() {
  return (
    <main className="relative bg-background w-full h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle, rgb(from var(--muted-foreground) r g b / 0.4) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
      <ThemeIconButton className="fixed top-4 right-4 z-20" />
      <div className="flex-1 flex items-center justify-center z-10">
        <Outlet />
      </div>
    </main>
  );
}
