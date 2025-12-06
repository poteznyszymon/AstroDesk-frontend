import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(root)/_root/network")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col h-full gap-4 items-center justify-center">
      <h1 className="text-lg">Mapa sieci</h1>
    </div>
  );
}
