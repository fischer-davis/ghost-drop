"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Icons } from "@/components/ui/icons";
import * as React from "react";
import { useTheme } from "next-themes";

export const UserDropDown = () => {
  const session = useSession();
  const { setTheme, theme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {session ? (
            <>
              <div className="hidden items-center justify-center gap-1 sm:flex">
                <div>{session.data?.user.name?.split(" ")[0]}</div>
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
            await signOut({ callbackUrl: "/" });
          }}
        >
          <Icons.logout />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
