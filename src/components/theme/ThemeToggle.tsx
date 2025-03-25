
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";
import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle
            pressed={theme === 'dark'}
            onPressedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="border-2 border-primary/50 p-0.5 rounded-full h-10 w-10 flex items-center justify-center shadow-lg bg-background"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? 
              <Sun className="h-5 w-5 text-yellow-400" /> : 
              <MoonStar className="h-5 w-5 text-primary" />
            }
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background border-2 border-primary/20 rounded-xl shadow-xl">
          <DropdownMenuItem onClick={() => setTheme("light")} className={theme === "light" ? "bg-accent font-medium" : ""}>
            <Sun className="h-4 w-4 mr-2" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className={theme === "dark" ? "bg-accent font-medium" : ""}>
            <Moon className="h-4 w-4 mr-2" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className={theme === "system" ? "bg-accent font-medium" : ""}>
            <svg
              className="h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
