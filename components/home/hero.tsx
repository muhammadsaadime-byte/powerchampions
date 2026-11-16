import Image from "next/image";
import { Button, Container, EnergyLines, GridBackground } from "@/components/ui";
import { AnimateWhenVisible } from "@/components/ui/animate-when-visible";
import { PowerScene } from "@/components/services/power-scene";
import heroPhoto from "@/public/images/site/technicians-battery-training-asta-workshop.jpg";
import foxBadge from "@/public/images/site/as-seen-on-fox-carolina.jpg";

/**
 * Homepage hero. Copy: live homepage (content/home.md), headline in the brief's title case.
 * Everything here is server-rendered with CSS-only entrance animations, so the headline
 * (the LCP element) paints on first frame instead of waiting for JS hydration.
 */
const LEAD = ["PowerChampions", "Is", "Redefining", "Leadership", "In", "Industrial"];
const GLOW = ["Critical", "Power."];
const VALUES = ["Servant Leadership", "Empathy", "Sincerity", "Integrity"];
const NETWORK = ["Greenville, SC", "Columbia, SC", "Atlanta, GA"];

const WORD_START = 0.15; // s
const WORD_STEP = 0.07; // s between words
const afterWords = WORD_START + (LEAD.length + GLOW.length) * WORD_STEP;
const delay = (s: number) => ({ animationDelay: `${s.toFixed(2)}s` });

function Word({ children, i }: { children: string; i: number }) {
  return (
    <span className="inline-block animate-word-in" style={delay(WORD_START + i * WORD_STEP)}>
      {children}
    </span>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" data-scheme="dark" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-page">
      {/* Photo: settles from a slight zoom once (no continuous motion). */}
      <div className="pc-hero-photo absolute inset-0 -z-30 overflow-hidden">
        <Image
          src={heroPhoto}
          alt="An American Skilled Trades Academy instructor shows PowerChampions technicians how to test commercial generator batteries during a training workshop"
          fill
          loading="eager"
          fetchPriority="high"
          quality={60}
          sizes="100vw"
          // No placeholder="blur": Next paints it as a full-viewport SVG Gaussian blur, which cost a ~1.6s
          // main-thread task on throttled mobile. The ink background already covers the brief load gap.
          className="animate-hero-settle object-cover object-[58%_30%] md:object-[65%_35%]"
        />
      </div>
      {/* Legibility: vertical wash on phones, left-to-right wash on wider screens, plus a fade into the next section. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgb(16_16_16/0.88)_0%,rgb(16_16_16/0.78)_35%,rgb(16_16_16/0.9)_70%,#101010_100%)] md:bg-[linear-gradient(90deg,rgb(16_16_16/0.96)_0%,rgb(16_16_16/0.84)_38%,rgb(16_16_16/0.45)_70%,rgb(16_16_16/0.3)_100%)]"
      />
      {/* Ink floor under the lower half: the 3D energy field glows on it, and the badges stay legible. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-20 h-1/2 bg-gradient-to-b from-transparent via-ink/70 to-page" />
      <div
        aria-hidden
        className="absolute -left-1/4 top-[30svh] -z-20 size-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgb(234_166_7/0.12),transparent)]"
      />
      <GridBackground fade="center" glow={false} />
      {/* Sized to the viewport, not the content: font swap can change the section height,
          which would re-centre the traces and register as layout shift. */}
      <div aria-hidden className="pc-scene-fallback pointer-events-none absolute inset-x-0 top-0 -z-10 h-svh">
        <EnergyLines intensity={0.9} />
      </div>
      {/* three.js energy field: the national network as linked beacons on a rippling holographic floor. */}
      <PowerScene variant="field" className="absolute inset-x-0 bottom-0 -z-10 h-[78svh] opacity-70 md:opacity-100" />

      <Container size="wide" className="flex flex-1 flex-col justify-center pb-14 pt-[calc(var(--pc-header-h)+2.5rem)] md:pb-12">
        <div className="max-w-[60rem]">
          <p
            className="mb-6 inline-flex animate-fade-up items-center gap-3 text-eyebrow font-bold uppercase text-accent"
            style={delay(0.05)}
          >
            <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
            Your Power. Our Mission.
          </p>

          <h1 id="hero-title" className="text-display font-bold text-fg">
            {LEAD.map((w, i) => (
              <span key={w + i}>
                <Word i={i}>{w}</Word>{" "}
              </span>
            ))}
            <span className="text-glow">
              {GLOW.map((w, i) => (
                <span key={w}>
                  <Word i={LEAD.length + i}>{w}</Word>
                  {i < GLOW.length - 1 ? " " : ""}
                </span>
              ))}
            </span>
          </h1>

          <p className="mt-7 max-w-2xl animate-fade-up text-lead text-on-dark" style={delay(afterWords + 0.05)}>
            We’re building a national network rooted in trust, integrity, and a shared purpose—combining local expertise with national support.
            Our mission is to deliver consistent, high-quality critical power solutions that businesses and communities across America can rely on.
          </p>

          <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-4" style={delay(afterWords + 0.2)}>
            <Button href="/contact-us" size="lg">
              Partner With Us
            </Button>
            <Button href="/locations" variant="outline" size="lg" arrow>
              Find a Location
            </Button>
          </div>

          <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-5" style={delay(afterWords + 0.35)}>
            <div className="flex items-center gap-3 border border-hairline bg-fg/[0.04] py-2 pl-2 pr-4 backdrop-blur-md">
              {/* Decorative: the text beside it already says "As seen on FOX Carolina". */}
              <Image src={foxBadge} alt="" height={48} sizes="58px" className="h-12 w-auto" />
              <span className="text-xs font-medium uppercase leading-tight tracking-[0.14em] text-on-dark">
                As seen on
                <br />
                <span className="font-bold text-fg">FOX Carolina</span>
              </span>
            </div>
            <ul aria-label="Our values" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.18em] text-on-dark-muted">
              {VALUES.map((v, i) => (
                <li key={v} className="flex items-center gap-4">
                  {i > 0 && <span aria-hidden className="size-1 rotate-45 bg-gold" />}
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* HUD strip: live network locations + scroll cue (desktop). */}
      <div className="hidden animate-fade-up border-t border-hairline md:block" style={delay(afterWords + 0.5)}>
        <AnimateWhenVisible>
        <Container size="wide" className="flex h-16 items-center justify-between text-xs font-medium uppercase tracking-[0.18em]">
          <div className="flex items-center gap-8">
            <span className="text-on-dark-muted">Network</span>
            <ul className="flex items-center gap-7 text-fg">
              {NETWORK.map((n, i) => (
                <li key={n} className="flex items-center gap-2.5">
                  <span aria-hidden className="relative flex size-2">
                    <span className="decor-anim absolute inset-0 animate-pulse-dot rounded-full bg-gold" style={delay(i * 0.6)} />
                    <span className="relative size-2 rounded-full bg-gold shadow-[0_0_8px_rgb(234_166_7/0.9)]" />
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <a href="#after-hero" className="group/scroll flex items-center gap-3 text-on-dark hover:text-accent">
            Scroll
            <span aria-hidden className="relative h-8 w-px overflow-hidden bg-fg/15">
              <span className="decor-anim absolute inset-0 animate-scroll-cue bg-gold" />
            </span>
          </a>
        </Container>
        </AnimateWhenVisible>
      </div>
    </section>
  );
}
