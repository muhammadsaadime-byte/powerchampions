import Image from "next/image";
import posts from "@/lib/posts.json";
import { RevealGroup, RevealItem, RevealOnScroll, Section } from "@/components/ui";
import { POSTS_BASE } from "@/lib/site";

type Kind = "blogs" | "news" | "podcast";
type Post = (typeof posts)[number];

const fmt = (d: string | null) =>
  d ? new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : "";

/** Posts are not rebuilt (scope): links go to the post's current home via POSTS_BASE (see lib/site.ts). */
const href = (p: Post) => `${POSTS_BASE}/${p.kind}/${p.slug}`;

function Meta({ p }: { p: Post }) {
  return (
    <p className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-on-dark-muted">
      {p.date && <time dateTime={p.date}>{fmt(p.date)}</time>}
      {p.youtubeId && (
        <>
          <span aria-hidden className="size-1 rotate-45 bg-gold" />
          <span className="text-gold">Video episode</span>
        </>
      )}
    </p>
  );
}

function Card({ p, featured = false }: { p: Post; featured?: boolean }) {
  return (
    <article
      aria-labelledby={`post-${p.slug}`}
      className={`group/post relative isolate flex h-full flex-col overflow-hidden border border-hairline bg-ink-2 transition-[border-color,box-shadow] duration-500 hover:border-gold/50 hover:shadow-glow-soft ${featured ? "lg:grid lg:grid-cols-2" : ""}`}
    >
      <div className={`relative overflow-hidden bg-ink ${featured ? "aspect-video lg:aspect-auto lg:min-h-[24rem]" : "aspect-video"}`}>
        {p.image && (
          <Image
            src={p.image}
            alt=""
            fill
            sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            quality={65}
            // The featured card is the LCP element on listing pages.
            {...(featured ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
            className="object-cover transition-transform duration-700 ease-out-expo group-hover/post:scale-105"
          />
        )}
        {p.youtubeId && (
          <span aria-hidden className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ink shadow-glow">
            <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor">
              <path d="M7 4.5v15l13-7.5-13-7.5Z" />
            </svg>
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${featured ? "sm:p-10 lg:justify-center" : ""}`}>
        <Meta p={p} />
        <h2 id={`post-${p.slug}`} className={`mt-3 font-bold text-white ${featured ? "text-h2" : "text-lg leading-snug"}`}>
          {/* Stretched link: the whole card is clickable, but only one link is announced. */}
          <a href={href(p)} className="after:absolute after:inset-0 group-hover/post:text-gold">
            {p.title}
          </a>
        </h2>
        {p.description && <p className={`mt-3 text-sm leading-relaxed text-on-dark ${featured ? "sm:text-base" : "line-clamp-3"}`}>{p.description}</p>}
        <span aria-hidden className="mt-auto pt-6 text-sm font-bold uppercase tracking-[0.12em] text-white group-hover/post:text-gold">
          {p.youtubeId ? "Watch the episode →" : "Read more →"}
        </span>
        {p.youtubeId && (
          <a
            href={`https://www.youtube.com/watch?v=${p.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 mt-3 self-start text-xs font-medium uppercase tracking-[0.14em] text-on-dark-muted underline-offset-4 hover:text-gold hover:underline"
          >
            Open on YouTube ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}

export function PostListing({ kind }: { kind: Kind }) {
  const list = posts.filter((p) => p.kind === kind);
  const [first, ...rest] = list;
  return (
    <Section tone="ink" container="wide" spacing="sm" aria-label={`${list.length} posts`} className="pt-0 sm:pt-0 lg:pt-0">
      {first && (
        <RevealOnScroll>
          <Card p={first} featured />
        </RevealOnScroll>
      )}
      <RevealGroup as="ul" stagger={0.05} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <RevealItem as="li" key={p.slug}>
            <Card p={p} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
