import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/home/cta-band";
import { Values } from "@/components/home/values";
import { Markdown, inline } from "@/components/page/markdown";
import { PageHero } from "@/components/page/page-hero";
import { GlassCard, RevealGroup, RevealItem, RevealOnScroll, Section, SectionHeading } from "@/components/ui";
import { blocks, bullets, labelled, pageCopy, paragraphs, section } from "@/lib/content";
import { ADVISORY, LEADERSHIP, type Person } from "@/lib/team";
import { cn } from "@/lib/cn";
import heroImg from "@/public/images/site/powerchampions-who-we-are.jpg";
import missionImg from "@/public/images/site/powerchampions-mission.jpg";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "PowerChampions builds a people-first platform for critical power services, delivering operational innovation, trusted service, and growth opportunities.",
  alternates: { canonical: "/who-we-are" },
};

const md = pageCopy("who-we-are");
const all = blocks(md);
const heroParas = paragraphs(all.find((b) => b.title === "Who We Are")!.body).slice(1);
const vision = paragraphs(section(md, "Our Vision"))[0];
const mission = bullets(section(md, "Our Mission")).map(labelled);
const growth = bullets(section(md, "How We Support Growth")).map(labelled);
const leadershipIntro = paragraphs(section(md, "The PowerChampions Leadership Team"))[0];
const advisoryIntro = paragraphs(section(md, "PowerChampions Advisory Board"))[0];
const closing = paragraphs(section(md, "Let’s Build the Future"))[0];

/** Bio = text under the person's heading (leadership: under their ###### title line). */
function bio(name: string) {
  const i = all.findIndex((b) => b.level === 3 && b.title.includes(name));
  if (i < 0) return "";
  const next = all[i + 1];
  return (next && next.level === 6 ? next.body : all[i].body).trim();
}

function PersonCard({ p, i }: { p: Person; i: number }) {
  return (
    <RevealItem as="li">
      <GlassCard as="article" padding="sm" className="flex h-full flex-col sm:flex-row sm:gap-6 lg:flex-col" aria-labelledby={`person-${i}`}>
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden border border-hairline bg-mist sm:w-40 lg:w-full">
          <Image
            src={p.photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 160px, 90vw"
            quality={70}
            className={cn("object-cover object-top grayscale transition-[filter] duration-700 group-hover/card:grayscale-0", p.crop)}
          />
        </div>
        <div className="mt-5 sm:mt-0 lg:mt-5">
          <h3 id={`person-${i}`} className="text-lg font-bold text-fg">
            {p.name}
          </h3>
          {p.title && <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-accent">{p.title}</p>}
          <p className="mt-3 text-sm leading-relaxed text-on-dark">{inline(bio(p.name))}</p>
        </div>
      </GlassCard>
    </RevealItem>
  );
}

export default function WhoWeArePage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[{ label: "Who We Are", href: "/who-we-are" }]}
        eyebrow="An innovative, people-first platform for critical power services"
        title="Who We Are"
        image={heroImg}
        imageAlt="PowerChampions technicians at work"
        intro={heroParas.map((p, i) => (
          <p key={i} className={i ? "mt-4 text-base" : ""}>
            {inline(p)}
          </p>
        ))}
      />

      {/* Vision & mission */}
      <Section tone="ink-2" container="wide" aria-labelledby="mission-title" className="cv-auto">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <RevealOnScroll className="lg:col-span-5">
            <p className="text-eyebrow font-bold uppercase text-accent">Our Vision</p>
            <p className="mt-5 text-h2 font-bold text-fg">{vision}</p>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden border border-hairline">
              <Image src={missionImg} alt="PowerChampions team members working together" fill sizes="(min-width: 1024px) 38vw, 100vw" quality={65} className="object-cover" />
            </div>
          </RevealOnScroll>
          <div className="lg:col-span-7">
            <RevealOnScroll>
              <SectionHeading id="mission-title" eyebrow="What drives us" title="Our Mission" />
            </RevealOnScroll>
            <RevealGroup as="ul" className="mt-10 grid gap-4 sm:grid-cols-2">
              {mission.map((m, i) => (
                <RevealItem as="li" key={m.label}>
                  <GlassCard className="h-full">
                    <span className="text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                    <h3 className="mt-4 text-lg font-bold">{m.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-on-dark">{inline(m.text)}</p>
                  </GlassCard>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      <Values />

      {/* Growth support */}
      <Section tone="ink-2" container="wide" aria-labelledby="growth-title" className="cv-auto">
        <RevealOnScroll>
          <SectionHeading id="growth-title" eyebrow="The platform" title="How We Support Growth Across the Platform" />
        </RevealOnScroll>
        <RevealGroup as="ul" className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {growth.map((g) => (
            <RevealItem as="li" key={g.label}>
              <GlassCard className="h-full">
                <span aria-hidden className="block h-0.5 w-10 bg-gradient-to-r from-gold to-orange" />
                <h3 className="mt-6 text-h3 font-bold">{g.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-dark">{inline(g.text)}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Leadership — anchor kept from the live site */}
      <Section id="PowerChampions-Team" tone="ink" grid container="wide" aria-labelledby="team-title" className="cv-auto">
        <RevealOnScroll>
          <SectionHeading id="team-title" eyebrow="Our team" title="The PowerChampions Leadership Team" intro={<Markdown md={leadershipIntro} />} className="max-w-4xl" />
        </RevealOnScroll>
        <RevealGroup as="ul" stagger={0.06} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((p, i) => (
            <PersonCard key={p.name} p={p} i={i} />
          ))}
        </RevealGroup>
      </Section>

      <Section tone="ink-2" container="wide" aria-labelledby="advisory-title" className="cv-auto">
        <RevealOnScroll>
          <SectionHeading id="advisory-title" eyebrow="Guidance & accountability" title="PowerChampions Advisory Board" intro={advisoryIntro} className="max-w-4xl" />
        </RevealOnScroll>
        <RevealGroup as="ul" stagger={0.06} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {ADVISORY.map((p, i) => (
            <PersonCard key={p.name} p={p} i={LEADERSHIP.length + i} />
          ))}
        </RevealGroup>
      </Section>

      <CtaBand
        eyebrow="Join the network"
        title="Let’s Build the Future of Critical Power — Together"
        text={closing}
        primary={{ label: "Partner With PowerChampions", href: "/contact-us" }}
        secondary={{ label: "Explore Careers", href: "/careers" }}
      />
    </main>
  );
}
