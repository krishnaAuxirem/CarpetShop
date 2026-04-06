import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-muted ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent transition-all duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-foreground transition-all duration-300" />
      )}
    </button>
  );
};
