import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(root)/_root/")({
  beforeLoad: () => {
    throw redirect({
      to: "/tickets",
    });
  },
});
