import type { Metadata } from "next";
import { Markdown } from "@/components/page/markdown";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui";
import { pageCopy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions that govern your use of the PowerChampions website, including intellectual property, prohibited uses, and limitations of liability.",
  alternates: { canonical: "/terms-conditions" },
};

// Legal copy rendered verbatim from content/terms-conditions.md (the H1 is shown in the hero).
const md = pageCopy("terms-conditions").replace(/^# .*$/m, "").trim();

export default function TermsPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ label: "Terms & Conditions", href: "/terms-conditions" }]} eyebrow="Legal" title="Terms & Conditions" />
      <Section tone="ink" container="narrow" spacing="sm" aria-label="Terms & Conditions" className="pt-0 sm:pt-0 lg:pt-0">
        <Markdown md={md} headingOffset={-2} className="text-on-dark" />
      </Section>
    </main>
  );
}
