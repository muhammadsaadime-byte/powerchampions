import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatDate, readMinutes, type Block, type NewsPost } from "@/lib/news";

/** Shared pieces of the newsroom: the listing (/news) and the article (/news/<slug>). */

const CORNERS = ["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"];

/** Gold corner brackets, the same framing device the 3D stages use. */
export function Brackets({ className = "size-5" }: { className?: string }) {
  return (
    <>
      {CORNERS.map((pos) => (
        <span key={pos} aria-hidden className={cn("pointer-events-none absolute z-10 border-gold/70", className, pos)} />
      ))}
    </>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 border border-gold/50 bg-gold/[0.08] px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-accent">
      <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
      {children}
    </span>
  );
}

export function PostMeta({ post, className }: { post: NewsPost; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.14em] text-on-dark-muted", className)}>
      <Tag>{post.tag}</Tag>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden className="size-1 rotate-45 bg-gold" />
      <span>{readMinutes(post)} min read</span>
    </p>
  );
}

/**
 * Post image in a fixed frame. Photos are cropped to fill it; graphics with baked-in text ("contain")
 * sit whole over a blurred copy of themselves so the frame is never letterboxed with flat colour.
 */
export function PostImage({
  post,
  sizes,
  priority = false,
  className,
  zoom = false,
}: {
  post: NewsPost;
  sizes: string;
  priority?: boolean;
  className?: string;
  zoom?: boolean;
}) {
  const contain = post.fit === "contain";
  return (
    <div className={cn("relative isolate overflow-hidden bg-surface", className)}>
      {contain && <Image src={post.image} alt="" fill sizes="64px" quality={60} className="-z-10 scale-125 object-cover opacity-50 blur-2xl" />}
      <Image
        src={post.image}
        alt={priority ? post.imageAlt : ""}
        fill
        sizes={sizes}
        quality={70}
        {...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
        className={cn(
          contain ? "object-contain" : cn("object-cover", post.focus),
          zoom && "transition-transform duration-700 ease-out-expo group-hover/post:scale-105",
        )}
      />
    </div>
  );
}

/** Listing card. The whole card is one link (stretched), so only the title is announced. */
export function NewsCard({ post, index, total }: { post: NewsPost; index?: number; total?: number }) {
  return (
    <article
      aria-labelledby={`post-${post.slug}`}
      className="group/post relative isolate flex h-full flex-col overflow-hidden border border-hairline bg-surface transition-[border-color,box-shadow,transform] duration-500 hover:border-gold/50 hover:shadow-glow-soft motion-safe:hover:-translate-y-1"
    >
      <div className="relative">
        <PostImage post={post} zoom sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10]" />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(16_16_16/0.55))]" />
        {index !== undefined && total !== undefined && (
          <span aria-hidden data-scheme="dark" className="absolute bottom-4 left-5 text-xs font-bold tracking-[0.2em] text-fg">
            0{index} / 0{total}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <PostMeta post={post} />
        <h3 id={`post-${post.slug}`} className="mt-4 text-xl font-bold leading-snug text-fg">
          <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0 group-hover/post:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-on-dark">{post.description}</p>
        <span aria-hidden className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold uppercase tracking-[0.12em] text-fg group-hover/post:text-accent">
          Read the story
          <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-300 ease-out-expo group-hover/post:translate-x-1">
            <path d="M1 8h12M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
          </svg>
        </span>
      </div>
    </article>
  );
}

/** `**bold**` → <strong>; email addresses → mailto links. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 ? (
          <strong key={i} className="font-bold text-fg">
            {part}
          </strong>
        ) : (
          part.split(/([\w.+-]+@[\w-]+\.[\w.-]*\w)/).map((s, j) =>
            j % 2 ? (
              <a key={`${i}-${j}`} href={`mailto:${s}`} className="font-bold text-accent underline underline-offset-4 hover:no-underline">
                {s}
              </a>
            ) : (
              s
            ),
          )
        ),
      )}
    </>
  );
}

/** Long-form article copy. The first paragraph is set as a lead. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[1.0625rem] leading-[1.8] text-on-dark">
      {blocks.map((b, i) => {
        if (b.type === "h")
          return (
            <h2 key={i} className="mb-4 mt-12 flex items-center gap-4 text-h3 font-bold text-fg first:mt-0">
              <span aria-hidden className="h-6 w-1 shrink-0 bg-gradient-to-b from-gold to-orange" />
              {b.text}
            </h2>
          );
        if (b.type === "ul")
          return (
            <ul key={i} className="my-6 grid gap-2.5 sm:grid-cols-2">
              {b.items.map((item) => (
                <li key={item} className="flex items-start gap-3 border border-hairline bg-fg/[0.03] px-4 py-3 text-[0.9375rem] leading-snug text-fg">
                  <svg aria-hidden viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 text-accent">
                    <path d="M2.5 8.5 6.5 12l7-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          );
        if (b.type === "callout")
          return (
            <p key={i} className="relative my-10 border border-gold/40 bg-gold/[0.06] px-6 py-6 text-xl font-medium leading-snug text-fg sm:px-8 sm:text-2xl">
              <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-gold to-orange" />
              <Inline text={b.text} />
            </p>
          );
        return (
          <p key={i} className={cn("mt-5 first:mt-0", i === 0 && "text-lead font-medium leading-relaxed text-fg")}>
            <Inline text={b.text} />
          </p>
        );
      })}
    </div>
  );
}
