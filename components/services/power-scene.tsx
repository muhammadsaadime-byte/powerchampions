"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type SceneVariant = "core" | "racks";

/**
 * Decorative three.js scene for service-page heroes.
 *
 * Performance rules (the headline, not this, is the LCP element):
 * - three.js is code-split and imported only after the page is idle. On phones it waits for the
 *   first touch/scroll, so a passive page load never pays for it.
 * - Pixel ratio capped at 1.5; the loop stops while off-screen or in a background tab.
 * - prefers-reduced-motion: one still frame, no loop.
 * - Everything is disposed on unmount (client navigation keeps routes mounted).
 */
export function PowerScene({ variant, className }: { variant: SceneVariant; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const start = () => {
      if (cancelled || cleanup) return;
      import("./power-scene-engine").then(({ mountScene }) => {
        if (cancelled) return;
        cleanup = mountScene(el, variant, () => setReady(true));
      });
    };

    const small = window.matchMedia("(max-width: 767px)").matches;
    const timers: number[] = [];
    let removeListeners = () => {};

    if (small) {
      const go = () => {
        removeListeners();
        start();
      };
      const opts = { once: true, passive: true } as const;
      window.addEventListener("pointerdown", go, opts);
      window.addEventListener("touchstart", go, opts);
      window.addEventListener("scroll", go, opts);
      removeListeners = () => {
        window.removeEventListener("pointerdown", go);
        window.removeEventListener("touchstart", go);
        window.removeEventListener("scroll", go);
      };
    } else {
      const idle = (cb: () => void) => {
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 2500 });
        else setTimeout(cb, 1200);
      };
      timers.push(window.setTimeout(() => idle(start), 600));
    }

    return () => {
      cancelled = true;
      removeListeners();
      timers.forEach((t) => window.clearTimeout(t));
      cleanup?.();
    };
  }, [variant]);

  return (
    <div
      ref={host}
      aria-hidden
      className={cn("pointer-events-none transition-opacity duration-[1600ms] ease-out", ready ? "opacity-100" : "opacity-0", className)}
    />
  );
}
