import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { ChevronDownIcon } from "./data-grid";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@tanstack/react-router";


export default function UserDropdown() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const onSettingsClick = () => {
    // Handle settings navigation
    router.navigate({ to: "/settings" });
  }

  const onLogoutClick = () => {
    // Handle logout logic
    authClient.signOut();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          endContent={<ChevronDownIcon className="text-small text-default-500" />}
        >
          {isPending ? "Loading..." : session?.user?.name}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User actions">
        <DropdownItem key="settings" onPress={onSettingsClick}>
          Settings
        </DropdownItem>
        <DropdownItem 
          key="logout" 
          className="text-danger" 
          color="danger"
          onPress={onLogoutClick}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}