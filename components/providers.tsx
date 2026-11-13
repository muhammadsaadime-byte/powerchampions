"use client";

import { RevealController } from "@/components/reveal-controller";
import { SmoothScroll } from "@/components/smooth-scroll";

/**
 * App-wide client behaviour:
 * - SmoothScroll: Lenis, on-demand loop, off for reduced motion.
 * - RevealController: one shared IntersectionObserver for every scroll reveal.
 *
 * Motion (`motion` package) is still installed as part of the agreed stack, but nothing on the
 * homepage needs it: reveals, dropdowns and the mobile menu are CSS-driven, which kept it out of
 * the initial JS (~55 kB gzipped) and mobile Lighthouse above 90.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <RevealController />
      {children}
    </>
  );
}
