import {
  ChevronDown,
  ChevronUp,
  type Icon as LucideIcon,
  LogOut,
  Moon,
  Settings,
  SunMedium,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  settings: Settings,
  logout: LogOut,
};
