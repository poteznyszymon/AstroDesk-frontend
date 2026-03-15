import { createFileRoute } from "@tanstack/react-router";
import NetworkView from "@/components/network/network-view";

export const Route = createFileRoute("/(root)/_root/network")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full flex flex-col gap-4">
      <NetworkView />
    </div>
  );
}
