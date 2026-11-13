import { cn } from "@/lib/cn";

type Props = {
  /** Small uppercase label above the title. Gold on dark; dark grey with a gold rule on light (gold text fails AA on light). */
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  /** Semantic level. Visual size is set by `size`. */
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h1" | "h2";
  className?: string;
  id?: string;
};

const sizes = { display: "text-display", h1: "text-h1", h2: "text-h2" };

export function SectionHeading({ eyebrow, title, intro, align = "left", as: Tag = "h2", size = "h2", className, id }: Props) {
  const center = align === "center";
  return (
    <div className={cn("flex max-w-3xl flex-col gap-5", center && "mx-auto items-center text-center", className)}>
      {eyebrow && (
        <p className="inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-gold in-data-[tone=light]:text-heading">
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-gold to-orange" />
          {eyebrow}
          {center && <span aria-hidden className="h-px w-8 bg-gradient-to-l from-gold to-orange" />}
        </p>
      )}
      <Tag id={id} className={cn("font-bold", sizes[size])}>
        {title}
      </Tag>
      {intro && <div className="text-lead text-on-dark in-data-[tone=light]:text-body">{intro}</div>}
    </div>
  );
}
