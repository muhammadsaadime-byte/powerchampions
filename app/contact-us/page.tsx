import type { Metadata } from "next";
import Link from "next/link";
import { HubSpotForm } from "@/components/embeds/hubspot-form";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui";
import { SOCIAL } from "@/lib/nav";
import { HUBSPOT, LOCATIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with PowerChampions to explore partnerships, growth opportunities, or service solutions. Our team is ready to help.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[{ label: "Contact", href: "/contact-us" }]}
        eyebrow="Contact Us"
        title={
          <>
            Let’s Talk Partnership, <span className="text-glow">Growth, and Opportunity</span>
          </>
        }
      />

      <Section tone="ink" container="wide" spacing="sm" aria-labelledby="contact-form-title" className="pt-0 sm:pt-0 lg:pt-0">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 id="contact-form-title" className="sr-only">
              Contact form
            </h2>
            <HubSpotForm formId={HUBSPOT.forms.contact} title="Contact PowerChampions" />
          </div>

          <aside className="space-y-10 lg:col-span-5" aria-label="Other ways to reach us">
            <div>
              <p className="mb-5 text-eyebrow font-bold uppercase text-gold">Service locations</p>
              <ul className="space-y-3">
                {LOCATIONS.map((l) => (
                  <li key={l.id}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/loc block border border-hairline bg-white/[0.02] p-5 transition-[border-color,box-shadow] hover:border-gold/50 hover:shadow-glow-soft"
                    >
                      <span className="block text-xs font-bold uppercase tracking-[0.16em] text-on-dark-muted">{l.city}</span>
                      <span className="mt-1 block font-bold text-white group-hover/loc:text-gold">{l.name} ↗</span>
                      <span className="mt-1 block text-sm text-on-dark">
                        {l.street}, {l.locality}, {l.region} {l.postal}
                      </span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-on-dark">
                Need generator service? Contact your local team through the location sites above, or{" "}
                <Link href="/locations" className="text-gold underline underline-offset-4">
                  find a location
                </Link>
                .
              </p>
            </div>

            <div>
              <p className="mb-4 text-eyebrow font-bold uppercase text-gold">Selling or partnering?</p>
              <p className="text-on-dark">
                For a confidential conversation about your business, use the{" "}
                <Link href="/partners#inquiry" className="text-gold underline underline-offset-4">
                  market-partner inquiry
                </Link>
                .
              </p>
            </div>

            <div>
              <p className="mb-4 text-eyebrow font-bold uppercase text-gold">Connect with us</p>
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-gold">
                PowerChampions on LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="ink-2" container="narrow" aria-labelledby="newsletter-title">
        <h2 id="newsletter-title" className="mb-6 text-h2 font-bold">
          Subscribe To Newsletter
        </h2>
        <HubSpotForm formId={HUBSPOT.forms.newsletter} title="Newsletter signup" />
      </Section>
    </main>
  );
}
