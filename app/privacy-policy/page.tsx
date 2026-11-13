import type { Metadata } from "next";
import { Markdown } from "@/components/page/markdown";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui";
import { pageCopy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the PowerChampions Privacy Policy to understand how we safeguard your information, maintain transparency, and uphold your privacy rights.",
  alternates: { canonical: "/privacy-policy" },
};

// Legal copy rendered verbatim from content/privacy-policy.md (the H1 is shown in the hero).
const md = pageCopy("privacy-policy").replace(/^# .*$/m, "").trim();

export default function PrivacyPolicyPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ label: "Privacy Policy", href: "/privacy-policy" }]} eyebrow="Legal" title="Privacy Policy" />
      <Section tone="ink" container="narrow" spacing="sm" aria-label="Privacy Policy" className="pt-0 sm:pt-0 lg:pt-0">
        <Markdown md={md} headingOffset={-2} className="text-on-dark" />
      </Section>
    </main>
  );
}
