"use client";

import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";
import { Icons } from "@web/components/ui/icons";
import { authClient } from "@web/lib/auth-client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

export const UserDropDown = () => {
  const { data: session } = authClient.useSession();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {session ? (
            <>
              <div className="hidden items-center justify-center gap-1 sm:flex">
                <div>{session.user.name?.split(" ")[0]}</div>
              </div>
              <div className="sm:hidden">
                <Icons.user />
              </div>
            </>
          ) : (
            "Loading..."
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Icons.settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-100" />
            <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-0" />
            <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/signin"); // redirect to login page
                },
              },
            });
          }}
        >
          <Icons.logout />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
