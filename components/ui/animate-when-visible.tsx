"use client";

import { useEffect, useRef } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode };

/**
 * Wrapper for decorative CSS animations (grid drift, energy pulses, map dots).
 * Its CSS animations stay paused (see [data-decor] in globals.css) until:
 *   1. the browser is idle after load, so decoration never competes with LCP or hydration, and
 *   2. the element is on screen. Off-screen decoration pauses, so it costs no paint work.
 */
export function AnimateWhenVisible({ children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | undefined;
    const start = () => {
      io = new IntersectionObserver(([e]) => el.toggleAttribute("data-active", e.isIntersecting), { rootMargin: "100px" });
      io.observe(el);
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    let handle: number | undefined;
    const schedule = () => (handle = idle(start, { timeout: 2500 } as IdleRequestOptions) as number);
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (handle !== undefined) cancel(handle);
      io?.disconnect();
      el.removeAttribute("data-active");
    };
  }, []);

  return (
    <div ref={ref} data-decor="" {...rest}>
      {children}
    </div>
  );
}
