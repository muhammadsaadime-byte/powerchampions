"use client";

import Image, { type StaticImageData } from "next/image";
import { useId, useState } from "react";
import { Container, RevealOnScroll, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import tony from "@/public/images/site/tony-truett.png";
import jim from "@/public/images/site/jim-probst.png";
import tim from "@/public/images/site/tim-hanlon.png";

/** Verbatim from the live homepage (content/home.md). */
const QUOTES: Array<{ quote: string; name: string; role: string; photo: StaticImageData }> = [
  {
    quote:
      "Ashish and the PowerChampions team stood behind every commitment they made. They made the transition seamless, strengthened our business with better systems and resources, and delivered improved benefits and pay for our employees from day one. Most importantly, they honored the legacy of Triple T while positioning us for long-term growth. I couldn't have asked for a better partner.",
    name: "Tony Truett",
    role: "Founder, Triple T Critical Power Services",
    photo: tony,
  },
  {
    quote:
      "I had the pleasure of meeting Ashish while we were looking for a partner to help us grow and scale our business. I was immediately drawn to him because of his passion for developing people, his dedication to driving the highest levels of customer service, and his commitment to changing the industry for the better. Ashish is a visionary who has dedicated his life’s mission to providing better opportunities for the skilled trades, using technology and training. He has enriched my life and has made me a better person.",
    name: "Jim Probst",
    role: "Former Owner of George Brazil Heating & Air Conditioning",
    photo: jim,
  },
  {
    quote:
      "I decided to partner with Ashish and his organization because of his strong vision and people-centric leadership approach. Ashish has a great entrepreneurial mind: he knows how to craft unique strategies and demonstrates honest endeavors in executing toward those goals. I have thoroughly enjoyed my business partnership with Ashish.",
    name: "Tim Hanlon",
    role: "Former Owner of Grogg’s Home Services",
    photo: tim,
  },
];

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={cn("size-4", dir === "prev" && "rotate-180")}>
      <path d="M1 8h12M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Accessible testimonial slider (WAI-ARIA carousel pattern, no autoplay).
 * All slides share one grid cell, so the box is always as tall as the longest quote: no layout shift.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const id = useId();
  const go = (d: number) => setIndex((i) => (i + d + QUOTES.length) % QUOTES.length);

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" data-tone="dark" className="cv-auto relative isolate overflow-hidden bg-page py-20 sm:py-24 lg:py-32">
      <span aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -z-10 -translate-x-1/2 select-none text-[22rem] font-bold leading-none text-fg/[0.025]">
        “
      </span>
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12">
          <RevealOnScroll className="lg:col-span-4">
            <SectionHeading
              id="testimonials-title"
              eyebrow="Testimonials"
              title="What Our Partners Say"
              intro="Our partners are at the heart of PowerChampions, and their experiences tell the real story of the platform we’re building. Here’s what they have to say about growing, leading, and succeeding with us."
            />
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="lg:col-span-8">
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Partner testimonials"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(1);
                if (e.key === "ArrowLeft") go(-1);
              }}
              className="border border-hairline bg-fg/[0.03] p-6 sm:p-10 lg:p-14"
            >
              <div className="grid" aria-live="polite">
                {QUOTES.map((q, i) => {
                  const active = i === index;
                  return (
                    <figure
                      key={q.name}
                      id={`${id}-slide-${i}`}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} of ${QUOTES.length}`}
                      aria-hidden={!active}
                      inert={!active}
                      className={cn(
                        "col-start-1 row-start-1 transition-[opacity,transform] duration-700 ease-out-expo",
                        active ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0",
                      )}
                    >
                      <svg aria-hidden viewBox="0 0 48 36" className="mb-6 h-8 w-auto text-accent">
                        <path
                          fill="currentColor"
                          d="M0 36V20.6C0 8.9 6.3 2 18.9 0l1.8 4.6C14 6.4 10.6 10.1 10.3 15.6H19V36H0Zm28.9 0V20.6C28.9 8.9 35.2 2 47.8 0l1.8 4.6c-6.7 1.8-10.1 5.5-10.4 11H48V36H28.9Z"
                        />
                      </svg>
                      <blockquote className="text-lg font-medium leading-relaxed text-fg sm:text-xl lg:text-[1.375rem]">
                        <p>{q.quote}</p>
                      </blockquote>
                      <figcaption className="mt-8 flex items-center gap-4">
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-gold">
                          <Image src={q.photo} alt="" fill sizes="56px" className="object-cover" />
                        </span>
                        <span>
                          <span className="block font-bold text-fg">{q.name}</span>
                          <span className="block text-sm text-on-dark-muted">{q.role}</span>
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              <div className="mt-10 flex items-center justify-between gap-6 border-t border-hairline pt-6">
                <div className="flex items-center gap-2" role="group" aria-label="Choose a testimonial">
                  {QUOTES.map((q, i) => (
                    <button
                      key={q.name}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show testimonial from ${q.name}`}
                      aria-current={i === index ? "true" : undefined}
                      aria-controls={`${id}-slide-${i}`}
                      className="group/dot flex h-11 items-center px-1"
                    >
                      <span
                        className={cn(
                          "block h-0.5 transition-all duration-500 ease-out-expo",
                          i === index ? "w-10 bg-gold shadow-[0_0_8px_rgb(234_166_7/0.8)]" : "w-5 bg-fg/30 group-hover/dot:bg-fg/60",
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-xs font-bold tracking-[0.2em] text-on-dark-muted" aria-hidden>
                    0{index + 1} / 0{QUOTES.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  {(["prev", "next"] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => go(dir === "prev" ? -1 : 1)}
                      aria-label={dir === "prev" ? "Previous testimonial" : "Next testimonial"}
                      className="flex size-12 items-center justify-center border border-hairline text-fg transition-[border-color,color,box-shadow] duration-300 hover:border-gold hover:text-accent hover:shadow-glow-soft"
                    >
                      <Arrow dir={dir} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
