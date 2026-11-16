import { Button, Container, RevealOnScroll } from "@/components/ui";
import { AnimateWhenVisible } from "@/components/ui/animate-when-visible";

/**
 * Closing call to action. Copy verbatim from the live homepage (content/home.md).
 * Gold → orange gradient with ink text (9:1). The "energy" is a field of ink circuit traces
 * drifting slowly via transform (GPU only), paused off-screen and for reduced motion.
 */
type Link = { label: string; href: string };
type Props = { eyebrow?: string; title?: string; text?: string; primary?: Link; secondary?: Link | null };

/** Defaults = the live homepage copy. Inner pages pass their own live closing copy. */
export function CtaBand({
  eyebrow = "Become a Market-Partner",
  title = "We’re building a network that empowers People, Strengthens Partnerships, and Drives progress.",
  text = "Because real reliability starts with people who care.",
  primary = { label: "Become a Market-Partner", href: "/contact-us" },
  secondary = { label: "Why Partner With Us", href: "/partners" },
}: Props) {
  return (
    // data-tone="light": switches the focus ring to navy (gold would be invisible on the gold band).
    <section aria-labelledby="cta-title" data-tone="light" className="cv-auto relative isolate overflow-hidden bg-[linear-gradient(115deg,#EAA607_0%,#F2B21C_40%,#F57500_100%)] py-20 text-ink sm:py-24 lg:py-28">
      <AnimateWhenVisible aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="decor-anim absolute -inset-[200px] animate-grid-drift opacity-[0.16] will-change-transform"
          style={
            {
              "--grid-size": "200px",
              backgroundImage:
                "linear-gradient(90deg, #101010 1px, transparent 1px), linear-gradient(0deg, #101010 1px, transparent 1px), linear-gradient(45deg, transparent 49.5%, #101010 49.5%, #101010 50.5%, transparent 50.5%)",
              backgroundSize: "50px 50px, 50px 50px, 200px 200px",
              maskImage: "radial-gradient(ellipse 80% 90% at 70% 50%, #000 20%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 90% at 70% 50%, #000 20%, transparent 80%)",
            } as React.CSSProperties
          }
        />
      </AnimateWhenVisible>
      {/* Big lightning mark from the logo, cut into the gradient */}
      <svg aria-hidden viewBox="0 0 120 200" className="absolute -right-10 top-1/2 -z-10 h-[140%] -translate-y-1/2 text-ink/[0.07] sm:right-[4%]">
        <path fill="currentColor" d="M78 0 8 112h44L34 200l78-124H66L78 0Z" />
      </svg>

      <Container size="wide" className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <RevealOnScroll className="lg:col-span-8">
          <p className="mb-5 inline-flex items-center gap-3 text-eyebrow font-bold uppercase">
            <span aria-hidden className="h-px w-10 bg-page" />
            {eyebrow}
          </p>
          <h2 id="cta-title" className="text-h1 font-bold text-ink">
            {title}
          </h2>
          {text && <p className="mt-5 max-w-3xl text-lead font-medium text-ink/80">{text}</p>}
        </RevealOnScroll>
        <RevealOnScroll delay={0.15} className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
          <Button href={primary.href} variant="ink" size="lg" arrow>
            {primary.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} variant="ink-outline" size="lg" arrow>
              {secondary.label}
            </Button>
          )}
        </RevealOnScroll>
      </Container>
    </section>
  );
}
