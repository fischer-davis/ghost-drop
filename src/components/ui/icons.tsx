import {
  ChevronDown,
  ChevronUp,
  Download,
  type Icon as LucideIcon,
  LogOut,
  Moon,
  Settings,
  SunMedium,
  Trash2,
  Upload,
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
};
