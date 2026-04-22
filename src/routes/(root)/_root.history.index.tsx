import { createFileRoute, redirect } from "@tanstack/react-router";
import HistoryView from "@/components/history/history-view";
import { getMeApi } from "@/hooks/auth/api.auth";
import { queryClient } from "@/main";

const ADMIN_ROLES = ["HEADADMIN", "TICKET_ADMIN", "ASSET_ADMIN"] as const;

export const Route = createFileRoute("/(root)/_root/history/")({
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData({
      queryKey: ["me"],
      queryFn: getMeApi,
      staleTime: 1000 * 60 * 5,
    });
    if (!user || !ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number])) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full flex flex-col gap-4">
      <HistoryView />
    </div>
  );
}
