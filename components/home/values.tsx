import { GlassCard, RevealGroup, RevealItem, RevealOnScroll, Section, SectionHeading } from "@/components/ui";
import { EmpathyIcon, IntegrityIcon, ServantLeadershipIcon, SincerityIcon } from "./value-icons";

/** Copy verbatim from the live homepage (content/home.md). First sentence = lead, rest = body. */
const VALUES = [
  {
    title: "Servant-Leadership",
    Icon: ServantLeadershipIcon,
    lead: "We lead by empowering others.",
    body: "True leadership begins with service — supporting our teams, customers, and communities so they can thrive. We believe success is shared and built on humility, accountability, and a genuine desire to see others win.",
  },
  {
    title: "Empathy",
    Icon: EmpathyIcon,
    lead: "Every project, partnership, and interaction begins with listening.",
    body: "We understand before we act. By putting ourselves in the shoes of others — customers, technicians, and teammates — we build trust, deliver better solutions, and create lasting relationships.",
  },
  {
    title: "Integrity",
    Icon: IntegrityIcon,
    lead: "We do what’s right, every time.",
    body: "Integrity is the foundation of Power Champions. Whether on a service call or in the boardroom, we hold ourselves to the highest ethical standards — doing what’s right, even when no one is watching.",
  },
  {
    title: "Sincerity",
    Icon: SincerityIcon,
    lead: "We mean what we say and follow through with heart.",
    body: "We approach every commitment with authenticity and honesty. Our sincerity fuels strong partnerships and ensures that every promise we make is backed by genuine care and consistent action.",
  },
];

export function Values() {
  return (
    <Section id="values" tone="ink" grid aria-labelledby="values-title" container="wide" className="cv-auto">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <RevealOnScroll className="lg:col-span-7">
          <SectionHeading id="values-title" eyebrow="Our values" title="The Values That Power Us" className="max-w-none" />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="lg:col-span-5">
          <p className="text-lead text-on-dark lg:border-l lg:border-hairline lg:pl-8">
            At PowerChampions, our strength comes from the character of our people. Every individual in our network lives by four values.
          </p>
        </RevealOnScroll>
      </div>

      <RevealGroup as="ul" stagger={0.12} className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4">
        {VALUES.map(({ title, Icon, lead, body }, i) => (
          <RevealItem as="li" key={title}>
            <GlassCard as="article" padding="lg" className="flex h-full flex-col" aria-labelledby={`value-${i}`}>
              <div className="flex items-start justify-between">
                <span className="flex size-14 items-center justify-center border border-gold/40 bg-gold/[0.06] text-accent transition-[background-color,color,box-shadow,border-color] duration-500 ease-out-expo group-hover/card:border-gold group-hover/card:bg-gold group-hover/card:text-ink group-hover/card:shadow-glow">
                  <Icon className="pc-icon-draw size-8" />
                </span>
                <span aria-hidden className="text-xs font-bold tracking-[0.2em] text-on-dark-muted transition-colors group-hover/card:text-accent">
                  0{i + 1}
                </span>
              </div>
              <h3 id={`value-${i}`} className="mt-10 text-h3 font-bold">
                {title}
              </h3>
              <p className="mt-3 font-medium leading-snug text-fg">{lead}</p>
              <p className="mt-3 text-sm leading-relaxed text-on-dark">{body}</p>
            </GlassCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
