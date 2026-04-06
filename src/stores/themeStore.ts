import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const newDark = !get().isDark;
        set({ isDark: newDark });
        if (newDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
      setTheme: (dark: boolean) => {
        set({ isDark: dark });
        if (dark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }),
    { name: "carpet-theme" }
  )
);

// Initialize theme on load
const storedTheme = localStorage.getItem("carpet-theme");
if (storedTheme) {
  try {
    const parsed = JSON.parse(storedTheme);
    if (parsed.state?.isDark) {
      document.documentElement.classList.add("dark");
    }
  } catch {}
}
