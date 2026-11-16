import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "navy" | "ink" | "ink-outline";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  /** Show the trailing arrow. On by default for primary buttons. */
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AsLink = Common & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const base =
  "group/btn relative isolate inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-none font-bold uppercase tracking-[0.12em] " +
  "transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-out-expo " +
  "disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-0.5";

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-[0.75rem]",
  md: "min-h-12 px-6 text-[0.8125rem]",
  lg: "min-h-14 px-8 text-sm",
};

const variants: Record<Variant, string> = {
  // Ink label on gold: 9.0:1 (WCAG AAA). Brand decision 2026-11-13: white-on-gold (2.1:1) fails AA, so it isn't offered.
  primary: "bg-gold text-ink hover:shadow-glow active:bg-orange",
  outline: "border border-gold/70 text-fg hover:border-gold hover:bg-gold/10 hover:shadow-glow-soft",
  ghost: "text-fg hover:text-accent px-0! min-h-11!",
  navy: "bg-navy text-white hover:bg-[#00307a] hover:shadow-[0_10px_30px_-8px_rgb(0_33_85/0.6)]",
  // For use on gold backgrounds (CTA band): white on ink 19:1, ink border on gold 9:1.
  ink: "bg-ink text-white hover:shadow-[0_14px_40px_-10px_rgb(16_16_16/0.75)]",
  "ink-outline": "border border-ink/70 text-ink hover:border-ink hover:bg-ink/10",
};

/** Light sweep that crosses the button on hover; decorative only. */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[left,opacity] duration-700 ease-out-expo group-hover/btn:left-[120%] group-hover/btn:opacity-100 motion-reduce:hidden"
    />
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-3.5 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-1"
    >
      <path d="M1 8h12M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", arrow, className, children, ...rest } = props;
  const showArrow = arrow ?? variant === "primary";
  const classes = cn(base, sizes[size], variants[variant], className);
  const inner = (
    <>
      {(variant === "primary" || variant === "navy" || variant === "ink") && <Sheen />}
      <span>{children}</span>
      {showArrow && <Arrow />}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchor } = rest as AsLink;
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      const newTab = href.startsWith("http");
      return (
        <a href={href} className={classes} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...anchor}>
          {inner}
          {newTab && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {inner}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as AsButton;
  return (
    <button type={type} className={classes} {...button}>
      {inner}
    </button>
  );
}
