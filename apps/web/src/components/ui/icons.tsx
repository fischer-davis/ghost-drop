import {
  ChevronDown,
  ChevronUp,
  Download,
  LogOut,
  Moon,
  Settings,
  SunMedium,
  Trash2,
  Upload,
  User,
  type Icon as LucideIcon,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  settings: Settings,
  logout: LogOut,
  trash: Trash2,
  download: Download,
  upload: Upload,
  user: User,
};
