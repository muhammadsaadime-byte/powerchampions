import { SITE_URL } from "@/lib/site";

/**
 * FAQ accordion on native <details>/<summary>: keyboard and screen-reader support for free, no JS.
 * Emits FAQPage JSON-LD (eligible for rich results).
 */
export function Faq({ items, pageUrl }: { items: Array<{ q: string; a: string }>; pageUrl: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: SITE_URL + pageUrl,
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {items.map((item) => (
        <details key={item.q} className="group/faq">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left text-lg font-bold text-fg transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            {item.q}
            <span aria-hidden className="relative mt-1.5 size-4 shrink-0 transition-transform duration-300 group-open/faq:rotate-45">
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-gold" />
              <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-gold" />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-on-dark">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
