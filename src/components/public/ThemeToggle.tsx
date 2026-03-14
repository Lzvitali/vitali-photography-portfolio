"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-700" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-full border border-neutral-300 dark:border-neutral-700 
        flex items-center justify-center transition-colors duration-300
        hover:bg-neutral-100 dark:hover:bg-neutral-800"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
