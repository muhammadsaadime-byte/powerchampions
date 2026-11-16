import Image from "next/image";
import { Icon, type IconName } from "@/components/services/blocks";
import { PowerScene } from "@/components/services/power-scene";
import { Button, GridBackground, RevealGroup, RevealItem, RevealOnScroll } from "@/components/ui";
import logo from "@/public/images/site/powerchampions-logo-trim.svg";
import fallbackImg from "@/public/images/site/generator-load-bank-test-greenville-depot.jpg";

/**
 * Homepage generator showcase: the realistic, PowerChampions-branded 3D generator set
 * (components/services/generator-scene.ts) on a framed stage, beside what the maintenance
 * programs cover. Copy is verbatim from content/backup-power-centers.md.
 * Always dark (data-scheme): the scene is lit for a dark stage.
 * Until three.js loads (phones: first touch/scroll) a depot photo stands in.
 */
const PROGRAM: Array<{ icon: IconName; text: string }> = [
  { icon: "gauge", text: "Load bank testing and operational exercising" },
  { icon: "fuel", text: "Fuel system inspection and polishing coordination" },
  { icon: "battery", text: "Battery testing and fluid analysis" },
  { icon: "radar", text: "Remote generator monitoring" },
  { icon: "doc", text: "Compliance documentation and detailed reporting" },
  { icon: "siren", text: "24/7/365 emergency service response" },
];
const SPECS = [
  { value: "10kW–4,500kW", label: "Engineered backup power" },
  { value: "NFPA 110", label: "Aligned maintenance" },
  { value: "All brands", label: "Brand-agnostic service" },
];

export function GeneratorShowcase() {
  return (
    <section aria-labelledby="generator-title" data-scheme="dark" className="cv-auto relative isolate overflow-hidden border-y border-hairline bg-page py-20 sm:py-24 lg:py-28">
      <GridBackground fade="center" glow={false} />
      <div className="mx-auto grid w-full max-w-[1520px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-8">
        {/* Stage */}
        <RevealOnScroll className="lg:col-span-7">
          <div className="relative isolate aspect-[4/3] overflow-hidden border border-hairline bg-[radial-gradient(ellipse_at_50%_62%,rgb(234_166_7/0.13),transparent_62%),linear-gradient(180deg,#151515,#0c0c0c)] sm:aspect-[16/11]">
            <Image
              src={fallbackImg}
              alt=""
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              quality={60}
              className="pc-scene-fallback -z-10 object-cover opacity-45"
            />
            <PowerScene variant="generator" className="absolute inset-0" />
            {/* Brand plate and HUD corners */}
            <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-7 sm:top-7">
              <Image src={logo} alt="PowerChampions" className="h-9 w-auto sm:h-11" />
            </div>
            <p aria-hidden className="absolute right-5 top-6 text-xs font-bold uppercase tracking-[0.2em] text-on-dark-muted sm:right-7 sm:top-8">
              Generator set · 480 V / 60 Hz
            </p>
            {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((pos) => (
              <span key={pos} aria-hidden className={`absolute size-6 border-gold/70 ${pos}`} />
            ))}
            <dl className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-px border-t border-hairline bg-hairline">
              {SPECS.map((s) => (
                <div key={s.label} className="flex flex-col bg-page/85 px-3 py-3 backdrop-blur-md sm:px-5 sm:py-4">
                  <dt className="order-2 mt-1 text-[0.625rem] font-medium uppercase leading-snug tracking-[0.12em] text-on-dark-muted sm:text-xs">{s.label}</dt>
                  <dd className="text-sm font-bold text-accent sm:text-xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </RevealOnScroll>

        {/* Copy */}
        <div className="lg:col-span-5">
          <RevealOnScroll>
            <p className="mb-5 inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-accent">
              <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
              Proactive service
            </p>
            <h2 id="generator-title" className="text-h2 font-bold text-fg">
              Maintenance That <span className="text-glow">Protects Uptime</span>
            </h2>
            <p className="mt-6 text-lead text-on-dark">
              Reliable standby power requires disciplined maintenance aligned with NFPA 110 standards and manufacturer specifications.
            </p>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-fg">Our industrial generator maintenance programs include:</p>
          </RevealOnScroll>
          <RevealGroup as="ul" stagger={0.05} className="mt-5 grid gap-3 sm:grid-cols-2">
            {PROGRAM.map((p) => (
              <RevealItem as="li" key={p.text}>
                <div className="flex h-full items-start gap-3 border border-hairline bg-fg/[0.03] p-4 transition-colors duration-300 hover:border-gold/40">
                  <span className="flex size-9 shrink-0 items-center justify-center border border-gold/40 bg-gold/[0.06] text-accent">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-fg">{p.text}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <RevealOnScroll className="mt-8 border-l-2 border-gold pl-5 text-on-dark">
            <p>
              <strong className="text-fg">Our objective is simple:</strong> prevent failures before they occur and ensure your generator performs when needed
              most.
            </p>
          </RevealOnScroll>
          <RevealOnScroll className="mt-8 flex flex-wrap gap-4">
            <Button href="/backup-power-centers" size="lg">
              Explore Backup Power Centers
            </Button>
            <Button href="/contact-us" variant="outline" size="lg" arrow>
              Get A Quote Today
            </Button>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
