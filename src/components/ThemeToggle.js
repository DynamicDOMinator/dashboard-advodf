"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("theme") || "system"
      : "system";
  });

  function apply(next) {
    const root = document.documentElement;
    if (next === "dark") {
      root.setAttribute("data-theme", "dark");
      return;
    }
    if (next === "system") {
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.setAttribute("data-theme", "dark");
        return;
      }
    }
    root.removeAttribute("data-theme");
  }

  function set(next) {
    setTheme(next);
    localStorage.setItem("theme", next);
    apply(next);
  }

  useEffect(() => {
    apply(theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <button
        className={`btn ${theme === "system" ? "btn-outline" : "btn-outline"}`}
        onClick={() => set("system")}
      >
        النظام
      </button>
      <button
        className={`btn ${theme === "dark" ? "btn-primary" : "btn-outline"}`}
        onClick={() => set("dark")}
      >
        داكن
      </button>
      <button
        className={`btn ${theme === "light" ? "btn-primary" : "btn-outline"}`}
        onClick={() => set("light")}
      >
        فاتح
      </button>
    </div>
  );
}
