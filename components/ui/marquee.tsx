import { cn } from "@/lib/cn";
import { AnimateWhenVisible } from "./animate-when-visible";

type Props = {
  children: React.ReactNode;
  /** Seconds for one full loop. Higher = slower. */
  duration?: number;
  /** Space between items, any CSS length. */
  gap?: string;
  reverse?: boolean;
  /** Accessible name for the strip, e.g. "Partner logos". */
  label: string;
  className?: string;
};

/**
 * Infinite horizontal ticker (logos, values, keywords). Pure CSS: no JS, no layout shift.
 * - The content is rendered twice; the second copy is aria-hidden so screen readers read it once.
 * - Pauses on hover and on keyboard focus (WCAG 2.2.2: moving content can be paused).
 * - Reduced motion: no scrolling; items wrap and centre instead.
 */
export function Marquee({ children, duration = 40, gap = "3rem", reverse = false, label, className }: Props) {
  const group = "flex shrink-0 items-center gap-[var(--marquee-gap)]";
  return (
    // AnimateWhenVisible: scrolling starts once the page is idle and pauses whenever off-screen.
    <AnimateWhenVisible
      role="region"
      aria-label={label}
      className={cn(
        "group/marquee relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]",
        className,
      )}
      style={{ "--marquee-gap": gap, "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <div
        className={cn(
          "decor-anim flex w-max animate-marquee gap-[var(--marquee-gap)] group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
          "motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center",
        )}
      >
        <ul className={cn(group, "motion-reduce:flex-wrap motion-reduce:justify-center")}>{children}</ul>
        <ul aria-hidden className={cn(group, "motion-reduce:hidden")}>
          {children}
        </ul>
      </div>
    </AnimateWhenVisible>
  );
}
