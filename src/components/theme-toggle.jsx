"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    // Play sound effect
    const soundFile =
      nextTheme === "dark"
        ? "/sounds/switch-off.mp3"
        : "/sounds/switch-on.mp3";
    const audio = new Audio(soundFile);
    audio.play().catch(err => console.error("Failed to play theme sound:", err));
    setTheme(nextTheme);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleToggle}
      className="cursor-pointer hover:bg-transparent mt-1 text-muted-foreground"
      aria-label="Toggle theme"
    >
      <SunIcon className="w-5 h-5 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute w-5 h-5 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
