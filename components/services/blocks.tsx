import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Container, GridBackground, RevealGroup, RevealItem, RevealOnScroll, Section } from "@/components/ui";
import { cn } from "@/lib/cn";
import { SITE_URL } from "@/lib/site";
import { PowerScene, type SceneVariant } from "./power-scene";

/* ─────────────── Icons (24px line icons, stroke = currentColor) ─────────────── */
const PATHS = {
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  factory: "M3 21V10l5 3V10l5 3V6l8 4v11H3Zm4-4h2m3 0h2m3 0h2",
  engine: "M4 9h3l2-2h5l2 2h2v2h2v4h-2v2h-3l-2 2H9l-2-2H4V9Zm4 4h7",
  shield: "M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Zm-3.5 9 2.5 2.5 4.5-5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2",
  radar: "M12 12 18 6M12 21a9 9 0 1 1 9-9M12 16.5a4.5 4.5 0 1 1 4.5-4.5M21 12h-2",
  crown: "M3 18h18M4 8l4.5 4L12 5l3.5 7L20 8l-1.5 8h-13L4 8Z",
  heart: "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Zm-4.5-8h2.5l1.5-2.5 2 5 1.5-2.5h2.5",
  siren: "M6 18v-6a6 6 0 0 1 12 0v6M4 18h16v3H4zM12 3v2M4.2 6.2l1.4 1.4M19.8 6.2l-1.4 1.4",
  plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8Zm6 9v4",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  gauge: "M4.5 17a8.5 8.5 0 1 1 15 0M12 13l4-5M8 17h8",
  fuel: "M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14M7.5 7h5v4h-5zM15 9h2.5a1.5 1.5 0 0 1 1.5 1.5V17a1.5 1.5 0 0 0 3 0V8l-3-3",
  battery: "M3 7h16v10H3zM19 10h2v4h-2M7 12h2m-1-1v2m6-1h2",
  doc: "M6 3h8l4 4v14H6V3Zm8 0v4h4M9 12h6M9 16h6",
  wifi: "M3.5 9a12 12 0 0 1 17 0M6.5 12.5a7.5 7.5 0 0 1 11 0M9.5 16a3 3 0 0 1 5 0M12 19.5h.01",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  cog: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  switch: "M4 7h16M4 17h16M8 4v6M16 14v6",
  server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01M12 7h5M12 17h5",
  chart: "M3 20h18M5 16.5l4.5-4.5 3.5 3 6-7M14.5 8H19v4.5",
  handshake: "m11 7-4-2-4 4 4 6 3 3a1.5 1.5 0 0 0 2.2-2M13 7l4-2 4 4-4 6-3.5 3.5a1.5 1.5 0 0 1-2.2-2L14 13M11 7l2-1 3 3-3.5 1.5",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 10a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 15a5.5 5.5 0 0 1 3 6",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-3.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  check: "m5 12.5 4.5 4.5L19 7.5",
} as const;
export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn("size-6", className)} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-accent">
      <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
      {children}
    </p>
  );
}

/* ─────────────── Hero ─────────────── */
type Crumb = { label: string; href: string };
export type Spec = { value: string; label: string };

export function ServiceHero({
  crumbs,
  eyebrow,
  title,
  intro,
  actions,
  specs,
  scene,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: React.ReactNode;
  intro: React.ReactNode;
  actions: React.ReactNode;
  specs: Spec[];
  scene: SceneVariant;
}) {
  const trail = [{ label: "Home", href: "/" }, ...crumbs];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: SITE_URL + c.href })),
  };

  return (
    <section data-scheme="dark" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-page pt-[calc(var(--pc-header-h)+3rem)] lg:pt-[calc(var(--pc-header-h)+4.5rem)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GridBackground fade="center" />
      {/* Ambient glow where the 3D scene sits, so the hero already reads well before three.js loads. */}
      <div
        aria-hidden
        className="absolute right-[-15%] top-[8svh] -z-20 size-[90vmin] rounded-full bg-[radial-gradient(closest-side,rgb(234_166_7/0.16),rgb(245_117_0/0.05)_55%,transparent)] xl:right-[2%]"
      />
      <PowerScene variant={scene} className="absolute inset-0 -z-10 hidden xl:left-[38%] xl:block" />
      {/* Legibility: the copy column always sits on solid-enough ink. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_16_16/0.35),rgb(16_16_16/0.7)_60%,#101010)] xl:bg-[linear-gradient(90deg,#101010_0%,rgb(16_16_16/0.92)_32%,rgb(16_16_16/0.2)_62%,transparent_80%),linear-gradient(180deg,transparent_70%,#101010)]"
      />

      <Container size="wide" className="flex flex-1 flex-col">
        <nav aria-label="Breadcrumb" className="mb-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <ol className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-on-dark-muted">
            {trail.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-accent">/</span>}
                {i < trail.length - 1 ? (
                  <Link href={c.href} className="-my-3 inline-block py-3 hover:text-accent">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-fg">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="mb-5 inline-flex animate-fade-up items-center gap-3 text-eyebrow font-bold uppercase text-accent" style={{ animationDelay: "0.1s" }}>
            <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
            {eyebrow}
          </p>
          <h1 className="animate-fade-up text-display font-bold text-fg" style={{ animationDelay: "0.15s" }}>
            {title}
          </h1>
          <div className="mt-6 max-w-2xl animate-fade-up text-lead text-on-dark" style={{ animationDelay: "0.3s" }}>
            {intro}
          </div>
          <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-4" style={{ animationDelay: "0.45s" }}>
            {actions}
          </div>
        </div>

        {/* Spec readout pinned to the bottom of the hero; the spacer keeps a minimum gap above it on short screens. */}
        {/* Below xl the scene gets its own framed stage in the flow (behind-the-text only works on wide screens). */}
        <div className="relative isolate mt-10 h-64 overflow-hidden border border-hairline bg-[radial-gradient(ellipse_at_50%_65%,rgb(234_166_7/0.14),transparent_65%),linear-gradient(180deg,#151515,#0c0c0c)] sm:h-80 md:h-96 xl:hidden">
          <PowerScene variant={scene} className="absolute inset-0" />
          {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((pos) => (
            <span key={pos} aria-hidden className={`absolute size-5 border-gold/70 ${pos}`} />
          ))}
        </div>
        <div aria-hidden className="hidden min-h-16 flex-1 xl:block" />
        <dl className="mb-10 mt-6 grid xl:mt-0 grid-cols-2 gap-px overflow-hidden border border-hairline bg-hairline pt-px backdrop-blur-md sm:mb-14 lg:grid-cols-4">
          {specs.map((s, i) => (
            <div key={s.label} className="flex animate-fade-up flex-col bg-page/80 p-5 sm:p-6" style={{ animationDelay: `${0.55 + i * 0.07}s` }}>
              <dt className="order-2 mt-2 text-xs uppercase tracking-[0.14em] text-on-dark-muted">{s.label}</dt>
              <dd className="text-2xl font-bold text-accent sm:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ─────────────── Feature grid (icon tiles) ─────────────── */
export type Feature = { icon: IconName; title: string };

export function FeatureGrid({
  id,
  eyebrow,
  title,
  intro,
  items,
  note,
  tone = "ink",
  cols = 4,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  items: Feature[];
  note?: React.ReactNode;
  tone?: "ink" | "ink-2";
  cols?: 3 | 4;
}) {
  return (
    <Section tone={tone} container="wide" aria-labelledby={id} className="cv-auto">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
        <RevealOnScroll className="lg:col-span-7">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={id} className="text-h2 font-bold">
            {title}
          </h2>
        </RevealOnScroll>
        {intro && (
          <RevealOnScroll delay={0.08} className="text-lead text-on-dark lg:col-span-5">
            {intro}
          </RevealOnScroll>
        )}
      </div>
      <RevealGroup as="ul" stagger={0.06} className={cn("mt-12 grid gap-4 sm:grid-cols-2", cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        {items.map((f, i) => (
          <RevealItem as="li" key={f.title} className="h-full">
            <div className="group/feat relative flex h-full flex-col overflow-hidden border border-hairline bg-fg/[0.02] p-6 transition-[border-color,box-shadow,background-color] duration-500 hover:border-gold/50 hover:bg-fg/[0.04] hover:shadow-glow-soft">
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold to-orange transition-transform duration-700 ease-out-expo group-hover/feat:scale-x-100" />
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center border border-gold/40 bg-gold/[0.06] text-accent transition-colors duration-500 group-hover/feat:border-gold group-hover/feat:bg-gold/15">
                  <Icon name={f.icon} />
                </span>
                <span aria-hidden className="text-xs font-bold tracking-[0.2em] text-on-dark-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-6 font-bold leading-snug text-fg">{f.title}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      {note && (
        <RevealOnScroll className="mt-10 max-w-4xl border-l-2 border-gold pl-6 text-lead text-on-dark">
          {note}
        </RevealOnScroll>
      )}
    </Section>
  );
}

/* ─────────────── Photo + checklist split ─────────────── */
export function SplitChecklist({
  id,
  eyebrow,
  title,
  intro,
  listLabel,
  items,
  note,
  image,
  imageAlt,
  caption,
  reverse = false,
  tone = "ink",
  aside,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  listLabel?: string;
  items: string[];
  note?: React.ReactNode;
  image: StaticImageData;
  imageAlt: string;
  caption?: string;
  reverse?: boolean;
  tone?: "ink" | "ink-2";
  /** Extra block under the checklist (e.g. a spec callout). */
  aside?: React.ReactNode;
}) {
  return (
    <Section tone={tone} container="wide" aria-labelledby={id} className="cv-auto">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <RevealOnScroll className={cn("lg:col-span-5", reverse && "lg:order-2")}>
          <figure className="relative aspect-[4/3] overflow-hidden border border-hairline sm:aspect-[16/10] lg:sticky lg:top-28 lg:aspect-[4/5]">
            <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" quality={65} className="object-cover" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((pos) => (
              <span key={pos} aria-hidden className={cn("absolute size-6 border-gold/80", pos)} />
            ))}
            {caption && (
              <figcaption data-scheme="dark" className="absolute inset-x-0 bottom-0 p-6 text-sm font-bold uppercase tracking-[0.14em] text-fg">
                {caption}
              </figcaption>
            )}
          </figure>
        </RevealOnScroll>

        <div className={cn("lg:col-span-7", reverse && "lg:order-1")}>
          <RevealOnScroll>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={id} className="text-h2 font-bold">
              {title}
            </h2>
            {intro && <div className="mt-6 space-y-4 text-lead text-on-dark">{intro}</div>}
          </RevealOnScroll>
          {listLabel && <p className="mt-10 text-sm font-bold uppercase tracking-[0.14em] text-fg">{listLabel}</p>}
          <RevealGroup as="ul" stagger={0.05} className={cn("grid gap-3 sm:grid-cols-2", listLabel ? "mt-5" : "mt-10")}>
            {items.map((it) => (
              <RevealItem as="li" key={it}>
                <div className="flex h-full items-start gap-3 border border-hairline bg-fg/[0.02] p-4 transition-colors duration-300 hover:border-gold/40">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center bg-gold text-ink">
                    <Icon name="check" className="size-4" />
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-fg">{it}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          {aside}
          {note && (
            <RevealOnScroll className="mt-10 border-l-2 border-gold pl-6 text-on-dark [&_strong]:text-fg">
              {note}
            </RevealOnScroll>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────── Numbered process ─────────────── */
export function ProcessSteps({
  id,
  eyebrow,
  title,
  intro,
  steps,
  note,
  spec,
  tone = "ink-2",
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  steps: Array<{ icon: IconName; title: string }>;
  note?: React.ReactNode;
  spec?: Spec;
  tone?: "ink" | "ink-2";
}) {
  return (
    <Section tone={tone} grid container="wide" aria-labelledby={id} className="cv-auto">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
        <RevealOnScroll className="lg:col-span-7">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={id} className="text-h2 font-bold">
            {title}
          </h2>
          {intro && <div className="mt-6 text-lead text-on-dark">{intro}</div>}
        </RevealOnScroll>
        {spec && (
          <RevealOnScroll delay={0.08} className="lg:col-span-5">
            <div data-scheme="dark" className="relative overflow-hidden border border-gold/40 bg-page p-8 shadow-glow-soft">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold to-orange" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-on-dark-muted">{spec.label}</p>
              <p className="mt-2 text-h1 font-bold text-glow">{spec.value}</p>
            </div>
          </RevealOnScroll>
        )}
      </div>

      <RevealGroup as="ol" stagger={0.07} className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <RevealItem as="li" key={s.title} className="h-full">
            <div className="group/step relative flex h-full items-start gap-5 border border-hairline bg-page p-6 transition-[border-color,box-shadow] duration-500 hover:border-gold/50 hover:shadow-glow-soft">
              <span className="flex size-12 shrink-0 items-center justify-center bg-gold text-lg font-bold text-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <Icon name={s.icon} className="size-5 text-accent" />
                <p className="mt-2 font-bold leading-snug text-fg">{s.title}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      {note && (
        <RevealOnScroll className="mt-10 max-w-4xl border-l-2 border-gold pl-6 text-lead text-on-dark">
          {note}
        </RevealOnScroll>
      )}
    </Section>
  );
}

/* ─────────────── Statement lines ─────────────── */
export function Statements({ id, eyebrow, title, lines, body }: { id: string; eyebrow: string; title: React.ReactNode; lines: string[]; body?: React.ReactNode }) {
  return (
    <Section tone="ink" container="wide" aria-labelledby={id} className="cv-auto">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <RevealOnScroll className="lg:col-span-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={id} className="text-h2 font-bold">
            {title}
          </h2>
          {body && <div className="mt-6 space-y-4 text-lead text-on-dark">{body}</div>}
        </RevealOnScroll>
        <RevealGroup as="ol" stagger={0.1} className="divide-y divide-hairline border-y border-hairline lg:col-span-7">
          {lines.map((l, i) => (
            <RevealItem as="li" key={l}>
              <p className="group/line flex items-baseline gap-6 py-7 sm:py-9">
                <span aria-hidden className="text-sm font-bold tracking-[0.2em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-h2 font-bold text-fg transition-colors duration-500 group-hover/line:text-accent">{l}</span>
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ─────────────── Case study (always dark) ─────────────── */
export function CaseStudy({ label, title, stats, children }: { label: string; title: string; stats: Spec[]; children: React.ReactNode }) {
  return (
    <RevealOnScroll className="mt-12">
      <article data-scheme="dark" className="relative isolate overflow-hidden border border-gold/40 bg-page p-8 shadow-glow-soft sm:p-10">
        <GridBackground fade="center" />
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold to-orange" />
        <p className="text-eyebrow font-bold uppercase text-accent">{label}</p>
        <h3 className="mt-3 text-h3 font-bold text-fg">{title}</h3>
        <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-hairline py-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="order-2 mt-1 text-xs uppercase tracking-[0.12em] text-on-dark-muted">{s.label}</dt>
              <dd className="text-h1 font-bold text-glow">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 text-on-dark">{children}</div>
      </article>
    </RevealOnScroll>
  );
}

/* ─────────────── Name chips ─────────────── */
export function NameChips({ label, names }: { label: string; names: string[] }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-fg">{label}</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {names.map((n) => (
          <li key={n} className="flex items-center gap-2 border border-hairline bg-fg/[0.03] px-4 py-2.5 font-bold text-fg">
            <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}
