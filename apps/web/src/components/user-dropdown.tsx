import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useRouter } from "@tanstack/react-router";
import { LogOut, Settings } from "lucide-react";
import { ChevronDownIcon } from "./data-grid";

export default function UserDropdown() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const onSettingsClick = () => {
    // Handle settings navigation
    router.navigate({ to: "/settings" });
  };

  const onLogoutClick = () => {
    // Handle logout logic
    authClient.signOut();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          endContent={
            <ChevronDownIcon className="text-small text-default-500" />
          }
        >
          {isPending ? "Loading..." : session?.user?.name}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User actions">
        <DropdownItem key="settings" onPress={onSettingsClick}>
          <div className="flex items-center gap-2">
            <div>
              <Settings size={20} />
            </div>
            <div>Settings</div>
          </div>
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          onPress={onLogoutClick}
        >
          <div className="flex items-center gap-2">
            <div>
              <LogOut size={20} />
            </div>
            <div>Logout</div>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
