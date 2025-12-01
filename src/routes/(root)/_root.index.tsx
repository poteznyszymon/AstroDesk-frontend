import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(root)/_root/")({
  component: App,
});

function App() {
  return (
    <div className="flex flex-1 flex-col gap-4 items-center justify-center">
      <h1 className="text-lg font-bold">Home page</h1>
    </div>
  );
}
