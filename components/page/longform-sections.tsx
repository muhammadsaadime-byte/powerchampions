import { Markdown } from "@/components/page/markdown";
import { RevealOnScroll } from "@/components/ui";
import { cn } from "@/lib/cn";

type Part = { eyebrow?: string; title: string; body: string };

/** Split copy at its ##/### headings. A lone ###### line right before a heading becomes that section's eyebrow. */
export function splitSections(md: string): Part[] {
  const parts: Part[] = [];
  let pendingEyebrow: string | undefined;
  for (const chunk of md.split(/^(?=#{2,3} )/m)) {
    const m = chunk.match(/^#{2,3} (.*)\n?([\s\S]*)$/);
    if (!m) continue;
    let body = m[2].trim();
    const trailing = body.match(/\n?#{5,6} ([^\n]+)\s*$/);
    let nextEyebrow: string | undefined;
    if (trailing) {
      nextEyebrow = trailing[1].trim();
      body = body.slice(0, trailing.index).trim();
    }
    parts.push({ eyebrow: pendingEyebrow, title: m[1].replace(/\*\*/g, "").trim(), body });
    pendingEyebrow = nextEyebrow;
  }
  return parts;
}

/**
 * Editorial long-form layout for service pages: alternating dark sections,
 * sticky title column on desktop, copy rendered from the live page content.
 */
export function LongformSections({ parts }: { parts: Part[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <section
          key={p.title}
          aria-labelledby={`lf-${i}`}
          data-tone="dark"
          className={cn("cv-auto relative isolate border-t border-hairline py-16 sm:py-20 lg:py-24", i % 2 ? "bg-surface" : "bg-page")}
        >
          <div className="mx-auto grid w-full max-w-[1520px] gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
            <RevealOnScroll className="lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--pc-header-h)+2rem)]">
                <p className="mb-4 inline-flex items-center gap-3 text-eyebrow font-bold uppercase text-accent">
                  <span aria-hidden className="h-px w-8 bg-gradient-to-r from-gold to-orange" />
                  {p.eyebrow ?? String(i + 1).padStart(2, "0")}
                </p>
                <h2 id={`lf-${i}`} className="text-h2 font-bold text-fg">
                  {p.title}
                </h2>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.08} className="lg:col-span-7">
              <Markdown md={p.body} headingOffset={-1} className="text-on-dark [&_h3]:text-fg [&_h4]:text-fg" />
            </RevealOnScroll>
          </div>
        </section>
      ))}
    </>
  );
}
