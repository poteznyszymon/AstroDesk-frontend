import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(root)/_root/inventory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col h-full gap-4 items-center justify-center">
      <h1 className="text-lg">System inwentaryzacyjny</h1>
    </div>
  );
}
