import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { useProgress } from "@/stores/useProgress.ts";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Progress } from "@heroui/progress";
import { Link } from "@tanstack/react-router";
import UserDropdown from "./user-dropdown";

export const Navbar = () => {
  const { progress } = useProgress();
  return (
    <HeroUINavbar maxWidth="xl" className="flex" position="sticky">
      <NavbarContent className="flex-1" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            to="/"
          >
            <Logo />
            <p className="font-bold text-inherit">Ghost Drop</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="flex-2">
        <NavbarItem className="w-full">
          {progress ? <Progress color="secondary" value={progress} /> : null}
          {progress ? progress : null}
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="flex-1" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <UserDropdown />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
