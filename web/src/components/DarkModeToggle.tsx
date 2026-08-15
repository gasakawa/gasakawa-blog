"use client";

import { useState } from "react";

function getInitialIsDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(getInitialIsDark);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      suppressHydrationWarning
      className="text-sm text-muted hover:text-foreground transition-colors"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
