import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { RipplingBoard } from "@/components/embeds/rippling-board";
import { inline } from "@/components/page/markdown";
import { PageHero } from "@/components/page/page-hero";
import { Button, GlassCard, RevealGroup, RevealItem, RevealOnScroll, Section, SectionHeading, VideoFacade } from "@/components/ui";
import { blocks, pageCopy, paragraphs, section } from "@/lib/content";
import { TALENT_COMMUNITY_URL } from "@/lib/site";
import heroImg from "@/public/images/site/powerchampions-careers.jpg";
import poster from "@/public/images/site/powerchampions-asta-workshop-268.jpg";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Build your career in critical power with PowerChampions: technician training, benefits, a people-first team, and open roles across our network.",
  alternates: { canonical: "/careers" },
};

const md = pageCopy("careers");
const intro = (title: string) => paragraphs(section(md, title).split(/^#{1,6} /m)[0]);
const sub = (title: string, level: number) => blocks(section(md, title)).filter((b) => b.level === level);

const hero = paragraphs(blocks(md).find((b) => b.title.startsWith("Your career"))!.body)[0];
const steps = sub("A hiring process that respects your time", 4);
const meaningful = sub("Meaningful work", 5);
const benefits = sub("We take care of the people", 4);
const missionVision = sub("Our Mission & Vision", 5);
const values = sub("The Values That Drive Us", 4);

const openRoles = (
  <Button href="#open-roles" size="lg">
    View Open Roles
  </Button>
);

export default function CareersPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[{ label: "Careers", href: "/careers" }]}
        eyebrow="Careers at PowerChampions"
        title={
          <>
            Your career in <span className="text-glow">critical power</span> starts here.
          </>
        }
        intro={hero}
        image={heroImg}
        imageAlt="PowerChampions technicians on the job"
        actions={
          <>
            {openRoles}
            <Button href={TALENT_COMMUNITY_URL} variant="outline" size="lg" arrow>
              Join Our Talent Community
            </Button>
          </>
        }
      />

      <Section tone="ink-2" container="wide" aria-labelledby="invest-title" className="cv-auto">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <RevealOnScroll className="space-y-10 lg:col-span-5">
            <div className="space-y-4 text-on-dark">
              <SectionHeading id="invest-title" eyebrow="Our people" title="We Invest in People" />
              {intro("We Invest in People").map((t, i) => (
                <p key={i}>{inline(t)}</p>
              ))}
            </div>
            <div className="space-y-4 border-l-2 border-gold pl-6 text-on-dark">
              <h2 className="text-h3 font-bold text-white">We’re Empowering People Every Step of the Way</h2>
              {intro("Empowering People Every Step").map((t, i) => (
                <p key={i}>{inline(t)}</p>
              ))}
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="lg:col-span-7">
            <VideoFacade
              src="https://www.youtube-nocookie.com/embed/d-HwXRRe-Hs?start=7&rel=0&modestbranding=1"
              title="Life at PowerChampions"
              poster={poster}
              posterAlt="PowerChampions technicians training together"
              label="Life at PowerChampions"
            />
          </RevealOnScroll>
        </div>
      </Section>

      {/* Hiring process */}
      <Section tone="ink" grid container="wide" aria-labelledby="process-title" className="cv-auto">
        <RevealOnScroll>
          <SectionHeading id="process-title" eyebrow="What to expect" title="A hiring process that respects your time." />
        </RevealOnScroll>
        <RevealGroup as="ol" className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((s, i) => (
            <RevealItem as="li" key={s.title}>
              <GlassCard className="h-full">
                <span className="text-xs font-bold tracking-[0.2em] text-gold">STEP 0{i + 1}</span>
                <h3 className="mt-6 text-h3 font-bold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-dark">{paragraphs(s.body).join(" ")}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Meaningful work */}
      <Section tone="ink-2" container="wide" aria-labelledby="meaningful-title" className="cv-auto">
        <div className="grid gap-10 lg:grid-cols-12">
          <RevealOnScroll className="lg:col-span-5">
            <SectionHeading id="meaningful-title" eyebrow="Why it matters" title="Meaningful work, done by people who look out for each other." />
          </RevealOnScroll>
          <RevealGroup as="ul" className="grid gap-5 lg:col-span-7">
            {meaningful.map((m) => (
              <RevealItem as="li" key={m.title}>
                <GlassCard>
                  <h3 className="text-h3 font-bold">{m.title}</h3>
                  <p className="mt-3 text-on-dark">{paragraphs(m.body).join(" ")}</p>
                </GlassCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Benefits */}
      <Section tone="ink" container="wide" aria-labelledby="benefits-title" className="cv-auto">
        <RevealOnScroll>
          <SectionHeading id="benefits-title" eyebrow="Benefits" title="We take care of the people who power everything." intro={intro("We take care of the people")[0]} />
        </RevealOnScroll>
        <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <RevealItem as="li" key={b.title}>
              <GlassCard className="h-full">
                <span className="text-xs font-bold tracking-[0.2em] text-gold">0{i + 1}</span>
                <h3 className="mt-5 text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-dark">{paragraphs(b.body).join(" ")}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Open roles — anchor kept from the live site */}
      <Section id="open-roles" tone="ink-2" grid container="wide" aria-labelledby="roles-title" className="scroll-mt-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="roles-title" eyebrow="Open roles" title="Ready to build your future?" intro={intro("Ready to build your Future")[0]} />
          <Button href={TALENT_COMMUNITY_URL} variant="outline" arrow>
            Join Our Talent Community
          </Button>
        </div>
        <RipplingBoard />
      </Section>

      {/* Mission, vision, values */}
      <Section tone="ink" container="wide" aria-labelledby="mv-title" className="cv-auto">
        <h2 id="mv-title" className="sr-only">
          Our Mission &amp; Vision
        </h2>
        <RevealGroup as="div" className="grid gap-5 md:grid-cols-2">
          {missionVision.map((m) => (
            <RevealItem key={m.title}>
              <GlassCard padding="lg" className="h-full">
                <p className="text-eyebrow font-bold uppercase text-gold">{m.title}</p>
                <p className="mt-5 text-h3 font-medium leading-snug text-white">{paragraphs(m.body).join(" ")}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-20">
          <RevealOnScroll>
            <SectionHeading eyebrow="Guiding principles" title="The Values That Drive Us" intro={intro("The Values That Drive Us")[0]} />
          </RevealOnScroll>
          <RevealGroup as="ul" className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <RevealItem as="li" key={v.title} className="bg-ink p-8">
                <span className="text-xs font-bold tracking-[0.2em] text-gold">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-on-dark">{paragraphs(v.body).join(" ")}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CtaBand
        eyebrow="Careers"
        title="Ready to build your future with PowerChampions?"
        text="Whether you’re entering the field or advancing into leadership, there’s a place for you here."
        primary={{ label: "Join Our Talent Community", href: TALENT_COMMUNITY_URL }}
        secondary={{ label: "View Open Roles", href: "#open-roles" }}
      />
    </main>
  );
}
