import { createFileRoute, redirect } from "@tanstack/react-router";
import NetworkView from "@/components/network/network-view";
import { getMeApi } from "@/hooks/auth/api.auth";
import { queryClient } from "@/main";

export const Route = createFileRoute("/(root)/_root/network")({
  beforeLoad: async () => {
    const user = await queryClient.ensureQueryData({
      queryKey: ["me"],
      queryFn: getMeApi,
      staleTime: 1000 * 60 * 5,
    });
    if (!user || user.role !== "HEADADMIN") {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full flex flex-col gap-4">
      <NetworkView />
    </div>
  );
}
