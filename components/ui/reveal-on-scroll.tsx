/**
 * Scroll reveals as plain server-rendered elements + CSS transitions (see [data-reveal] in globals.css).
 * One shared IntersectionObserver (components/reveal-controller.tsx) flips `data-revealed` on them.
 *
 * Why not Motion components: with ~35 reveals on the homepage, per-element Motion components cost
 * hydration + one observer each and kept mobile Lighthouse below 90. This version ships zero JS per
 * element. Same API as before, so call sites didn't change.
 *
 * No-JS / before hydration: everything is visible. Hiding only applies once <html> has `reveal-ready`,
 * which the controller sets after first marking anything already on screen as revealed (no flash).
 * Don't wrap above-the-fold LCP content (hero headline/image).
 */

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds before the reveal starts. */
  delay?: number;
  /** Distance in px the element travels up while fading in. */
  y?: number;
  as?: "div" | "li" | "section" | "article" | "span";
  /** Kept for API compatibility (the shared observer uses a fixed threshold). */
  amount?: number;
};

export function RevealOnScroll({ children, className, delay = 0, y = 28, as: Tag = "div" }: RevealProps) {
  return (
    <Tag data-reveal="" className={className} style={{ "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}

/** Parent for a staggered reveal: its <RevealItem> children appear one after another. */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol" | "section";
  amount?: number;
}) {
  return (
    <Tag data-reveal="" data-reveal-group="" className={className} style={{ "--reveal-stagger": `${stagger}s` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}

export function RevealItem({ children, className, as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  return (
    <Tag data-reveal-item="" className={className}>
      {children}
    </Tag>
  );
}
