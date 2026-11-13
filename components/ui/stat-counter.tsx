"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
  /** Seconds. */
  duration?: number;
  className?: string;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Number that counts up when it scrolls into view.
 * - The server renders the final value, so SEO and no-JS visitors see the real number.
 * - A hidden copy of the final value reserves the width, so counting never shifts layout.
 * - Screen readers get the final value once; the animated digits are aria-hidden.
 * - Reduced motion: the final value just stays put.
 * - No animation library: one IntersectionObserver plus a requestAnimationFrame tween
 *   that writes straight to the DOM node (no React re-renders).
 */
export function StatCounter({ value, prefix = "", suffix = "", label, decimals = 0, duration = 2, className }: Props) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const format = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const final = format(value);

  useEffect(() => {
    const node = numberRef.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / (duration * 1000), 1);
        node.textContent = format(value * easeOutExpo(t));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    node.textContent = format(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = format(value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, decimals]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="font-bold leading-none text-white in-data-[tone=light]:text-heading">
        <span className="sr-only">
          {prefix}
          {final}
          {suffix} {label}
        </span>
        <span aria-hidden className="inline-flex items-baseline text-[clamp(2.5rem,1.9rem+2.6vw,4rem)] tabular-nums tracking-tight">
          {prefix && <span>{prefix}</span>}
          <span className="inline-grid">
            <span className="invisible col-start-1 row-start-1">{final}</span>
            <span ref={numberRef} className="col-start-1 row-start-1 text-right">
              {final}
            </span>
          </span>
          {suffix && <span className="text-glow in-data-[tone=light]:text-heading in-data-[tone=light]:[text-shadow:none]">{suffix}</span>}
        </span>
      </p>
      <p
        aria-hidden
        className="text-xs font-medium uppercase leading-relaxed tracking-[0.1em] text-on-dark-muted sm:text-sm sm:tracking-[0.16em] in-data-[tone=light]:text-body"
      >
        {label}
      </p>
    </div>
  );
}
