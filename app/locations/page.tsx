import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/home/cta-band";
import { NetworkMap } from "@/components/home/locations";
import { Icon, Statements, type IconName } from "@/components/services/blocks";
import { Button, Container, EnergyLines, GridBackground, RevealGroup, RevealItem, RevealOnScroll, Section } from "@/components/ui";
import { LOCATIONS, SITE_URL } from "@/lib/site";
import greenvilleImg from "@/public/images/site/greeville-south-carolina.webp";
import columbiaImg from "@/public/images/site/triple-t-electric-1.webp";
import atlantaImg from "@/public/images/site/atlanta-ga2.png";

export const metadata: Metadata = {
  title: "Locations Directory",
  description:
    "PowerChampions delivers reliable 24/7 backup power through a growing national network, starting with our flagship Greenville, SC location.",
  alternates: { canonical: "/locations" },
};

type Detail = {
  image: StaticImageData;
  alt: string;
  /** Short tag shown on the card. */
  tag: string;
  /** Verbatim from content/locations.md. */
  body: string;
  /** Services named in that paragraph, as chips. */
  services: string[];
  /** Areas named in that paragraph (Atlanta only). */
  areas?: string[];
  site: string;
};

const DETAILS: Record<(typeof LOCATIONS)[number]["id"], Detail> = {
  gvl: {
    image: greenvilleImg,
    alt: "Downtown Greenville, South Carolina",
    tag: "Flagship location",
    body: "PowerChampions of Greenville is our flagship service location, delivering best-in-class backup generator maintenance, repairs, and 24/7 emergency support. With a highly trained team and commitment to excellence, Greenville sets the standard for reliability and performance in the region.",
    services: ["Backup generator maintenance", "Repairs", "24/7 emergency support"],
    site: "greenville.power-champions.com",
  },
  cola: {
    image: columbiaImg,
    alt: "Aerial view of the South Carolina State House in Columbia",
    tag: "Market-Partner",
    body: "PowerChampions Columbia, through Triple T Critical Power Services, delivers disciplined electrical and generator solutions for mission-critical facilities. Backed by advanced diagnostics and expert teams, we ensure reliable power, uptime protection, and long-term performance.",
    services: ["Electrical solutions", "Generator solutions", "Advanced diagnostics", "Uptime protection"],
    site: "tripletpower.com",
  },
  atl: {
    image: atlantaImg,
    alt: "Atlanta, Georgia skyline",
    tag: "Metro Atlanta",
    body: "PowerChampions of Georgia provides commercial and industrial generator sales, installation, maintenance, repair, and 24/7 emergency service across Metro Atlanta — from the Perimeter and Midtown to Marietta, Alpharetta, and the Douglas County data center corridor.",
    services: ["Generator sales", "Installation", "Maintenance", "Repair", "24/7 emergency service"],
    areas: ["Perimeter", "Midtown", "Marietta", "Alpharetta", "Douglas County data center corridor"],
    site: "atlanta.power-champions.com",
  },
};

const FACTS: Array<{ icon: IconName; value: string; label: string }> = [
  { icon: "pin", value: "3", label: "Service locations" },
  { icon: "layers", value: "2", label: "States: South Carolina & Georgia" },
  { icon: "siren", value: "24/7", label: "Emergency support" },
];

const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const prettyPhone = (p: string) => p.replace("+1-", "").replace(/-/g, ".");

export default function LocationsPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: SITE_URL + c.href })),
      },
      ...LOCATIONS.map((l) => ({
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/locations#${l.id}`,
        name: l.name,
        url: l.url,
        ...("phone" in l ? { telephone: l.phone } : {}),
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        address: { "@type": "PostalAddress", streetAddress: l.street, addressLocality: l.locality, addressRegion: l.region, postalCode: l.postal, addressCountry: "US" },
        geo: { "@type": "GeoCoordinates", latitude: l.lat, longitude: l.lon },
        areaServed: l.city,
      })),
    ],
  };

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero: copy + the live network map. id="locations" lets the quick links light up their map beacon. */}
      <section id="locations" data-scheme="dark" className="relative isolate overflow-hidden bg-page pt-[calc(var(--pc-header-h)+3rem)] lg:pt-[calc(var(--pc-header-h)+4rem)]">
        <GridBackground fade="center" glow={false} />
        <div
          aria-hidden
          className="absolute right-[-10%] top-[10%] -z-20 size-[90vmin] rounded-full bg-[radial-gradient(closest-side,rgb(234_166_7/0.13),rgb(245_117_0/0.04)_55%,transparent)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70svh] opacity-60">
          <EnergyLines intensity={0.6} />
        </div>

        <Container size="wide">
          <nav aria-label="Breadcrumb" className="mb-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-on-dark-muted">
              <li>
                <Link href="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="text-accent">/</span>
                <span aria-current="page" className="text-fg">
                  Locations
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-5">
              <p className="mb-5 inline-flex animate-fade-up items-center gap-3 text-eyebrow font-bold uppercase text-accent" style={{ animationDelay: "0.1s" }}>
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
                Locations
              </p>
              <h1 className="animate-fade-up text-h1 font-bold text-fg" style={{ animationDelay: "0.15s" }}>
                Network Of <span className="text-glow">Trusted Brands</span>
              </h1>
              <p className="mt-6 animate-fade-up text-lead text-on-dark" style={{ animationDelay: "0.3s" }}>
                Our expansion is guided by one mission: to bring reliable, round-the-clock back-up power services closer to every American community. Each new
                depot strengthens our ability to respond faster, serve better, and uphold the standards that define PowerChampions.
              </p>
              <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-4" style={{ animationDelay: "0.45s" }}>
                <Button href="#directory" size="lg">
                  Find Your Location
                </Button>
                <Button href="/partners" variant="outline" size="lg" arrow>
                  Become a Market Partner
                </Button>
              </div>
            </div>
            <div className="animate-fade-up lg:col-span-7" style={{ animationDelay: "0.3s" }}>
              <NetworkMap />
            </div>
          </div>

          {/* Quick links: one per location; hover or focus highlights its beacon on the map. */}
          <ul className="mt-10 grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-3 lg:mt-6">
            {LOCATIONS.map((l, i) => (
              <li key={l.id} className="animate-fade-up" style={{ animationDelay: `${0.55 + i * 0.07}s` }}>
                <a
                  href={`#${l.id}`}
                  data-loc={l.id}
                  className="group/jump flex h-full items-start gap-4 bg-page/85 p-5 backdrop-blur-md transition-colors duration-300 hover:bg-fg/[0.06] sm:p-6"
                >
                  <span className="mt-0.5 text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-on-dark-muted">{l.city}</span>
                    <span className="mt-1 block font-bold text-fg group-hover/jump:text-accent">{l.name}</span>
                    <span className="mt-1 block text-sm text-on-dark">
                      {l.locality}, {l.region} · {DETAILS[l.id].tag}
                    </span>
                  </span>
                  <span aria-hidden className="mt-1 text-accent transition-transform duration-300 group-hover/jump:translate-y-1">
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
        <div aria-hidden className="h-12 sm:h-16" />
      </section>

      {/* Directory */}
      <Section id="directory" tone="ink-2" container="wide" aria-labelledby="directory-title" className="scroll-mt-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <RevealOnScroll className="lg:col-span-6">
            <p className="mb-5 inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-accent">
              <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
              Location directory
            </p>
            <h2 id="directory-title" className="text-h2 font-bold">
              Local teams, backed by a national network
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08} className="lg:col-span-6">
            <dl className="grid grid-cols-3 gap-px overflow-hidden border border-hairline bg-hairline">
              {FACTS.map((f) => (
                <div key={f.label} className="flex flex-col bg-page p-4 sm:p-5">
                  <dt className="order-3 mt-1 text-[0.6875rem] font-medium uppercase leading-snug tracking-[0.12em] text-on-dark-muted">{f.label}</dt>
                  <Icon name={f.icon} className="order-1 size-5 text-accent" />
                  <dd className="order-2 mt-3 text-2xl font-bold text-fg sm:text-3xl">{f.value}</dd>
                </div>
              ))}
            </dl>
          </RevealOnScroll>
        </div>

        <ul className="mt-12 space-y-8">
          {LOCATIONS.map((l, i) => {
            const d = DETAILS[l.id];
            const address = `${l.street}, ${l.locality}, ${l.region} ${l.postal}`;
            const phone = "phone" in l ? l.phone : null;
            return (
              <li key={l.id} id={l.id} className="scroll-mt-28">
                <RevealOnScroll>
                  <article
                    aria-labelledby={`${l.id}-title`}
                    className="group/card grid overflow-hidden border border-hairline bg-page transition-[border-color,box-shadow] duration-500 hover:border-gold/40 hover:shadow-glow-soft lg:grid-cols-12"
                  >
                    <div data-scheme="dark" className={`relative aspect-[16/10] overflow-hidden lg:col-span-5 lg:aspect-auto lg:min-h-[30rem] ${i % 2 ? "lg:order-2" : ""}`}>
                      <Image
                        src={d.image}
                        alt={d.alt}
                        fill
                        sizes="(min-width: 1024px) 42vw, 100vw"
                        quality={65}
                        className="object-cover transition-transform duration-1000 ease-out-expo group-hover/card:scale-105"
                      />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                      <span className="absolute left-5 top-5 bg-ink/85 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-accent">
                        0{i + 1} / 0{LOCATIONS.length}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                          <Icon name="pin" className="size-4" />
                          {d.tag}
                        </p>
                        <p className="mt-2 text-h3 font-bold text-fg">{l.city}</p>
                      </div>
                    </div>

                    <div className="flex flex-col p-6 sm:p-10 lg:col-span-7">
                      <h3 id={`${l.id}-title`} className="text-h2 font-bold text-fg">
                        {l.name}
                      </h3>
                      <p className="mt-4 leading-relaxed text-on-dark">{d.body}</p>

                      <div className="mt-6">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-fg">Services</p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {d.services.map((s) => (
                            <li key={s} className="flex items-center gap-2 border border-hairline bg-fg/[0.03] px-3 py-1.5 text-sm text-fg">
                              <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {d.areas && (
                        <div className="mt-5">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-fg">Areas served</p>
                          <p className="mt-2 text-sm text-on-dark">{d.areas.join(" · ")}</p>
                        </div>
                      )}

                      <dl className="mt-7 grid gap-px overflow-hidden border border-hairline bg-hairline text-sm sm:grid-cols-3">
                        <div className="bg-page p-4">
                          <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                            <Icon name="pin" className="size-4" /> Address
                          </dt>
                          <dd className="mt-2 text-fg">
                            {l.street}
                            <br />
                            {l.locality}, {l.region} {l.postal}
                          </dd>
                        </div>
                        <div className="bg-page p-4">
                          <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                            <Icon name="siren" className="size-4" /> {phone ? "Phone" : "Contact"}
                          </dt>
                          <dd className="mt-2 text-fg">
                            {phone ? (
                              <a href={`tel:${phone}`} className="-my-3 inline-block py-3 font-bold underline-offset-4 hover:text-accent hover:underline">
                                {prettyPhone(phone)}
                              </a>
                            ) : (
                              <a href={l.url} target="_blank" rel="noopener noreferrer" className="-my-3 inline-block py-3 underline-offset-4 hover:text-accent hover:underline">
                                Via the location website ↗<span className="sr-only"> (opens in a new tab)</span>
                              </a>
                            )}
                          </dd>
                        </div>
                        <div className="bg-page p-4">
                          <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                            <Icon name="server" className="size-4" /> Online
                          </dt>
                          <dd className="mt-2 break-words text-fg">{d.site}</dd>
                        </div>
                      </dl>

                      <div className="mt-auto flex flex-wrap gap-4 pt-7">
                        <Button href={l.url} size="md" arrow>
                          Visit Online
                        </Button>
                        <Button href={mapsUrl(address)} variant="outline" size="md" arrow>
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              </li>
            );
          })}
        </ul>

        {/* Not near a depot yet */}
        <RevealGroup as="ul" stagger={0.08} className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { icon: "bolt" as const, title: "Need generator service?", text: "Contact your nearest location above, or send us a message and we’ll route you to the right team.", cta: "Contact us", href: "/contact-us" },
            { icon: "handshake" as const, title: "Own a generator service business?", text: "Explore what joining the PowerChampions network as a Market Partner looks like.", cta: "Why partner with us", href: "/partners" },
          ].map((c) => (
            <RevealItem as="li" key={c.href} className="h-full">
              <Link
                href={c.href}
                className="group/help flex h-full items-start gap-5 border border-hairline bg-page p-6 transition-[border-color,box-shadow] duration-500 hover:border-gold/50 hover:shadow-glow-soft"
              >
                <span className="flex size-12 shrink-0 items-center justify-center border border-gold/40 bg-gold/[0.06] text-accent">
                  <Icon name={c.icon} />
                </span>
                <span>
                  <span className="block font-bold text-fg">{c.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-on-dark">{c.text}</span>
                  <span className="mt-3 block text-sm font-bold uppercase tracking-[0.12em] text-accent">
                    {c.cta} <span className="inline-block transition-transform duration-300 group-hover/help:translate-x-1">→</span>
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Statements
        id="nationwide-title"
        eyebrow="Our footprint"
        title="Powering Communities Nationwide"
        body={
          <p>
            Our expansion is guided by one mission: to bring reliable, round-the-clock power services closer to every American community. Each new depot
            strengthens our ability to:
          </p>
        }
        lines={["Respond faster.", "Serve better.", "Uphold the standards that define PowerChampions."]}
      />

      <CtaBand
        eyebrow="Grow with us"
        title="Find out more about becoming a PowerChampions Market Partner"
        text=""
        primary={{ label: "Partner Now", href: "/contact-us" }}
        secondary={{ label: "Why Partner With Us", href: "/partners" }}
      />
    </main>
  );
}
