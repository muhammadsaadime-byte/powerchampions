import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { LongformSections, splitSections } from "@/components/page/longform-sections";
import { PageHero } from "@/components/page/page-hero";
import { Button, Container } from "@/components/ui";
import { pageCopy, paragraphs } from "@/lib/content";
import heroImg from "@/public/images/site/data-center11.webp";

export const metadata: Metadata = {
  title: "Data Center Power Solutions",
  description:
    "PowerChampions provides reliable power solutions, uptime support, procurement, and lifecycle service for critical infrastructure across the Southeast.",
  alternates: { canonical: "/data-center-solutions" },
};

const all = splitSections(pageCopy("data-center-solutions"));
// The live page repeats its title as the first sub-heading; use that block's copy as the intro instead.
const introPart = all.find((p) => p.title.toUpperCase() === "DATA CENTER SOLUTIONS")!;
const introParas = paragraphs(introPart.body.replace(/^#{4,6} .*$/gm, ""));
const closing = all.at(-1)!; // "Let’s Strengthen Your Power Strategy"
const body = all.filter((p) => p !== introPart && p !== closing);

/** Proof points stated on the live page. */
const FACTS = [
  { value: "4.2MW", label: "Generator solutions with full paralleling" },
  { value: "4000A", label: "Paralleling & switchgear configurations" },
  { value: "130 ATS", label: "Units delivered within a 12-week window" },
  { value: "Direct OEM", label: "Factory-level engineering access" },
];

export default function DataCenterSolutionsPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[
          { label: "Generator Services", href: "/data-center-solutions" },
          { label: "Data Center Solutions", href: "/data-center-solutions" },
        ]}
        eyebrow="Generator services"
        title={
          <>
            Data Center <span className="text-glow">Solutions</span>
          </>
        }
        intro={
          <>
            <p className="font-bold text-fg">Powering Critical Infrastructure with Discipline, Speed, and Accountability.</p>
            <p className="mt-4 text-base">{introParas[0]}</p>
          </>
        }
        image={heroImg}
        imageAlt="Rows of server racks inside a data center"
        actions={
          <>
            <Button href="/contact-us" size="lg">
              Partner With Us
            </Button>
            <Button href="/backup-power-centers" variant="outline" size="lg" arrow>
              Backup Power Centers
            </Button>
          </>
        }
      />

      <div className="border-y border-hairline bg-surface">
        <Container size="wide">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {FACTS.map((f, i) => (
              <div key={f.label} className={`py-8 ${i % 2 ? "pl-6" : ""} ${i > 0 ? "lg:border-l lg:border-hairline lg:pl-8" : ""}`}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="text-2xl font-bold text-accent sm:text-3xl">{f.value}</dd>
                <dd className="mt-1 text-xs uppercase tracking-[0.14em] text-on-dark-muted">{f.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>

      <LongformSections
        parts={[{ eyebrow: "Our approach", title: "Eliminate uncertainty. Protect uptime. Build long-term reliability.", body: introParas.slice(1).join("\n\n") }, ...body]}
      />

      <CtaBand
        eyebrow="Mission-critical power"
        title={closing.title}
        text={paragraphs(closing.body).join(" ")}
        primary={{ label: "Partner With Us", href: "/contact-us" }}
        secondary={{ label: "Find a Location", href: "/locations" }}
      />
    </main>
  );
}
