import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li";
  /** Hover lift, gold edge and glow. Turn off for static containers (forms etc.). */
  interactive?: boolean;
  /** "dark" = frosted glass on ink · "light" = white card with soft shadow on mist/white sections */
  tone?: "dark" | "light";
  padding?: "sm" | "md" | "lg";
};

const pads = { sm: "p-5", md: "p-6 sm:p-8", lg: "p-8 sm:p-10" };

/**
 * Frosted-glass card. Square corners to match the brand buttons.
 * The hover glow uses a ::before gradient border and a ::after light bloom: CSS only.
 */
export function GlassCard({ as: Tag = "div", interactive = true, tone = "dark", padding = "md", className, ...rest }: Props) {
  return (
    <Tag
      className={cn(
        "group/card relative isolate overflow-hidden rounded-none border transition-[transform,box-shadow,border-color,background-color] duration-500 ease-out-expo",
        pads[padding],
        tone === "dark"
          ? "border-hairline bg-[var(--pc-glass)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--pc-glass)]"
          : "border-black/[0.06] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_40px_-18px_rgb(0_0_0/0.18)]",
        interactive &&
          (tone === "dark"
            ? "hover:border-gold/45 hover:bg-[var(--pc-glass-strong)] hover:shadow-glow-soft motion-safe:hover:-translate-y-1"
            : "hover:border-gold/60 hover:shadow-[0_0_0_1px_rgb(234_166_7/0.35),0_24px_60px_-24px_rgb(234_166_7/0.45)] motion-safe:hover:-translate-y-1"),
        // gold top edge that grows in on hover
        interactive &&
          "before:absolute before:inset-x-0 before:top-0 before:h-px before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-gold before:via-orange before:to-transparent before:transition-transform before:duration-700 before:ease-out-expo hover:before:scale-x-100",
        // light bloom from the top-left corner
        interactive &&
          tone === "dark" &&
          "after:pointer-events-none after:absolute after:-left-1/4 after:-top-1/2 after:-z-10 after:size-[120%] after:bg-[radial-gradient(closest-side,rgb(234_166_7/0.16),transparent)] after:opacity-0 after:transition-opacity after:duration-700 hover:after:opacity-100",
        className,
      )}
      {...rest}
    />
  );
}
