
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  variant?: "button" | "dropdown";
}

export function ThemeToggle({ variant = "button" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (variant === "dropdown") {
    return (
      <div 
        className="flex w-full items-center cursor-pointer"
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <>
            <Sun className="mr-2 h-5 w-5" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <MoonStar className="mr-2 h-5 w-5" />
            <span>Dark Mode</span>
          </>
        )}
      </div>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <MoonStar className="h-5 w-5" />
      )}
    </Button>
  );
}
