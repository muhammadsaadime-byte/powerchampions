import { Button, RevealGroup, RevealItem, RevealOnScroll, Section, SectionHeading } from "@/components/ui";
import { AnimateWhenVisible } from "@/components/ui/animate-when-visible";
import { MAP_H, MAP_W, UsDotMap, project } from "./us-dot-map";

/** Live locations page (content/locations.md). Coordinates are the street addresses below. */
const LOCATIONS = [
  {
    id: "gvl",
    city: "Greenville, South Carolina",
    name: "PowerChampions of Greenville",
    note: "Flagship service location",
    address: "175 Brookshire Rd, Greer, SC 29651",
    href: "https://www.greenville.power-champions.com/",
    site: "greenville.power-champions.com",
    lat: 34.94,
    lon: -82.23,
  },
  {
    id: "cola",
    city: "Columbia, South Carolina",
    name: "Triple T Critical Power Services",
    note: "Market-Partner",
    address: "1530 Airport Road, Sumter, SC 29153",
    href: "https://tripletpower.com/",
    site: "tripletpower.com",
    lat: 33.92,
    lon: -80.34,
  },
  {
    id: "atl",
    city: "Atlanta, Georgia",
    name: "PowerChampions of Georgia",
    note: "Metro Atlanta & Douglas County data center corridor",
    address: "3043 Braselton Hwy, Dacula, GA 30019",
    href: "https://atlanta.power-champions.com/",
    site: "atlanta.power-champions.com",
    lat: 34.0,
    lon: -83.9,
  },
] as const;

/** Map coordinates → % of the map box (the SVG viewBox has a 1-unit margin on every side). */
const pos = (lat: number, lon: number) => {
  const { x, y } = project(lat, lon);
  return { left: `${((x + 1) / (MAP_W + 2)) * 100}%`, top: `${((y + 1) / (MAP_H + 2)) * 100}%` };
};

export function Locations() {

  return (
    <Section id="locations" tone="ink-2" aria-labelledby="locations-title" container="wide" className="cv-auto">
      <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-5">
          <RevealOnScroll>
            <SectionHeading
              id="locations-title"
              eyebrow="Locations"
              title={
                <>
                  Network Of <span className="text-glow">Trusted Brands</span>
                </>
              }
              intro="Our expansion is guided by one mission: to bring reliable, round-the-clock back-up power services closer to every American community. Each new depot strengthens our ability to respond faster, serve better, and uphold the standards that define PowerChampions."
            />
          </RevealOnScroll>

          <RevealGroup as="ul" className="mt-10 space-y-3" stagger={0.1}>
            {LOCATIONS.map((l, i) => (
              <RevealItem as="li" key={l.id}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-loc={l.id}
                  className="group/loc flex items-start gap-4 border border-hairline bg-fg/[0.02] p-5 transition-[border-color,background-color,box-shadow] duration-500 hover:border-gold/50 hover:bg-fg/[0.04] hover:shadow-glow-soft focus-visible:border-gold"
                >
                  <span className="mt-0.5 text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-on-dark-muted">{l.city}</span>
                    <span className="mt-1 block font-bold text-fg group-hover/loc:text-accent">{l.name}</span>
                    <span className="mt-1 block text-sm text-on-dark">{l.address}</span>
                    <span className="mt-2 block text-xs text-on-dark-muted">
                      {l.note} · {l.site} ↗
                    </span>
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealOnScroll delay={0.2} className="mt-10">
            <Button href="/locations" size="lg">
              Find a Location
            </Button>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.1} className="lg:col-span-7">
          <NetworkMap />
        </RevealOnScroll>
      </div>
    </Section>
  );
}

/** The dot-matrix US map with the three depots (also used on /locations). */
export function NetworkMap() {
  const pts = LOCATIONS.map((l) => project(l.lat, l.lon));
  return (
    <figure className="relative">
      <AnimateWhenVisible className="relative aspect-[49.2/28]">
        <UsDotMap />

        {/* Gold links between the three depots */}
        <svg aria-hidden viewBox={`-1 -1 ${MAP_W + 2} ${MAP_H + 2}`} className="absolute inset-0 h-full w-full">
          <polyline
            points={[pts[2], pts[0], pts[1], pts[2]].map((p) => `${p.x},${p.y}`).join(" ")}
            fill="rgb(234 166 7 / 0.06)"
            stroke="#EAA607"
            strokeWidth="0.12"
            strokeDasharray="0.4 0.3"
          />
        </svg>

        {/* Markers: HTML so the pulse stays on the compositor. */}
        {LOCATIONS.map((l) => (
          <span
            key={l.id}
            data-marker={l.id}
            className="pc-marker absolute flex size-0 items-center justify-center"
            style={pos(l.lat, l.lon)}
          >
            <span aria-hidden className="decor-anim absolute size-3 animate-pulse-dot rounded-full bg-gold/70" />
            <span aria-hidden className="pc-marker-dot absolute size-3 rounded-full border-2 border-ink bg-gold shadow-[0_0_14px_3px_rgb(234_166_7/0.7)] transition-transform duration-300" />
          </span>
        ))}

        {/* HUD readout */}
        <div aria-hidden data-scheme="dark" className="absolute bottom-0 left-0 hidden border-l-2 border-gold bg-ink/90 px-4 py-3 sm:block">
          <p className="text-eyebrow font-bold uppercase text-accent">Southeast network</p>
          <p className="mt-1.5 text-xs text-on-dark">3 service locations · 24/7 coverage</p>
        </div>
      </AnimateWhenVisible>
      <figcaption className="sr-only">
        Map of the United States marking PowerChampions locations in Greer, SC; Sumter, SC; and Dacula, GA.
      </figcaption>
    </figure>
  );
}
