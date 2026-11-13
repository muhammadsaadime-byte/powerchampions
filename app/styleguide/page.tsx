import type { Metadata } from "next";
import Image from "next/image";
import {
  Button,
  Container,
  EnergyLines,
  GlassCard,
  GridBackground,
  Marquee,
  RevealGroup,
  RevealItem,
  RevealOnScroll,
  Section,
  SectionHeading,
  StatCounter,
} from "@/components/ui";
import { contrast, rating } from "@/lib/contrast";
import loadBankPhoto from "@/public/images/site/generator-load-bank-test-greenville-depot.jpg";
import egsaLogo from "@/public/images/site/egsa-logo.jpg";
import foxLogo from "@/public/images/site/as-seen-on-fox-carolina.jpg";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "PowerChampions design system: brand tokens, type scale and UI components.",
  robots: { index: false, follow: false },
};

/* ── Real copy, taken verbatim from content/home.md ── */
const VALUES = [
  {
    title: "Servant-Leadership",
    body: "We lead by empowering others. True leadership begins with service — supporting our teams, customers, and communities so they can thrive.",
  },
  {
    title: "Empathy",
    body: "Every project, partnership, and interaction begins with listening. We understand before we act.",
  },
  {
    title: "Integrity",
    body: "We do what’s right, every time. Integrity is the foundation of Power Champions.",
  },
  {
    title: "Sincerity",
    body: "We mean what we say and follow through with heart. We approach every commitment with authenticity and honesty.",
  },
];

const COLORS = [
  { name: "Gold", token: "--pc-gold", hex: "#EAA607", role: "Primary · CTAs · accents" },
  { name: "Orange", token: "--pc-orange", hex: "#F57500", role: "Accent · gradients · active" },
  { name: "Ink", token: "--pc-ink", hex: "#101010", role: "Dark background" },
  { name: "Ink 2", token: "--pc-ink-2", hex: "#141414", role: "Alternate dark background" },
  { name: "Heading", token: "--pc-heading", hex: "#333333", role: "Headings on light" },
  { name: "Body", token: "--pc-body", hex: "#666666", role: "Body copy on light" },
  { name: "Mist", token: "--pc-mist", hex: "#F5F5F5", role: "Light background" },
  { name: "Navy", token: "--pc-navy", hex: "#002155", role: "Links on light" },
];

const PAIRS: Array<[string, string, string]> = [
  ["Gold text on Ink", "#EAA607", "#101010"],
  ["Orange text on Ink", "#F57500", "#101010"],
  ["White text on Ink", "#FFFFFF", "#101010"],
  ["Ink label on Gold button", "#101010", "#EAA607"],
  ["White label on Gold button", "#FFFFFF", "#EAA607"],
  ["Heading #333 on Mist", "#333333", "#F5F5F5"],
  ["Body #666 on Mist", "#666666", "#F5F5F5"],
  ["Body #666 on White", "#666666", "#FFFFFF"],
  ["Navy link on Mist", "#002155", "#F5F5F5"],
  ["Gold text on Mist", "#EAA607", "#F5F5F5"],
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 text-xs uppercase tracking-[0.2em] text-on-dark-muted in-data-[tone=light]:text-body">{children}</p>;
}

function Block({ id, title, children, tone = "ink" }: { id: string; title: string; children: React.ReactNode; tone?: "ink" | "ink-2" | "mist" | "white" }) {
  return (
    <Section id={id} tone={tone} spacing="sm" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="mb-10 border-b border-hairline pb-4 text-h3 in-data-[tone=light]:border-black/10">
        {title}
      </h2>
      {children}
    </Section>
  );
}

export default function StyleguidePage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      {/* ── Cover: photo + grid + energy lines, the hero recipe ── */}
      <section className="relative isolate flex min-h-[80svh] items-end overflow-hidden pb-16 pt-32 sm:pb-24">
        <Image
          src={loadBankPhoto}
          alt="PowerChampions technicians' load bank connected to a mobile generator at the Greenville depot, with a branded service truck outside"
          fill
          loading="eager"
          fetchPriority="high"
          quality={60}
          sizes="100vw"
          className="-z-30 object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgb(16_16_16/0.8)_0%,rgb(16_16_16/0.72)_45%,#101010_100%)] md:bg-[linear-gradient(90deg,rgb(16_16_16/0.92)_0%,rgb(16_16_16/0.7)_45%,rgb(16_16_16/0.35)_100%),linear-gradient(180deg,transparent_55%,#101010_100%)]" />
        <GridBackground fade="center" className="-z-10" />
        <EnergyLines />
        <Container>
          <SectionHeading
            as="h1"
            size="display"
            eyebrow="Design system · v1"
            title={
              <>
                Your Power. <span className="text-glow">Our Mission.</span>
              </>
            }
            intro="Brand tokens, type scale and the reusable UI components the PowerChampions site is built from. Every example uses real site copy."
          />
          <nav aria-label="Styleguide sections" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
            {["colors", "contrast", "type", "buttons", "headings", "cards", "stats", "marquee", "reveal", "backgrounds"].map((s) => (
              <a key={s} href={`#${s}`} className="capitalize text-on-dark underline-offset-4 hover:text-gold hover:underline">
                {s}
              </a>
            ))}
          </nav>
        </Container>
      </section>

      {/* ── Colours ── */}
      <Block id="colors" title="Brand colours">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {COLORS.map((c) => (
            <li key={c.token} className="border border-hairline">
              <div className="h-24 border-b border-hairline" style={{ background: c.hex }} />
              <div className="space-y-1 p-4 text-sm">
                <p className="font-bold text-white">{c.name}</p>
                <p className="text-xs text-on-dark">{c.hex}</p>
                <p className="text-xs text-on-dark-muted">var({c.token})</p>
                <p className="pt-1 text-xs text-on-dark-muted">{c.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      {/* ── Contrast ── */}
      <Block id="contrast" title="WCAG contrast check" tone="ink-2">
        <Label>Computed at build time · AA needs 4.5:1 for body text, 3:1 for large text</Label>
        <div className="overflow-x-auto" data-lenis-prevent>
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-on-dark-muted">
              <tr>
                <th className="py-3 pr-4 font-medium">Pair</th>
                <th className="py-3 pr-4 font-medium">Sample</th>
                <th className="py-3 pr-4 font-medium">Ratio</th>
                <th className="py-3 font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {PAIRS.map(([name, fg, bg]) => {
                const r = contrast(fg, bg);
                const res = rating(r);
                return (
                  <tr key={name} className="border-t border-hairline">
                    <td className="py-3 pr-4 text-on-dark">{name}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-block px-3 py-1.5 font-bold" style={{ color: fg, background: bg }}>
                        Critical Power
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-white">{r.toFixed(2)}:1</td>
                    <td className={`py-3 font-bold ${res === "Fail" ? "text-orange" : "text-white"}`}>
                      {res === "Fail" ? "✕ Fail" : `✓ ${res}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-3xl text-sm">
          <strong className="text-white">Decided 2026-11-13:</strong> gold buttons use an ink label (9.0:1). White on gold fails WCAG AA at any size,
          so it isn’t used. Gold text is only used on dark backgrounds.
        </p>
      </Block>

      {/* ── Typography ── */}
      <Block id="type" title="Typography: Exo 400 / 500 / 700">
        <div className="space-y-10">
          <div>
            <Label>Display · clamp(40px → 84px) · 700</Label>
            <p className="text-display font-bold text-white">
              Redefining Leadership In Industrial <span className="text-glow">Critical Power.</span>
            </p>
          </div>
          <div>
            <Label>H1 · clamp(34px → 60px)</Label>
            <p className="text-h1 font-bold text-white">Sell Your Business To a Strategic Partner</p>
          </div>
          <div>
            <Label>H2 · clamp(28px → 44px)</Label>
            <p className="text-h2 font-bold text-white">The Values That Power Us</p>
          </div>
          <div>
            <Label>H3 · clamp(20px → 26px)</Label>
            <p className="text-h3 font-bold text-white">Why Industrial Facilities in the Southeast Choose PowerChampions</p>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <Label>Lead · 500</Label>
              <p className="text-lead font-medium text-on-dark">
                We’re building a national network rooted in trust, integrity, and a shared purpose—combining local expertise with national support.
              </p>
            </div>
            <div>
              <Label>Body · 16px / 400</Label>
              <p className="max-w-prose">
                Our mission is to deliver consistent, high-quality critical power solutions that businesses and communities across America can rely
                on.
              </p>
            </div>
          </div>
          <div>
            <Label>Gradient accent (large display text only)</Label>
            <p className="text-h1 font-bold">
              <span className="text-gradient-gold">Your Power. Our Mission.</span>
            </p>
          </div>
        </div>
      </Block>

      {/* ── Buttons ── */}
      <Block id="buttons" title="Buttons: square corners, gold glow on hover" tone="ink-2">
        <Label>On dark</Label>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/partners">Partner With Us</Button>
          <Button href="/locations" variant="outline">
            Find a Location
          </Button>
          <Button href="/who-we-are" variant="ghost" arrow>
            Who We Are
          </Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Become a Market-Partner</Button>
          <Button disabled>Disabled</Button>
        </div>
        <p className="mt-8 text-sm text-on-dark-muted">
          Gold buttons use an ink label: {contrast("#101010", "#EAA607").toFixed(1)}:1, WCAG AAA.
        </p>
      </Block>
      <Section tone="mist" spacing="sm" aria-label="Buttons on light backgrounds">
        <Label>On light</Label>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/contact-us">Contact Us</Button>
          <Button href="/news" variant="navy">
            News &amp; Resources
          </Button>
        </div>
      </Section>

      {/* ── Section headings ── */}
      <Block id="headings" title="SectionHeading">
        <SectionHeading
          eyebrow="Our network"
          title="We're Building A Network That Powers What Matters"
          intro="We unite independent generator service providers and electrical contractors under one trusted banner — empowering them to grow with confidence while preserving their local identities."
        />
      </Block>
      <Section tone="mist" spacing="sm" aria-label="Section heading on light, centred">
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          title="What Our Partners Say"
          intro="Our partners are at the heart of PowerChampions, and their experiences tell the real story of the platform we’re building."
        />
      </Section>

      {/* ── Cards ── */}
      <Section id="cards" tone="ink" spacing="sm" grid aria-labelledby="cards-h">
        <h2 id="cards-h" className="mb-10 border-b border-hairline pb-4 text-h3">
          GlassCard
        </h2>
        <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <RevealItem as="li" key={v.title}>
              <GlassCard className="h-full">
                <span aria-hidden className="mb-8 flex size-12 items-center justify-center border border-gold/40 text-sm text-gold">
                  0{i + 1}
                </span>
                <h3 className="mb-3 text-h3">{v.title}</h3>
                <p className="text-sm leading-relaxed">{v.body}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <Section tone="mist" spacing="sm" aria-label="GlassCard on light">
        <div className="grid gap-5 md:grid-cols-2">
          <GlassCard tone="light">
            <h3 className="mb-3 text-h3">Backup Power Centers</h3>
            <p>Comprehensive critical power services across the Southeast — generator maintenance, turnkey installation, rentals and compliance.</p>
          </GlassCard>
          <GlassCard tone="light">
            <h3 className="mb-3 text-h3">Data Center Solutions</h3>
            <p>Powering critical infrastructure with discipline, speed, and accountability.</p>
          </GlassCard>
        </div>
      </Section>

      {/* ── Stats ── */}
      <Block id="stats" title="StatCounter" tone="ink-2">
        <Label>Only figures that appear on the live site. Headline stats are still needed from the client.</Label>
        <div className="grid gap-10 sm:grid-cols-3">
          <StatCounter value={200} suffix="+" label="Years of combined leadership expertise" />
          <StatCounter value={3} label="Service locations in SC & GA" />
          <StatCounter value={24} suffix="/7" label="Emergency backup power support" />
        </div>
      </Block>

      {/* ── Marquee ── */}
      <Block id="marquee" title="Marquee">
        <Label>Text: brand values</Label>
        <Marquee label="Our values" duration={30}>
          {["Servant Leadership", "Empathy", "Sincerity", "Integrity", "Your Power. Our Mission."].map((t) => (
            <li key={t} className="flex items-center gap-12 whitespace-nowrap text-h2 font-bold text-white/90">
              {t}
              <span aria-hidden className="size-2 rotate-45 bg-gold" />
            </li>
          ))}
        </Marquee>
        <div className="mt-12">
          <Label>Logos (only EGSA and FOX Carolina are available today)</Label>
          <Marquee label="Affiliations and press" duration={22} gap="4rem">
            {[egsaLogo, foxLogo, egsaLogo, foxLogo].map((src, i) => (
              <li key={i} className="flex h-20 items-center bg-white px-4">
                <Image
                  src={src}
                  alt={src === egsaLogo ? "EGSA member: Electrical Generating Systems Association" : "As seen on FOX Carolina"}
                  height={64}
                  className="h-16 w-auto"
                  sizes="96px"
                  loading="eager"
                />
              </li>
            ))}
          </Marquee>
        </div>
      </Block>

      {/* ── Reveal ── */}
      <Block id="reveal" title="RevealOnScroll" tone="ink-2">
        <Label>Single element · and staggered group (scroll to replay on reload)</Label>
        <RevealOnScroll>
          <p className="max-w-3xl text-h3 font-medium text-white">
            “Because real reliability starts with people who care.”
          </p>
        </RevealOnScroll>
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-3" stagger={0.15}>
          {["Team Members", "Market-Partners", "Communities"].map((t) => (
            <RevealItem key={t}>
              <div className="border-l-2 border-gold bg-white/[0.03] px-5 py-6 font-bold uppercase tracking-[0.14em] text-white">{t}</div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Block>

      {/* ── Backgrounds ── */}
      <Block id="backgrounds" title="GridBackground & EnergyLines">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="relative isolate flex aspect-[4/3] items-end overflow-hidden border border-hairline bg-ink-2 p-6">
            <GridBackground fade="center" />
            <p className="text-xs uppercase tracking-[0.2em] text-on-dark-muted">GridBackground · CSS only</p>
          </div>
          <div className="relative isolate flex aspect-[4/3] items-end overflow-hidden border border-hairline bg-ink-2 p-6">
            <EnergyLines />
            <p className="text-xs uppercase tracking-[0.2em] text-on-dark-muted">EnergyLines · SVG + CSS, no JS</p>
          </div>
        </div>
      </Block>
    </main>
  );
}
