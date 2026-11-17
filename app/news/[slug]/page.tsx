import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/home/cta-band";
import { ArticleBody, Brackets, NewsCard, PostImage, PostMeta } from "@/components/news/news-ui";
import { Button, Container, EnergyLines, GridBackground, RevealGroup, RevealItem, RevealOnScroll } from "@/components/ui";
import { formatDate, getPost, NEWS } from "@/lib/news";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NEWS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date, url: `/news/${post.slug}` },
  };
}

function ShareLinks({ url, title }: { url: string; title: string }) {
  const item =
    "inline-flex size-11 items-center justify-center border border-hairline text-fg transition-[border-color,color,box-shadow] hover:border-gold hover:text-accent hover:shadow-glow-soft";
  return (
    <div className="flex items-center gap-3">
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className={item}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm7 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
        </svg>
        <span className="sr-only">Share on LinkedIn (opens in a new tab)</span>
      </a>
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} className={item}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
          <path d="M3 5.5h18v13H3zM3.5 6l8.5 7 8.5-7" />
        </svg>
        <span className="sr-only">Share by email</span>
      </a>
    </div>
  );
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/news/${post.slug}`;
  const i = NEWS.indexOf(post);
  const newer = NEWS[i - 1];
  const older = NEWS[i + 1];
  const more = NEWS.filter((p) => p !== post).slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      image: SITE_URL + post.image.src,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: "News", item: SITE_URL + "/news" },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero: headline left, framed image right. The headline is the LCP element (CSS-only entrance). */}
      <section data-scheme="dark" className="relative isolate overflow-hidden bg-page pb-14 pt-[calc(var(--pc-header-h)+3rem)] sm:pb-16 lg:pb-20 lg:pt-[calc(var(--pc-header-h)+4.5rem)]">
        <GridBackground fade="center" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[80svh]">
          <EnergyLines intensity={0.6} />
        </div>
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="mb-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-on-dark-muted">
              <li>
                <Link href="/" className="-my-3 inline-block py-3 hover:text-accent">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="text-accent">/</span>
                <Link href="/news" className="-my-3 inline-block py-3 hover:text-accent">
                  News
                </Link>
              </li>
              <li className="flex min-w-0 items-center gap-2">
                <span aria-hidden className="text-accent">/</span>
                <span aria-current="page" className="max-w-[16rem] truncate text-fg sm:max-w-md">
                  {post.title}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <PostMeta post={post} className="animate-fade-up" />
              <h1
                className="mt-6 animate-fade-up text-[clamp(1.75rem,1.25rem+2.1vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.015em] text-fg"
                style={{ animationDelay: "0.1s" }}
              >
                {post.title}
              </h1>
              <p className="mt-6 max-w-2xl animate-fade-up text-lead text-on-dark" style={{ animationDelay: "0.25s" }}>
                {post.description}
              </p>
              <div className="mt-8 flex animate-fade-up items-center gap-4 border-t border-hairline pt-6" style={{ animationDelay: "0.35s" }}>
                <span aria-hidden className="flex size-11 items-center justify-center border border-gold/50 bg-gold/[0.08] text-accent">
                  <svg viewBox="0 0 120 200" className="h-5 w-auto">
                    <path fill="currentColor" d="M78 0 8 112h44L34 200l78-124H66L78 0Z" />
                  </svg>
                </span>
                <p className="text-sm text-on-dark-muted">
                  <span className="block font-bold text-fg">{SITE_NAME}</span>
                  Published <time dateTime={post.date}>{formatDate(post.date)}</time>
                </p>
              </div>
            </div>
            <div className="animate-fade-up lg:col-span-5" style={{ animationDelay: "0.2s" }}>
              <div className="relative border border-hairline">
                <PostImage post={post} priority sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3]" />
                <Brackets className="size-6" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Article + sidebar */}
      <section aria-label="Article" className="relative bg-page py-14 sm:py-16 lg:py-24">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <article className="min-w-0 lg:col-span-7 xl:col-span-8">
              <div className="max-w-3xl">
                <ArticleBody blocks={post.body} />

                {(post.source || post.action) && (
                  <div className="relative mt-12 overflow-hidden border border-hairline bg-surface p-6 sm:p-8">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-gold to-orange" />
                    <p className="text-eyebrow font-bold uppercase text-accent">{post.source ? "Full announcement" : "Next step"}</p>
                    <p className="mt-3 text-h3 font-bold text-fg">{post.source ? post.source.label : "Talk to the PowerChampions team"}</p>
                    <div className="mt-6 flex flex-wrap gap-4">
                      {post.source && (
                        <Button href={post.source.href} size="lg">
                          Read the release
                        </Button>
                      )}
                      {post.action && (
                        <Button href={post.action.href} variant={post.source ? "outline" : "primary"} size="lg" arrow>
                          {post.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-on-dark-muted">Share this story</p>
                  <ShareLinks url={url} title={post.title} />
                </div>
              </div>
            </article>

            <aside aria-label="About this story" className="lg:col-span-5 xl:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-[calc(var(--pc-header-h)+1.5rem)]">
                <div className="relative border border-hairline bg-surface p-6 sm:p-8">
                  <Brackets className="size-4" />
                  <h2 className="text-eyebrow font-bold uppercase text-accent">At a glance</h2>
                  <dl className="mt-5 divide-y divide-hairline">
                    <div className="flex flex-col gap-1 py-4 first:pt-0">
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-on-dark-muted">Published</dt>
                      <dd className="font-bold text-fg">{formatDate(post.date)}</dd>
                    </div>
                    {post.facts.map(([label, value]) => (
                      <div key={label} className="flex flex-col gap-1 py-4 last:pb-0">
                        <dt className="text-xs font-bold uppercase tracking-[0.14em] text-on-dark-muted">{label}</dt>
                        <dd className="font-bold text-fg">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div data-scheme="dark" className="relative isolate overflow-hidden border border-gold/40 bg-page p-6 sm:p-8">
                  <span aria-hidden className="absolute -right-10 -top-10 -z-10 size-40 rounded-full bg-[radial-gradient(closest-side,rgb(234_166_7/0.22),transparent)]" />
                  <p className="text-h3 font-bold text-fg">
                    Your Power. <span className="text-glow">Our Mission.</span>
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-on-dark">Critical power services across the Southeast, with 24/7 emergency response.</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button href="/contact-us" size="sm">
                      Contact us
                    </Button>
                    <Button href="/locations" variant="outline" size="sm" arrow>
                      Find a location
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Previous / next */}
          <nav aria-label="More stories" className="mt-16 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {[
              { p: newer, label: "Newer story", align: "" },
              { p: older, label: "Older story", align: "sm:items-end sm:text-right" },
            ].map(({ p, label, align }) =>
              p ? (
                <Link key={label} href={`/news/${p.slug}`} className={`group/nav flex flex-col gap-2 bg-page p-6 transition-colors hover:bg-surface sm:p-8 ${align}`}>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{label}</span>
                  <span className="line-clamp-2 text-lg font-bold leading-snug text-fg group-hover/nav:text-accent">{p.title}</span>
                </Link>
              ) : (
                <Link key={label} href="/news" className={`group/nav flex flex-col gap-2 bg-page p-6 transition-colors hover:bg-surface sm:p-8 ${align}`}>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Newsroom</span>
                  <span className="text-lg font-bold leading-snug text-fg group-hover/nav:text-accent">All news</span>
                </Link>
              ),
            )}
          </nav>
        </Container>
      </section>

      {/* More news */}
      <section aria-labelledby="more-news-title" className="cv-auto relative border-t border-hairline bg-surface py-16 sm:py-20 lg:py-24">
        <Container size="wide">
          <RevealOnScroll className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-accent">
                <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
                Newsroom
              </p>
              <h2 id="more-news-title" className="text-h2 font-bold text-fg">
                More From <span className="text-glow">PowerChampions</span>
              </h2>
            </div>
            <Button href="/news" variant="outline" arrow>
              All news
            </Button>
          </RevealOnScroll>
          <RevealGroup as="ul" stagger={0.06} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <RevealItem as="li" key={p.slug} className="[&:nth-child(3)]:sm:max-lg:hidden">
                <NewsCard post={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <CtaBand />
    </main>
  );
}
