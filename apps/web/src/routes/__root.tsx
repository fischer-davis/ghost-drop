import { Navbar } from "@/components/navbar.tsx";
import { authClient } from "@/lib/auth-client.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

// import FileUploadProgress from "@web/components/file-upload-progress";
// import { UserDropDown } from "@web/components/user-dropdown";

export const Route = createRootRoute({
  component: () => {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
      if (isPending) return;

      if (!session) {
        router.navigate({ to: "/signin" });
      } else {
        router.navigate({ to: "/" });
      }
    }, [isPending]);

    return (
      <>
        {session ? <Navbar /> : null}
        <Outlet />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        <TanStackRouterDevtools position="bottom-left" />
      </>
    );
  },
});
