import type { Metadata } from "next";
import Link from "next/link";
import { HubSpotForm } from "@/components/embeds/hubspot-form";
import { CtaBand } from "@/components/home/cta-band";
import { Brackets, NewsCard, PostImage, PostMeta } from "@/components/news/news-ui";
import { PageHero } from "@/components/page/page-hero";
import { Container, RevealGroup, RevealItem, RevealOnScroll, Section } from "@/components/ui";
import { formatDate, NEWS } from "@/lib/news";
import { HUBSPOT } from "@/lib/site";

export const metadata: Metadata = {
  title: "News",
  description: "PowerChampions news: partnerships, new locations, conference appearances, and press releases from across our critical power network.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  const [lead, ...rest] = NEWS;
  const total = NEWS.length;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ label: "News", href: "/news" }]} eyebrow="Newsroom" title="News and Resources" intro="Announcements, partnerships and press releases.">
        {/* Jump list: every story, newest first. */}
        <ol className="mt-10 hidden max-w-4xl animate-fade-up grid-cols-5 gap-px border border-hairline bg-hairline lg:grid" style={{ animationDelay: "0.4s" }}>
          {NEWS.map((p, i) => (
            <li key={p.slug} className="bg-page/80 backdrop-blur-md">
              <Link href={`/news/${p.slug}`} className="group/jump flex h-full flex-col gap-2 p-4 transition-colors hover:bg-fg/[0.04]">
                <span className="text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                <span className="line-clamp-2 text-sm font-bold leading-snug text-fg group-hover/jump:text-accent">{p.title}</span>
                <time dateTime={p.date} className="mt-auto text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-on-dark-muted">
                  {formatDate(p.date)}
                </time>
              </Link>
            </li>
          ))}
        </ol>
      </PageHero>

      {/* Lead story */}
      <section aria-labelledby="lead-title" className="relative bg-page pb-6 sm:pb-8">
        <Container size="wide">
          <RevealOnScroll>
            <article className="group/post relative isolate grid overflow-hidden border border-hairline bg-surface transition-[border-color,box-shadow] duration-500 hover:border-gold/50 hover:shadow-glow-soft lg:grid-cols-12">
              <div className="relative lg:col-span-7">
                <PostImage post={lead} priority zoom sizes="(min-width: 1024px) 58vw, 100vw" className="aspect-[16/10] h-full lg:aspect-auto lg:min-h-[30rem]" />
                <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(16_16_16/0.6))]" />
                <Brackets className="size-6" />
                <span data-scheme="dark" className="absolute bottom-5 left-6 hidden items-center sm:inline-flex gap-3 text-xs font-bold uppercase tracking-[0.2em] text-fg">
                  <span aria-hidden className="relative flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-gold opacity-70 motion-reduce:hidden" />
                    <span className="relative size-2 rounded-full bg-gold" />
                  </span>
                  Latest story
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-5 xl:p-14">
                <PostMeta post={lead} />
                <h2 id="lead-title" className="mt-5 text-h2 font-bold text-fg">
                  <Link href={`/news/${lead.slug}`} className="after:absolute after:inset-0 group-hover/post:text-accent">
                    {lead.title}
                  </Link>
                </h2>
                <p className="mt-5 text-on-dark sm:text-lg">{lead.description}</p>
                <span aria-hidden className="mt-8 inline-flex min-h-12 items-center gap-2.5 self-start bg-gold px-6 text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink transition-shadow duration-300 group-hover/post:shadow-glow">
                  Read the story
                  <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-300 ease-out-expo group-hover/post:translate-x-1">
                    <path d="M1 8h12M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
                  </svg>
                </span>
              </div>
            </article>
          </RevealOnScroll>
        </Container>
      </section>

      {/* More stories */}
      <section aria-labelledby="stories-title" className="cv-auto relative bg-page pb-20 pt-10 sm:pb-24 lg:pb-28">
        <Container size="wide">
          <RevealOnScroll className="mb-8 flex items-end justify-between gap-6 border-b border-hairline pb-5">
            <h2 id="stories-title" className="inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-accent">
              <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
              More stories
            </h2>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-dark-muted">
              0{total} stories
            </p>
          </RevealOnScroll>
          <RevealGroup as="ul" stagger={0.06} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {rest.map((p, i) => (
              <RevealItem as="li" key={p.slug}>
                <NewsCard post={p} index={i + 2} total={total} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Newsletter (same HubSpot form as the contact page) */}
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
            <p className="mt-4 max-w-md text-on-dark">News and updates from across the PowerChampions network, straight to your inbox.</p>
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

      <CtaBand />
    </main>
  );
}
