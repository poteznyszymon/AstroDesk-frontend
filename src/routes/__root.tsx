import PageNotFound from "@/components/shared/page-not-found";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => <PageNotFound />,
});
