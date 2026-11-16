import Image from "next/image";
import { Button, Container, EnergyLines, GridBackground } from "@/components/ui";
import { AnimateWhenVisible } from "@/components/ui/animate-when-visible";
import { PowerScene } from "@/components/services/power-scene";
import foxBadge from "@/public/images/site/as-seen-on-fox-carolina.jpg";

/**
 * Homepage hero. Copy: live homepage (content/home.md), headline in the brief's title case.
 * Layout: copy on the left over solid ink; a three.js night city fills the right and bottom
 * (components/services/city-scene.ts) and loops a grid outage where the protected facilities stay lit.
 * Everything here is server-rendered with CSS-only entrance animations, so the headline
 * (the LCP element) paints on first frame instead of waiting for JS hydration. Until three.js has
 * loaded (and on software-rendered devices) the grid, glow and energy lines stand in.
 */
const LEAD = ["PowerChampions", "Is", "Redefining", "Leadership", "In", "Industrial"];
const GLOW = ["Critical", "Power."];
const NETWORK = ["Greenville, SC", "Columbia, SC", "Atlanta, GA"];
/** Facts already stated in the stats bar below (trust-bar.tsx). */
const FACTS = [
  { value: "24/7", label: "Emergency response, 365 days a year" },
  { value: "3", label: "Service locations across SC & GA" },
];

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
      <GridBackground fade="center" glow={false} />
      {/* Ambient glow where the city sits, so the hero reads well before the scene loads. */}
      <div
        aria-hidden
        className="absolute bottom-[-20%] right-[-10%] -z-20 size-[110vmin] rounded-full bg-[radial-gradient(closest-side,rgb(234_166_7/0.16),rgb(245_117_0/0.05)_55%,transparent)]"
      />
      {/* Sized to the viewport, not the content: font swap can change the section height,
          which would re-centre the traces and register as layout shift. */}
      <div aria-hidden className="pc-scene-fallback pointer-events-none absolute inset-x-0 top-0 -z-10 h-svh">
        <EnergyLines intensity={0.9} />
      </div>
      <PowerScene variant="city" className="absolute inset-0 -z-10 hidden xl:left-[24%] xl:block" />
      {/* Legibility: solid ink under the copy, fading out towards the city; soft fade into the next section. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_16_16/0.75),rgb(16_16_16/0.55)_55%,rgb(16_16_16/0.85))] xl:bg-[linear-gradient(90deg,#101010_0%,rgb(16_16_16/0.94)_30%,rgb(16_16_16/0.55)_52%,transparent_72%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-page" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-page to-transparent" />

      <Container size="wide" className="flex flex-1 flex-col justify-center pb-14 pt-[calc(var(--pc-header-h)+2.5rem)] md:pb-12">
        <div className="max-w-[58rem]">
          <p className="mb-6 inline-flex animate-fade-up items-center gap-3 border border-gold/30 bg-gold/[0.07] px-4 py-2 text-eyebrow font-bold uppercase text-accent backdrop-blur-md" style={delay(0.05)}>
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-pulse-dot rounded-full bg-gold" />
              <span className="relative size-2 rounded-full bg-gold" />
            </span>
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

          {/* Proof row: two facts and the press badge. */}
          <div className="mt-10 flex animate-fade-up flex-wrap items-stretch gap-3" style={delay(afterWords + 0.35)}>
            <dl className="flex items-stretch gap-3">
              {FACTS.map((f) => (
                <div key={f.label} className="flex max-w-[11.5rem] flex-col border border-hairline bg-fg/[0.04] px-4 py-3 backdrop-blur-md">
                  <dt className="order-2 mt-1 text-[0.6875rem] font-medium uppercase leading-snug tracking-[0.12em] text-on-dark-muted">{f.label}</dt>
                  <dd className="text-2xl font-bold text-accent">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center gap-3 border border-hairline bg-fg/[0.04] py-2 pl-2 pr-4 backdrop-blur-md">
              {/* Decorative: the text beside it already says "As seen on FOX Carolina". */}
              <Image src={foxBadge} alt="" height={48} sizes="58px" className="h-12 w-auto" />
              <span className="text-xs font-medium uppercase leading-tight tracking-[0.14em] text-on-dark">
                As seen on
                <br />
                <span className="font-bold text-fg">FOX Carolina</span>
              </span>
            </div>
          </div>


          {/* Below xl the scene gets its own framed stage in the flow (behind-the-text only works on wide screens). */}
          <div className="relative isolate mt-10 h-64 overflow-hidden border border-hairline bg-[radial-gradient(ellipse_at_50%_65%,rgb(234_166_7/0.14),transparent_65%),linear-gradient(180deg,#151515,#0c0c0c)] sm:h-80 md:h-96 xl:hidden">
            <PowerScene variant="city" className="absolute inset-0" />
            {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((pos) => (
              <span key={pos} aria-hidden className={`absolute size-5 border-gold/70 ${pos}`} />
            ))}
          </div>
        </div>
      </Container>

      {/* HUD strip: live network locations + scroll cue (desktop). */}
      <div className="hidden animate-fade-up border-t border-hairline bg-page/60 backdrop-blur-md md:block" style={delay(afterWords + 0.55)}>
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
