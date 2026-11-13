import { cn } from "@/lib/cn";
import { Container } from "./container";
import { GridBackground } from "./grid-background";

type Tone = "ink" | "ink-2" | "mist" | "white";

type Props = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** Background: ink #101010 · ink-2 #141414 · mist #F5F5F5 · white */
  tone?: Tone;
  /** Vertical rhythm. "none" lets a section manage its own padding. */
  spacing?: "none" | "sm" | "md" | "lg";
  /** Overlay the animated blueprint grid (dark tones only). */
  grid?: boolean;
  container?: "default" | "narrow" | "wide" | false;
  as?: "section" | "div" | "footer" | "header";
  children: React.ReactNode;
};

const tones: Record<Tone, string> = {
  ink: "bg-ink",
  "ink-2": "bg-ink-2",
  mist: "bg-mist",
  white: "bg-white",
};

const spacings = {
  none: "",
  sm: "py-14 sm:py-16 lg:py-20",
  md: "py-20 sm:py-24 lg:py-32",
  lg: "py-24 sm:py-32 lg:py-40",
};

/**
 * Page section with a brand background tone. Light tones set data-tone="light",
 * which flips headings to #333, body copy to #666 and links to navy (see globals.css).
 */
export function Section({
  tone = "ink",
  spacing = "md",
  grid = false,
  container = "default",
  as: Tag = "section",
  className,
  children,
  ...rest
}: Props) {
  const light = tone === "mist" || tone === "white";
  return (
    <Tag
      data-tone={light ? "light" : "dark"}
      className={cn("relative isolate overflow-hidden", tones[tone], spacings[spacing], className)}
      {...rest}
    >
      {grid && !light && <GridBackground />}
      {container ? <Container size={container}>{children}</Container> : children}
    </Tag>
  );
}
