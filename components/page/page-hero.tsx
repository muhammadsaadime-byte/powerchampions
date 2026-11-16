import { getImageProps, type StaticImageData } from "next/image";
import Link from "next/link";
import { Container, EnergyLines, GridBackground } from "@/components/ui";
import { cn } from "@/lib/cn";
import { SITE_URL } from "@/lib/site";

const EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

type Crumb = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  image?: StaticImageData;
  imageAlt?: string;
  /** Breadcrumb trail after Home (last item = this page). Also emitted as BreadcrumbList JSON-LD. */
  crumbs: Crumb[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * Inner-page hero: dark, grid + energy lines, optional photo washed to the right.
 * Entrance is CSS-only (same reasoning as the homepage hero: the title is the LCP element).
 */
export function PageHero({ eyebrow, title, intro, image, imageAlt = "", crumbs, actions, children }: Props) {
  const trail = [{ label: "Home", href: "/" }, ...crumbs];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: SITE_URL + c.href })),
  };

  const photo = image
    ? getImageProps({ src: image, alt: imageAlt, sizes: "100vw", quality: 60 }).props
    : null;

  return (
    <section data-scheme="dark" className="relative isolate overflow-hidden bg-page pb-16 pt-[calc(var(--pc-header-h)+3.5rem)] sm:pb-20 lg:pb-28 lg:pt-[calc(var(--pc-header-h)+5rem)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {photo && (
        <>
          {/* Phones get a text-first hero: there the photo sat under an ~85% ink wash, added little, and was
              the LCP element painting after hydration (~3s on throttled mobile). The <source> only matches
              from md up, and the fallback <img> is a hidden empty GIF, so phones never download the photo. */}
          <picture>
            <source media="(min-width: 768px)" srcSet={photo.srcSet} sizes="100vw" />
            <img
              src={EMPTY_GIF}
              alt={imageAlt}
              width={photo.width}
              height={photo.height}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 -z-30 hidden size-full animate-hero-settle object-cover object-center md:block"
            />
          </picture>
          <div
            aria-hidden
            className="absolute inset-0 -z-20 hidden md:block md:bg-[linear-gradient(90deg,rgb(16_16_16/0.97)_0%,rgb(16_16_16/0.85)_45%,rgb(16_16_16/0.45)_100%),linear-gradient(180deg,transparent_60%,#101010)]"
          />
          <div
            aria-hidden
            className="absolute -right-1/3 top-0 -z-20 size-[90vw] rounded-full bg-[radial-gradient(closest-side,rgb(234_166_7/0.14),transparent)] md:hidden"
          />
        </>
      )}
      <GridBackground fade="center" glow={!image} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[80svh]">
        <EnergyLines intensity={0.7} />
      </div>

      <Container size="wide">
        <nav aria-label="Breadcrumb" className="mb-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <ol className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-on-dark-muted">
            {trail.map((c, i) => (
              <li key={c.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-accent">/</span>}
                {i < trail.length - 1 ? (
                  <Link href={c.href} className="hover:text-accent">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-fg">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className={cn("max-w-4xl", image && "lg:max-w-3xl")}>
          {eyebrow && (
            <p className="mb-5 inline-flex animate-fade-up items-center gap-3 text-eyebrow font-bold uppercase text-accent" style={{ animationDelay: "0.1s" }}>
              <span aria-hidden className="h-px w-10 bg-gradient-to-r from-gold to-orange" />
              {eyebrow}
            </p>
          )}
          <h1 className="animate-fade-up text-h1 font-bold text-fg" style={{ animationDelay: "0.15s" }}>
            {title}
          </h1>
          {intro && (
            <div className="mt-6 max-w-2xl animate-fade-up text-lead text-on-dark" style={{ animationDelay: "0.3s" }}>
              {intro}
            </div>
          )}
          {actions && (
            <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-4" style={{ animationDelay: "0.45s" }}>
              {actions}
            </div>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
}
