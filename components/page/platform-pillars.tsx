import Image from "next/image";
import { inline } from "@/components/page/markdown";
import { RevealGroup, RevealItem, RevealOnScroll, Section, SectionHeading } from "@/components/ui";
import photo from "@/public/images/site/platform-technician-asta-workshop.jpg";

type Pillar = { label: string; text: string };

/** Line icons per pillar, matched by title keyword so the copy (from content/who-we-are.md) stays the source. */
const ICONS: Array<[RegExp, React.ReactNode]> = [
  [
    /operational/i,
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5" />
    </>,
  ],
  [/financial/i, <path key="f" d="M3 20h18M5 16.5l4.5-4.5 3.5 3 6-7M14.5 8H19v4.5" />],
  [
    /talent|training/i,
    <>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z" />
      <path d="M6.5 11v4.5c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3V11M21.5 9v5" />
    </>,
  ],
  [
    /technology|insight/i,
    <>
      <rect x="6.5" y="6.5" width="11" height="11" />
      <path d="M9.5 10h5v4h-5zM9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </>,
  ],
];

/** "…across all functions—recruiting, field operations, …—so our teams…" → the listed functions, shown as tags. */
function functionsIn(text: string) {
  const m = text.match(/functions\s*[—-]\s*([^—]+)[—-]/i);
  if (!m) return null;
  return m[1]
    .split(/,\s*(?:and\s+)?|\s+and\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function PlatformPillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <Section tone="ink-2" container="wide" aria-labelledby="growth-title" className="cv-auto">
      <RevealOnScroll>
        <SectionHeading id="growth-title" eyebrow="The platform" title="How We Support Growth Across the Platform" />
      </RevealOnScroll>

      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        {/* Photo stretches to the height of the card grid beside it (lg), so neither column leaves a gap. */}
        <RevealOnScroll className="lg:col-span-5">
          <figure className="relative aspect-[4/3] h-full overflow-hidden border border-hairline sm:aspect-[16/10] lg:aspect-auto lg:min-h-[32rem]">
            <Image
              src={photo}
              alt="A PowerChampions technician services a generator engine during hands-on training at the American Trades Academy workshop"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              quality={65}
              className="object-cover object-[30%_center]"
            />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            {/* HUD corners, as on the homepage video */}
            {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t"].map((pos) => (
              <span key={pos} aria-hidden className={`absolute size-6 border-gold/80 ${pos}`} />
            ))}
            <figcaption data-scheme="dark" className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="block text-eyebrow font-bold uppercase text-accent">People first</span>
              <span className="mt-2 block max-w-xs text-xl font-bold text-fg">Hands-on training at the American Trades Academy</span>
            </figcaption>
          </figure>
        </RevealOnScroll>

        {/* Right: the four pillars */}
        <RevealGroup as="ol" stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
          {pillars.map((p, i) => {
            const icon = ICONS.find(([re]) => re.test(p.label))?.[1];
            const tags = functionsIn(p.text);
            return (
              <RevealItem as="li" key={p.label} className="h-full">
                <article
                  aria-labelledby={`pillar-${i}`}
                  className="group/pillar relative isolate flex h-full flex-col overflow-hidden border border-hairline bg-page p-7 transition-[border-color,box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-gold/50 hover:shadow-glow-soft sm:p-8"
                >
                  {/* Gold rule grows across the top on hover */}
                  <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-[0.18] bg-gradient-to-r from-gold to-orange transition-transform duration-700 ease-out-expo group-hover/pillar:scale-x-100" />

                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center border border-gold/40 bg-gold/[0.06] text-accent transition-colors duration-500 group-hover/pillar:border-gold group-hover/pillar:bg-gold/15">
                      {icon && (
                        <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          {icon}
                        </svg>
                      )}
                    </span>
                    <span aria-hidden className="text-xs font-bold tracking-[0.2em] text-on-dark-muted">
                      0{i + 1} / 0{pillars.length}
                    </span>
                  </div>

                  <h3 id={`pillar-${i}`} className="mt-7 text-h3 font-bold">
                    {p.label}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-on-dark">{inline(p.text)}</p>

                  {tags && (
                    <ul aria-label="Functions we support" className="mt-6 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <li key={t} className="border border-hairline px-2.5 py-1 text-xs font-medium capitalize text-on-dark">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}
