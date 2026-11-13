import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { RevealOnScroll, Section, SectionHeading } from "@/components/ui";
import loadBank from "@/public/images/site/generator-load-bank-test-greenville-depot.jpg";
import dataCenter from "@/public/images/site/data-center11.webp";

/** Copy from content/backup-power-centers.md and content/data-center-solutions.md (live pages). */
const SERVICES: Array<{
  href: string;
  title: string;
  tagline: string;
  image: StaticImageData;
  imageAlt: string;
  imageClass?: string;
  facts: Array<{ value: string; label: string }>;
  capabilities: string[];
}> = [
  {
    href: "/backup-power-centers",
    title: "Backup Power Centers",
    tagline: "Critical power services in the Southeastern United States.",
    image: loadBank,
    imageAlt: "Load bank testing a mobile generator at the PowerChampions Greenville depot",
    facts: [
      { value: "24/7/365", label: "Emergency service response" },
      { value: "NFPA 110", label: "Aligned maintenance programs" },
      { value: "All brands", label: "Brand-agnostic generator expertise" },
    ],
    capabilities: [
      "Industrial generator service and repair",
      "Commercial generator maintenance programs",
      "Healthcare backup power compliance",
      "Emergency generator response",
      "Turnkey generator installation",
      "Portable generator rentals",
    ],
  },
  {
    href: "/data-center-solutions",
    title: "Data Center Solutions",
    tagline: "Powering critical infrastructure with discipline, speed, and accountability.",
    image: dataCenter,
    imageAlt: "Rows of server racks inside a data center",
    imageClass: "saturate-[0.35] hue-rotate-[160deg]",
    facts: [
      { value: "4.2MW", label: "Generator solutions with full paralleling" },
      { value: "4000A", label: "Paralleling & switchgear configurations" },
      { value: "130 ATS", label: "Units delivered within a 12-week window" },
    ],
    capabilities: [
      "Engineering & planning support",
      "Strategic equipment procurement",
      "Installation & commissioning",
      "Lifecycle service & compliance",
    ],
  },
];

export function Services() {
  return (
    <Section id="services" tone="ink" grid aria-labelledby="services-title" container="wide" className="cv-auto">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <RevealOnScroll className="lg:col-span-7">
          <SectionHeading
            id="services-title"
            eyebrow="Generator services"
            title={
              <>
                Backup Power Solutions That <span className="text-glow">Protect Uptime</span>
              </>
            }
            className="max-w-none"
          />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="lg:col-span-5">
          <p className="text-lead text-on-dark lg:border-l lg:border-hairline lg:pl-8">
            From new system engineering to structured preventative maintenance and rapid emergency response, we help facilities across the Southeast
            reduce operational risk and protect long-term system performance.
          </p>
        </RevealOnScroll>
      </div>

      {/* Desktop: the hovered/focused panel widens (flex-grow), the other narrows. Phones: stacked. */}
      <RevealOnScroll delay={0.15} className="mt-14 flex flex-col gap-5 lg:mt-20 lg:h-[40rem] lg:flex-row">
        {SERVICES.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            className="group/svc relative isolate flex min-h-[34rem] flex-col justify-end overflow-hidden border border-hairline p-6 transition-[flex-grow,border-color,box-shadow] duration-700 ease-out-expo hover:border-gold/50 hover:shadow-glow-soft focus-visible:border-gold sm:p-10 lg:min-h-0 lg:flex-1 lg:hover:flex-[1.55] lg:focus-visible:flex-[1.55]"
          >
            <Image
              src={s.image}
              alt={s.imageAlt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              quality={60}
              className={`-z-20 object-cover opacity-60 transition-[transform,opacity] duration-1000 ease-out-expo group-hover/svc:scale-105 group-hover/svc:opacity-75 ${s.imageClass ?? ""}`}
            />
            <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_16_16/0.35)_0%,rgb(16_16_16/0.75)_45%,#101010_100%)]" />

            <span aria-hidden className="absolute left-6 top-6 text-xs font-bold tracking-[0.2em] text-gold sm:left-10 sm:top-10">
              0{i + 1} / 0{SERVICES.length}
            </span>
            <span
              aria-hidden
              className="absolute right-6 top-6 flex size-12 items-center justify-center border border-gold/60 text-gold transition-colors duration-500 group-hover/svc:bg-gold group-hover/svc:text-ink sm:right-10 sm:top-10"
            >
              <svg viewBox="0 0 16 16" className="size-4 -rotate-45 transition-transform duration-500 group-hover/svc:rotate-0">
                <path d="M1 8h12M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
              </svg>
            </span>

            <h3 className="text-h2 font-bold text-white">{s.title}</h3>
            <p className="mt-3 max-w-xl text-lead text-on-dark">{s.tagline}</p>

            <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-4 border-y border-hairline py-5">
              {s.facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="text-lg font-bold text-gold sm:text-2xl">{f.value}</dd>
                  <dd className="mt-1 text-[0.7rem] leading-snug text-on-dark-muted sm:text-xs">{f.label}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 flex max-w-2xl flex-wrap gap-2">
              {s.capabilities.map((c) => (
                <li key={c} className="border border-hairline bg-ink/85 px-3 py-1.5 text-xs font-medium text-white">
                  {c}
                </li>
              ))}
            </ul>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-white group-hover/svc:text-gold">
              Explore {s.title} →
            </span>
          </Link>
        ))}
      </RevealOnScroll>
    </Section>
  );
}
