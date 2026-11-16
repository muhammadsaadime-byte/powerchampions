"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type SceneVariant = "backup" | "racks" | "field" | "map" | "generator";

/**
 * Decorative three.js scene (service-page heroes, homepage hero and network map).
 *
 * Performance rules (the headline, not this, is the LCP element):
 * - three.js is code-split and imported only once the canvas is near the viewport and the page is idle.
 *   On phones it also waits for the first touch/scroll, so a passive page load never pays for it.
 * - Pixel ratio capped at 1.5; the loop stops while off-screen or in a background tab.
 * - prefers-reduced-motion: one still frame, no loop.
 * - Everything is disposed on unmount (client navigation keeps routes mounted).
 *
 * When the scene is up, the parent element gets `data-scene-ready`, so 2D stand-ins marked
 * `.pc-scene-fallback` (energy lines, the SVG map) fade out underneath it. Without WebGL they stay.
 */
export function PowerScene({ variant, className }: { variant: SceneVariant; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const disposers: Array<() => void> = [];

    const start = () => {
      if (cancelled || cleanup) return;
      import("./power-scene-engine")
        .then(({ mountScene }) => {
          if (cancelled) return;
          cleanup = mountScene(el, variant, () => {
            setReady(true);
            el.parentElement?.setAttribute("data-scene-ready", "");
          });
        })
        .catch(() => {
          /* No WebGL / chunk failed: the 2D fallback simply stays. */
        });
    };

    // Gate 1: near the viewport.
    const whenNear = (cb: () => void) => {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            io.disconnect();
            cb();
          }
        },
        { rootMargin: "400px 0px" },
      );
      io.observe(el);
      disposers.push(() => io.disconnect());
    };

    // Gate 2: idle (desktop) or first interaction (phones).
    const whenAllowed = (cb: () => void) => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        const go = () => {
          off();
          cb();
        };
        const opts = { once: true, passive: true } as const;
        const evs = ["pointerdown", "touchstart", "scroll"] as const;
        evs.forEach((ev) => window.addEventListener(ev, go, opts));
        const off = () => evs.forEach((ev) => window.removeEventListener(ev, go));
        disposers.push(off);
      } else {
        const t = window.setTimeout(() => {
          if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 2500 });
          else setTimeout(cb, 1200);
        }, 600);
        disposers.push(() => window.clearTimeout(t));
      }
    };

    whenNear(() => whenAllowed(start));

    return () => {
      cancelled = true;
      disposers.forEach((d) => d());
      cleanup?.();
      el.parentElement?.removeAttribute("data-scene-ready");
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
