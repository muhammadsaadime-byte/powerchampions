import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { LongformSections, splitSections } from "@/components/page/longform-sections";
import { PageHero } from "@/components/page/page-hero";
import { Button, Container } from "@/components/ui";
import { pageCopy, paragraphs } from "@/lib/content";
import heroImg from "@/public/images/site/generator-load-bank-test-greenville-depot.jpg";

export const metadata: Metadata = {
  title: "Backup Power Centers",
  description:
    "Comprehensive critical power services across the Southeast — generator maintenance, turnkey installation, rentals, compliance, and 24/7 emergency response.",
  alternates: { canonical: "/backup-power-centers" },
};

const parts = splitSections(pageCopy("backup-power-centers"));
const closing = parts.at(-1)!; // "Keep Your Business Powered. No Matter What."
const body = parts.slice(0, -1);

/** Proof points stated on the live page. */
const FACTS = [
  { value: "24/7/365", label: "Emergency service response" },
  { value: "NFPA 110", label: "Aligned maintenance programs" },
  { value: "10kW–4,500kW", label: "Engineered backup power systems" },
  { value: "All brands", label: "Brand-agnostic generator expertise" },
];

export default function BackupPowerCentersPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[
          { label: "Generator Services", href: "/backup-power-centers" },
          { label: "Backup Power Centers", href: "/backup-power-centers" },
        ]}
        eyebrow="Generator services"
        title={
          <>
            Backup Power <span className="text-glow">Centers</span>
          </>
        }
        intro="Critical Power Services in the Southeastern United States."
        image={heroImg}
        imageAlt="Load bank testing a mobile generator at the PowerChampions Greenville depot"
        actions={
          <>
            <Button href="/contact-us" size="lg">
              Get A Quote Today
            </Button>
            <Button href="/locations" variant="outline" size="lg" arrow>
              Find a Location
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

      <LongformSections parts={body} />

      <CtaBand
        eyebrow="Get a quote"
        title={closing.title}
        text={paragraphs(closing.body)[0]}
        primary={{ label: "Get a Quote Today", href: "/contact-us" }}
        secondary={{ label: "Data Center Solutions", href: "/data-center-solutions" }}
      />
    </main>
  );
}
