import Image, { type StaticImageData } from "next/image";
import { Container, Marquee, RevealGroup, RevealItem, StatCounter } from "@/components/ui";
import greenvilleLogo from "@/public/images/site/pc-of-greenvile-gold-ai.svg";
import egsaLogo from "@/public/images/site/egsa-logo.jpg";
import foxLogo from "@/public/images/site/as-seen-on-fox-carolina.jpg";
import poweredToWinLogo from "@/public/images/site/powered-to-win-by-powerchampions.png";

/**
 * Trust bar: only figures that appear on the live site. TODO(client): swap in headline numbers
 * (technicians, generators serviced, states…) when PowerChampions supplies them.
 *  - 10+ years — set by the client (2026-11-16); the Who We Are leadership paragraph still says "more than 200 years"
 *  - 24/7      — backup-power-centers: "24/7/365 emergency response"
 *  - 3         — locations: Greenville, Columbia, Atlanta
 *  - 4         — home: "every individual in our network lives by four values"
 */
const STATS = [
  { value: 10, suffix: "+", label: "Years of combined leadership expertise" },
  { value: 24, suffix: "/7", label: "Emergency response, 365 days a year" },
  { value: 3, label: "Service locations across SC & GA" },
  { value: 4, label: "Core values every team member lives by" },
];

type Brand = { name: string; relation: string } & ({ logo: StaticImageData } | { monogram: string });

/** Network brands and affiliations named on the live site (locations, news, footer). */
const BRANDS: Brand[] = [
  { name: "PowerChampions of Greenville", relation: "Flagship location · Greer, SC", logo: greenvilleLogo },
  { name: "Triple T Critical Power Services", relation: "Market-Partner · Sumter, SC", monogram: "TT" },
  { name: "PowerChampions of Georgia", relation: "Metro Atlanta · Dacula, GA", monogram: "GA" },
  { name: "American Skilled Trades Academy", relation: "Strategic workforce partner", monogram: "ASTA" },
  { name: "EGSA", relation: "Member · Electrical Generating Systems Association", logo: egsaLogo },
  { name: "FOX Carolina", relation: "As seen on", logo: foxLogo },
  { name: "Powered to Win", relation: "The PowerChampions podcast", logo: poweredToWinLogo },
];

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <li className="flex w-[19rem] shrink-0 items-center gap-4 border border-hairline bg-fg/[0.03] p-3 pr-5">
      {"logo" in brand ? (
        <span className="flex size-16 shrink-0 items-center justify-center bg-white p-1.5">
          {/* Decorative: the brand name is written right next to it. */}
          <Image src={brand.logo} alt="" className="max-h-full w-auto object-contain" sizes="64px" loading="eager" />
        </span>
      ) : (
        <span
          aria-hidden
          className="flex size-16 shrink-0 items-center justify-center border border-gold/50 bg-page text-sm font-bold tracking-[0.08em] text-accent"
        >
          {brand.monogram}
        </span>
      )}
      <span className="min-w-0">
        <span className="line-clamp-2 block text-sm font-bold leading-snug text-fg">{brand.name}</span>
        <span className="mt-0.5 block text-xs leading-snug text-on-dark-muted">{brand.relation}</span>
      </span>
    </li>
  );
}

export function TrustBar() {
  return (
    <section id="after-hero" aria-labelledby="trust-title" data-tone="dark" className="relative isolate overflow-hidden bg-surface py-16 sm:py-20">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <Container size="wide">
        <h2 id="trust-title" className="sr-only">
          PowerChampions by the numbers
        </h2>
        <RevealGroup as="ul" className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-0">
          {STATS.map((s, i) => (
            <RevealItem as="li" key={s.label} className={i > 0 ? "lg:border-l lg:border-hairline lg:pl-10" : "lg:pr-10"}>
              <span aria-hidden className="mb-5 block h-0.5 w-10 bg-gradient-to-r from-gold to-orange" />
              <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>

      <div className="mt-14 sm:mt-16">
        <Container size="wide">
          <p className="mb-5 inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-accent">
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-gold to-orange" />
            The PowerChampions network
          </p>
        </Container>
        <Marquee label="PowerChampions network brands and affiliations" duration={55} gap="1rem">
          {BRANDS.map((b) => (
            <BrandCard key={b.name} brand={b} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
