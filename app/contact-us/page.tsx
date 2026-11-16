import type { Metadata } from "next";
import Link from "next/link";
import { HubSpotForm } from "@/components/embeds/hubspot-form";
import { PageHero } from "@/components/page/page-hero";
import { Container, RevealGroup, RevealItem, Section } from "@/components/ui";
import { SOCIAL } from "@/lib/nav";
import { HUBSPOT, LOCATIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with PowerChampions to explore partnerships, growth opportunities, or service solutions. Our team is ready to help.",
  alternates: { canonical: "/contact-us" },
};

/** Quick routes: most visitors know which team they need, so point them there before the general form. */
const ROUTES = [
  {
    eyebrow: "Need generator service?",
    title: "Contact your local team",
    href: "/locations",
    cta: "Find a location",
    icon: (
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    ),
  },
  {
    eyebrow: "Selling or partnering?",
    title: "Start a confidential conversation",
    href: "/partners#inquiry",
    cta: "Market-partner inquiry",
    icon: <path d="M3 12.5 7.5 8l3 3 2-2 3 3 3.5-3.5M3 19h18M3 5h18" />,
  },
  {
    eyebrow: "Looking for a career?",
    title: "Join the PowerChampions team",
    href: "/careers#open-roles",
    cta: "View open roles",
    icon: <path d="M4 8h16v11H4zM9 8V5h6v3M4 13h16" />,
  },
];

const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

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
        intro="Tell us where you are headed. Pick the route that fits, or send a message and the right person on our team will follow up."
      >
        <ul className="mt-10 grid gap-3 pb-24 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:max-w-none lg:pb-36">
          {ROUTES.map((r, i) => (
            <li key={r.href} className="animate-fade-up" style={{ animationDelay: `${0.45 + i * 0.08}s` }}>
              <Link
                href={r.href}
                // Phones: compact row (icon beside text) so the form isn't pushed far down. sm+: card.
                className="group/route flex h-full items-start gap-4 border border-hairline bg-fg/[0.03] p-4 backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-gold/60 hover:bg-fg/[0.06] hover:shadow-glow-soft sm:flex-col sm:gap-0 sm:p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center border border-gold/40 text-accent">
                  <Icon>{r.icon}</Icon>
                </span>
                <span className="flex h-full flex-col">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-on-dark-muted sm:mt-4">{r.eyebrow}</span>
                  <span className="mt-1 font-bold text-fg">{r.title}</span>
                  <span className="mt-auto pt-2 text-sm font-bold uppercase tracking-[0.12em] text-accent sm:pt-4">
                    {r.cta} <span className="inline-block transition-transform duration-300 group-hover/route:translate-x-1">→</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Form card overlaps the hero; the aside sits beside it on large screens. */}
      <section aria-labelledby="message-title" className="relative bg-page pb-20 sm:pb-28">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div id="message" className="-mt-16 scroll-mt-28 lg:col-span-7 lg:-mt-28">
              <h2 id="message-title" className="sr-only">
                Send us a message
              </h2>
              <HubSpotForm formId={HUBSPOT.forms.contact} title="Contact PowerChampions" />
            </div>

            <aside aria-label="Other ways to reach us" className="lg:col-span-5 lg:pt-14">
              <p className="mb-6 inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-accent">
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
                Our locations
              </p>
              <RevealGroup as="ul" stagger={0.08} className="space-y-4">
                {LOCATIONS.map((l, i) => {
                  const address = `${l.street}, ${l.locality}, ${l.region} ${l.postal}`;
                  const phone = "phone" in l ? l.phone : null;
                  return (
                    <RevealItem as="li" key={l.id}>
                      <article
                        aria-labelledby={`loc-${l.id}`}
                        className="relative border border-hairline bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-gold/50 hover:shadow-glow-soft"
                      >
                        <span aria-hidden className="absolute right-6 top-6 text-xs font-bold tracking-[0.2em] text-on-dark-muted">
                          0{i + 1}
                        </span>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{l.city}</p>
                        <h3 id={`loc-${l.id}`} className="mt-2 text-lg font-bold text-fg">
                          {l.name}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-on-dark">{address}</p>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                          {phone && (
                            <a href={`tel:${phone}`} className="text-fg underline-offset-4 hover:text-accent hover:underline">
                              {phone.replace("+1-", "").replace(/-/g, ".")}
                            </a>
                          )}
                          <a
                            href={mapsUrl(`${l.name}, ${address}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg underline-offset-4 hover:text-accent hover:underline"
                          >
                            Directions ↗<span className="sr-only"> to {l.name} (opens in a new tab)</span>
                          </a>
                          <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-fg underline-offset-4 hover:text-accent hover:underline">
                            Website ↗<span className="sr-only"> for {l.name} (opens in a new tab)</span>
                          </a>
                        </div>
                      </article>
                    </RevealItem>
                  );
                })}
              </RevealGroup>

              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group/li mt-8 flex items-center gap-4 border border-hairline p-5 transition-[border-color,box-shadow] duration-300 hover:border-gold/50 hover:shadow-glow-soft"
              >
                <span className="flex size-11 shrink-0 items-center justify-center bg-[#0a66c2] text-white">
                  <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="currentColor">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.25H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.75Z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-on-dark-muted">Connect with us</span>
                  <span className="block font-bold text-fg group-hover/li:text-accent">PowerChampions on LinkedIn ↗</span>
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </aside>
          </div>
        </Container>
      </section>

      <Section tone="ink-2" container="wide" spacing="sm" aria-labelledby="newsletter-title" className="cv-auto border-t border-hairline">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="mb-4 inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-accent">
              <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
              Newsletter
            </p>
            <h2 id="newsletter-title" className="text-h2 font-bold">
              Subscribe To Newsletter
            </h2>
            <p className="mt-4 max-w-md text-on-dark">
              News, podcast episodes and updates from across the PowerChampions network, straight to your inbox.
            </p>
          </div>
          <div className="lg:col-span-7">
            <HubSpotForm
              formId={HUBSPOT.forms.newsletter}
              title="Newsletter signup"
              variant="inline"
              className="bg-white p-6 shadow-[0_30px_70px_-40px_rgb(0_0_0/0.5)] sm:p-8"
            />
          </div>
        </div>
      </Section>
    </main>
  );
}
