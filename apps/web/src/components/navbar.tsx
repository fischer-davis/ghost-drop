import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Progress } from "@heroui/progress";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" className="flex" position="sticky">
      <NavbarContent className="flex-1" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">Ghost Drop</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="flex-2">
        <NavbarItem className="w-full">
          <Progress color="secondary" value={70} />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="flex-1" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
