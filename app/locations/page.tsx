import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { CtaBand } from "@/components/home/cta-band";
import { NetworkMap } from "@/components/home/locations";
import { PageHero } from "@/components/page/page-hero";
import { Button, RevealOnScroll, Section, SectionHeading } from "@/components/ui";
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

/** Copy verbatim from content/locations.md. */
const DETAILS: Record<(typeof LOCATIONS)[number]["id"], { image: StaticImageData; alt: string; body: string; site: string }> = {
  gvl: {
    image: greenvilleImg,
    alt: "Downtown Greenville, South Carolina",
    body: "PowerChampions of Greenville is our flagship service location, delivering best-in-class backup generator maintenance, repairs, and 24/7 emergency support. With a highly trained team and commitment to excellence, Greenville sets the standard for reliability and performance in the region.",
    site: "greenville.power-champions.com",
  },
  cola: {
    image: columbiaImg,
    alt: "Aerial view of the South Carolina State House in Columbia",
    body: "PowerChampions Columbia, through Triple T Critical Power Services, delivers disciplined electrical and generator solutions for mission-critical facilities. Backed by advanced diagnostics and expert teams, we ensure reliable power, uptime protection, and long-term performance.",
    site: "tripletpower.com",
  },
  atl: {
    image: atlantaImg,
    alt: "Atlanta, Georgia skyline",
    body: "PowerChampions of Georgia provides commercial and industrial generator sales, installation, maintenance, repair, and 24/7 emergency service across Metro Atlanta — from the Perimeter and Midtown to Marietta, Alpharetta, and the Douglas County data center corridor.",
    site: "atlanta.power-champions.com",
  },
};

const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function LocationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": LOCATIONS.map((l) => ({
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
  };

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        crumbs={[{ label: "Locations", href: "/locations" }]}
        eyebrow="Locations"
        title={
          <>
            Network Of <span className="text-glow">Trusted Brands</span>
          </>
        }
        intro="Our expansion is guided by one mission: to bring reliable, round-the-clock back-up power services closer to every American community. Each new depot strengthens our ability to respond faster, serve better, and uphold the standards that define PowerChampions."
      />

      <Section tone="ink" container="wide" spacing="sm" aria-label="Service locations" className="pt-0 sm:pt-0 lg:pt-0">
        <ul className="space-y-6">
          {LOCATIONS.map((l, i) => {
            const d = DETAILS[l.id];
            const address = `${l.street}, ${l.locality}, ${l.region} ${l.postal}`;
            return (
              <li key={l.id} id={l.id} className="scroll-mt-28">
                <RevealOnScroll>
                  <article
                    aria-labelledby={`${l.id}-title`}
                    className="grid overflow-hidden border border-hairline bg-surface transition-[border-color,box-shadow] duration-500 hover:border-gold/40 hover:shadow-glow-soft md:grid-cols-2"
                  >
                    <div className={`relative aspect-[16/10] md:aspect-auto md:min-h-[22rem] ${i % 2 ? "md:order-2" : ""}`}>
                      <Image src={d.image} alt={d.alt} fill sizes="(min-width: 768px) 50vw, 100vw" quality={65} className="object-cover"
                        // First card is the LCP on phones; the rest stay lazy.
                        {...(i === 0 ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
                      />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                      <span data-scheme="dark" className="absolute left-5 top-5 bg-ink/85 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:p-10">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-on-dark-muted">{l.city}</p>
                      <h2 id={`${l.id}-title`} className="mt-2 text-h2 font-bold text-fg">
                        {l.name}
                      </h2>
                      <p className="mt-4 leading-relaxed text-on-dark">{d.body}</p>
                      <dl className="mt-6 grid gap-4 border-y border-hairline py-5 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Address</dt>
                          <dd className="mt-1 text-fg">{address}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Online</dt>
                          <dd className="mt-1 text-fg">{d.site}</dd>
                        </div>
                      </dl>
                      <div className="mt-6 flex flex-wrap gap-4">
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
      </Section>

      <Section id="locations" tone="ink-2" container="wide" aria-labelledby="nationwide-title" className="cv-auto">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <RevealOnScroll className="lg:col-span-5">
            <SectionHeading
              id="nationwide-title"
              eyebrow="Our footprint"
              title="Powering Communities Nationwide"
              intro="Our expansion is guided by one mission: to bring reliable, round-the-clock power services closer to every American community. Each new depot strengthens our ability to respond faster, serve better, and uphold the standards that define PowerChampions."
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="lg:col-span-7">
            <NetworkMap />
          </RevealOnScroll>
        </div>
      </Section>

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
