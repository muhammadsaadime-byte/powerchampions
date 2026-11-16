"use client";

import { cn } from "@/lib/cn";

/**
 * Light/dark switch. Which icon shows is decided in CSS (.pc-to-light / .pc-to-dark in globals.css),
 * so it is right on first paint and needs no hydration-time state.
 * The choice is stored in localStorage and re-applied before paint by <ThemeScript />.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("pc-theme", next);
    } catch {
      /* private mode: the choice just won't persist */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "group/theme flex size-11 items-center justify-center border border-hairline text-fg transition-colors hover:border-gold/60 hover:text-accent",
        className,
      )}
    >
      {/* Shown in dark theme: offers light. */}
      <span className="pc-to-light flex items-center">
        <span className="sr-only">Switch to light theme</span>
        <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </svg>
      </span>
      {/* Shown in light theme: offers dark. */}
      <span className="pc-to-dark flex items-center">
        <span className="sr-only">Switch to dark theme</span>
        <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
        </svg>
      </span>
    </button>
  );
}
