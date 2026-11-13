import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** default 1320px · narrow 880px (long-form copy) · wide 1520px (full-bleed grids) */
  size?: "default" | "narrow" | "wide";
};

const widths = { default: "max-w-[1320px]", narrow: "max-w-[880px]", wide: "max-w-[1520px]" };

/** Horizontal page frame: 16px gutters on phones, 24px on tablets, 32px on desktop. */
export function Container({ size = "default", className, ...rest }: Props) {
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widths[size], className)} {...rest} />;
}
