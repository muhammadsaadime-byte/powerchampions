import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/home/cta-band";
import { Values } from "@/components/home/values";
import { Markdown, inline } from "@/components/page/markdown";
import { PlatformPillars } from "@/components/page/platform-pillars";
import { Icon, ServiceHero, type IconName } from "@/components/services/blocks";
import { Button } from "@/components/ui";
import { GlassCard, RevealGroup, RevealItem, RevealOnScroll, Section, SectionHeading } from "@/components/ui";
import { blocks, bullets, labelled, pageCopy, paragraphs, section } from "@/lib/content";
import { ADVISORY, LEADERSHIP, type Person } from "@/lib/team";
import { cn } from "@/lib/cn";
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
  const text = bio(p.name);
  return (
    <RevealItem as="li">
      <GlassCard as="article" padding="sm" className="flex h-full flex-col" aria-labelledby={`person-${i}`}>
        <div className="relative aspect-square w-full overflow-hidden border border-hairline bg-mist">
          <Image
            src={p.photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
            quality={70}
            className={cn("object-cover object-top grayscale transition-[filter,transform] duration-700 group-hover/card:scale-[1.03] group-hover/card:grayscale-0", p.crop)}
          />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold to-orange transition-transform duration-700 ease-out-expo group-hover/card:scale-x-100" />
        </div>
        <h3 id={`person-${i}`} className="mt-5 text-lg font-bold text-fg">
          {p.name}
        </h3>
        {p.title && <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-accent">{p.title}</p>}
        {text && (
          // Bios are long; tucked behind a native disclosure so the grid stays scannable.
          <details className="group/bio mt-4 border-t border-hairline pt-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-fg hover:text-accent [&::-webkit-details-marker]:hidden">
              Read bio
              <span aria-hidden className="text-accent transition-transform duration-300 group-open/bio:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-on-dark">{inline(text)}</p>
          </details>
        )}
      </GlassCard>
    </RevealItem>
  );
}

const MISSION_ICONS: IconName[] = ["users", "handshake", "shield", "chart"];

export default function WhoWeArePage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <ServiceHero
        scene="generator"
        crumbs={[{ label: "Who We Are", href: "/who-we-are" }]}
        eyebrow="An innovative, people-first platform for critical power services"
        title={
          <>
            Who <span className="text-glow">We Are</span>
          </>
        }
        intro={heroParas.map((p, i) => (
          <p key={i} className={i ? "mt-4 text-base" : ""}>
            {inline(p)}
          </p>
        ))}
        actions={
          <>
            <Button href="/contact-us" size="lg">
              Partner With Us
            </Button>
            <Button href="#PowerChampions-Team" variant="outline" size="lg" arrow>
              Meet the Team
            </Button>
          </>
        }
        specs={[
          { value: "10+", label: "Years of combined leadership expertise" },
          { value: "ASTA", label: "In-house American Trades Academy" },
          { value: "4", label: "Core values every team member lives by" },
          { value: "3", label: "Service locations across SC & GA" },
        ]}
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
                    <div className="flex items-start justify-between">
                      <span className="flex size-12 items-center justify-center border border-gold/40 bg-gold/[0.06] text-accent transition-colors duration-500 group-hover/card:border-gold group-hover/card:bg-gold/15">
                        <Icon name={MISSION_ICONS[i % MISSION_ICONS.length]} />
                      </span>
                      <span aria-hidden className="text-xs font-bold tracking-[0.2em] text-on-dark-muted">0{i + 1}</span>
                    </div>
                    <h3 className="mt-6 text-lg font-bold">{m.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-on-dark">{inline(m.text)}</p>
                  </GlassCard>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      <Values />

      <PlatformPillars pillars={growth} />

      {/* Leadership — anchor kept from the live site */}
      <Section id="PowerChampions-Team" tone="ink" grid container="wide" aria-labelledby="team-title" className="cv-auto">
        <RevealOnScroll>
          <SectionHeading id="team-title" eyebrow="Our team" title="The PowerChampions Leadership Team" intro={<Markdown md={leadershipIntro} />} className="max-w-4xl" />
        </RevealOnScroll>
        <RevealGroup as="ul" stagger={0.06} className="mt-14 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((p, i) => (
            <PersonCard key={p.name} p={p} i={i} />
          ))}
        </RevealGroup>
      </Section>

      <Section tone="ink-2" container="wide" aria-labelledby="advisory-title" className="cv-auto">
        <RevealOnScroll>
          <SectionHeading id="advisory-title" eyebrow="Guidance & accountability" title="PowerChampions Advisory Board" intro={advisoryIntro} className="max-w-4xl" />
        </RevealOnScroll>
        <RevealGroup as="ul" stagger={0.06} className="mt-14 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
