import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface PageSizeDropdownProps {
  pageSize: number;
  onPageSizeChange: (newSize: number) => void;
  options: number[];
}

export function PageSizeDropdown({
  pageSize,
  onPageSizeChange,
  options,
}: PageSizeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between">
          {pageSize}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => onPageSizeChange(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
