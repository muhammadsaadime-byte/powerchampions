import { cn } from "@/lib/cn";
import { AnimateWhenVisible } from "./animate-when-visible";

type Props = {
  /** Where the grid stays visible before fading out. */
  fade?: "center" | "top" | "bottom";
  /** Slowly drift the grid. Starts after load, pauses off-screen and for reduced motion. */
  animated?: boolean;
  /** Soft gold light bloom behind the grid. */
  glow?: boolean;
  /** Grid cell size in px. */
  size?: number;
  className?: string;
};

const masks = {
  center: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 100%)",
  top: "linear-gradient(to bottom, #000 0%, transparent 85%)",
  bottom: "linear-gradient(to top, #000 0%, transparent 85%)",
};

/**
 * Blueprint-style grid for dark sections. Decorative (aria-hidden).
 * The drift moves an oversized layer with `transform` (GPU-composited, no repaints).
 * The mask sits on a static parent, so the fade stays fixed while the lines move.
 */
export function GridBackground({ fade = "center", animated = true, glow = true, size = 64, className }: Props) {
  const big = size * 4;
  const layer = (bg: string, cell: number, extra?: string) => (
    <div
      className={cn("absolute will-change-transform", animated && "decor-anim animate-grid-drift", extra)}
      style={
        {
          inset: `-${big}px`,
          "--grid-size": `${big}px`,
          backgroundImage: bg,
          backgroundSize: `${cell}px ${cell}px`,
        } as React.CSSProperties
      }
    />
  );

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {glow && (
        <div className="absolute left-1/2 top-[-20%] h-[70%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(234_166_7/0.14),transparent)] blur-2xl" />
      )}
      <AnimateWhenVisible className="absolute inset-0" style={{ maskImage: masks[fade], WebkitMaskImage: masks[fade] }}>
        {layer(
          "linear-gradient(to right, var(--pc-grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--pc-grid-line) 1px, transparent 1px)",
          size,
        )}
        {/* Gold intersections every 4 cells give the grid an "engineered" feel. */}
        {layer("radial-gradient(circle at 0.5px 0.5px, rgb(234 166 7 / 0.55) 1px, transparent 1.6px)", big, "opacity-60")}
      </AnimateWhenVisible>
    </div>
  );
}
