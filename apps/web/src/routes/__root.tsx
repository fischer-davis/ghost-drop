import { Navbar } from "@/components/navbar.tsx";
import { authClient } from "@/lib/auth-client.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router";

// import FileUploadProgress from "@web/components/file-upload-progress";
// import { UserDropDown } from "@web/components/user-dropdown";

export const Route = createRootRoute({
  component: () => {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    if (isPending) return;

    if (!session) {
      router.navigate({ to: "/signin" });
    } else {
      router.navigate({ to: "/" });
    }

    return (
      <>
        {session ? <Navbar /> : null}
        <Outlet />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
      </>
    );
  },
});
