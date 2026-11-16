import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { Testimonials } from "@/components/home/testimonials";
import { HubSpotForm } from "@/components/embeds/hubspot-form";
import { Faq } from "@/components/page/faq";
import { inline } from "@/components/page/markdown";
import { PageHero } from "@/components/page/page-hero";
import { Button, GlassCard, RevealGroup, RevealItem, RevealOnScroll, Section, SectionHeading, VideoFacade } from "@/components/ui";
import { blocks, pageCopy, paragraphs, section } from "@/lib/content";
import { HUBSPOT } from "@/lib/site";
import heroImg from "@/public/images/site/powerchampions-partnership-team-meeting-with-business-owners.jpg";
import poster from "@/public/images/site/triple-t-critical-power-services-family3.jpg";

export const metadata: Metadata = {
  title: "Sell Your Business | Partner With PowerChampions",
  description:
    "Thinking about selling your business? Explore partnership opportunities with PowerChampions and find a path forward that preserves your legacy, team, and culture.",
  alternates: { canonical: "/partners" },
};

const md = pageCopy("partners");
/** Paragraphs of a section, up to its first sub-heading (sub-blocks are rendered separately). */
const p = (title: string) => paragraphs(section(md, title).split(/^#{1,6} /m)[0]);

const heroIntro = paragraphs(blocks(md).find((b) => b.title.startsWith("Sell Your Business"))!.body)[0];
const benefits = blocks(section(md, "A Partnership Designed Around Your Goals")).filter((b) => b.level === 4);
const lookFor = (() => {
  const groups: Array<{ title: string; items: string[] }> = [];
  for (const line of section(md, "What do We Look For").split("\n")) {
    if (line.startsWith("- ")) groups.at(-1)?.items.push(line.slice(2));
    else if (/^(Capabilities|Talent|Financial Metrics)$/.test(line.trim())) groups.push({ title: line.trim(), items: [] });
  }
  return groups;
})();
const faq = blocks(section(md, "Frequently Asked Questions"))
  .filter((b) => b.level === 3)
  .map((b) => ({ q: b.title, a: paragraphs(b.body).join(" ") }));

const speak = (label = "Speak With Our Team") => (
  <Button href="#inquiry" size="lg">
    {label}
  </Button>
);

export default function PartnersPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[{ label: "Market-Partners", href: "/partners" }]}
        eyebrow="Market partners"
        title={
          <>
            Sell Your Business To A <span className="text-glow">Strategic Partner</span>
          </>
        }
        intro={heroIntro}
        image={heroImg}
        imageAlt="PowerChampions partnership team meeting with business owners"
        actions={
          <>
            {speak()}
            <Button href="#partnership-video" variant="outline" size="lg" arrow>
              See What Partnership Looks Like
            </Button>
          </>
        }
      />

      {/* Why partner + video */}
      <Section tone="ink-2" container="wide" aria-labelledby="why-title" className="cv-auto">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <RevealOnScroll className="space-y-5 text-on-dark lg:col-span-5">
            <SectionHeading id="why-title" eyebrow="Why PowerChampions" title="Why Partner With PowerChampions?" />
            {p("Why Partner With PowerChampions").slice(0, 2).map((t, i) => (
              <p key={i} className={i === 0 ? "text-lead" : ""}>
                {inline(t)}
              </p>
            ))}
            <div className="pt-3">{speak("Discuss Partnership Opportunities")}</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="lg:col-span-7" as="div">
            <div id="partnership-video" className="scroll-mt-28">
              <VideoFacade
                src="https://www.youtube-nocookie.com/embed/zAQ3cPCk3Us?rel=0&modestbranding=1"
                title="See what partnership with PowerChampions looks like"
                poster={poster}
                posterAlt="The Triple T Critical Power Services team, a PowerChampions market-partner"
                label="See what partnership looks like"
              />
              <p className="mt-4 text-sm italic text-on-dark-muted">
                Hear how PowerChampions partners with business owners to provide resources, support, and opportunities for continued success.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Considering selling */}
      <Section tone="ink" grid container="wide" aria-labelledby="considering-title" className="cv-auto">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <SectionHeading id="considering-title" eyebrow="Your next chapter" title="Considering Selling Your Business? Let’s Talk About What’s Next." />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="space-y-5 text-lead text-on-dark lg:pt-12">
            {p("Considering Selling Your Business").map((t, i) => (
              <p key={i}>{inline(t)}</p>
            ))}
          </RevealOnScroll>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <RevealOnScroll className="space-y-5 text-on-dark lg:col-span-5">
            <h2 className="text-h2 font-bold text-fg">A Partnership Designed Around Your Goals</h2>
            {p("A Partnership Designed Around Your Goals").map((t, i) => (
              <p key={i}>{inline(t)}</p>
            ))}
            <div className="pt-2">{speak()}</div>
          </RevealOnScroll>
          <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {benefits.map((b, i) => (
              <RevealItem as="li" key={b.title}>
                <GlassCard className="h-full">
                  <span className="text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                  <h3 className="mt-5 text-h3 font-bold">{b.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-on-dark">{paragraphs(b.body).join(" ")}</p>
                </GlassCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* What we look for */}
      <Section tone="ink-2" container="wide" aria-labelledby="lookfor-title" className="cv-auto">
        <RevealOnScroll>
          <SectionHeading id="lookfor-title" eyebrow="Fit" title="What Do We Look For In A Market-Partner?" intro={p("What do We Look For").join(" ")} className="max-w-4xl" />
        </RevealOnScroll>
        <RevealGroup as="ul" className="mt-12 grid gap-5 md:grid-cols-3">
          {lookFor.map((g) => (
            <RevealItem as="li" key={g.title}>
              <GlassCard className="h-full">
                <h3 className="text-h3 font-bold text-accent">{g.title}</h3>
                <ul className="prose-pc mt-5 text-sm text-on-dark">
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-10">{speak()}</div>
      </Section>

      {/* Identity + team */}
      <Section tone="ink" container="wide" aria-labelledby="identity-title" className="cv-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll className="space-y-5 text-on-dark">
            <SectionHeading id="identity-title" eyebrow="Your legacy" title="Grow While Maintaining Your Identity" />
            {p("Grow While Maintaining Your Identity").map((t, i) => (
              <p key={i} className={i === 0 ? "text-lead text-fg" : ""}>
                {inline(t)}
              </p>
            ))}
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <GlassCard padding="lg" className="h-full">
              <h2 className="text-h2 font-bold">Meet the Team Behind Your Partnership</h2>
              <div className="mt-5 space-y-4 text-on-dark">
                {p("Meet the Team Behind Your Partnership").map((t, i) => (
                  <p key={i}>{inline(t)}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                {speak()}
                <Button href="/who-we-are#PowerChampions-Team" variant="ghost" arrow>
                  Meet the team
                </Button>
              </div>
            </GlassCard>
          </RevealOnScroll>
        </div>
      </Section>

      <Testimonials />

      {/* FAQ */}
      <Section tone="ink-2" container="narrow" aria-labelledby="faq-title" className="cv-auto">
        <RevealOnScroll>
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Frequently Asked Questions About Selling Your Business" align="center" />
        </RevealOnScroll>
        <div className="mt-12">
          <Faq items={faq} pageUrl="/partners" />
        </div>
      </Section>

      {/* Confidential inquiry — anchor kept from the live site */}
      <Section id="inquiry" tone="ink" grid container="wide" aria-labelledby="inquiry-title" className="scroll-mt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 text-on-dark lg:col-span-5">
            <p className="text-eyebrow font-bold uppercase text-accent">Confidential inquiry</p>
            <h2 id="inquiry-title" className="text-h1 font-bold text-fg">
              Start a Confidential Conversation
            </h2>
            <p className="text-lead">
              Thinking about selling or partnering? Share a few details below. Every conversation is confidential and there is no obligation.
            </p>
            <p>{p("Explore Partnership Opportunities")[0]}</p>
            <p className="font-bold italic text-fg">Confidential discussions. No obligation.</p>
          </div>
          <div className="lg:col-span-7">
            <h3 className="mb-4 text-lg font-bold text-fg">Tell Us About Your Business</h3>
            <HubSpotForm formId={HUBSPOT.forms.partners} title="Partnership inquiry form" />
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="Explore partnership opportunities"
        title="Your business represents years of hard work, relationships, and dedication."
        text="PowerChampions partners with electrical and generator companies to help owners explore their next opportunity while supporting continued growth."
        primary={{ label: "Discuss Your Partnership Options", href: "#inquiry" }}
        secondary={{ label: "Who We Are", href: "/who-we-are" }}
      />
    </main>
  );
}
