"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
  };

  return (
    <Button
      data-theme-sound={resolvedTheme === "dark" ? "/sounds/switch-on.mp3" : "/sounds/switch-off.mp3"}
      size="icon"
      variant="ghost"
      onClick={handleToggle}
      className="cursor-pointer text-muted-foreground hover:bg-muted"
      aria-label="Toggle theme"
    >
      <SunIcon className="w-5 h-5 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute w-5 h-5 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
