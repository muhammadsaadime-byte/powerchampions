import Image from "next/image";
import Link from "next/link";
import { Button, Container, RevealGroup, RevealItem, RevealOnScroll, SectionHeading, VideoFacade } from "@/components/ui";
import { cn } from "@/lib/cn";
import poster from "@/public/images/site/technician-generator-oil-check.jpg";
import { LEADERSHIP as TEAM } from "@/lib/team";

/** Live HubSpot video embedded on the current homepage (SITEMAP.md §4). */
const NETWORK_VIDEO = "https://play-na2.hubspotvideo.com/v/243957939/id/366671083247?loop=true";


const AUDIENCES = ["Team Members", "Market-Partners", "Communities"];

export function Network() {
  return (
    <section id="network" aria-labelledby="network-title" data-tone="dark" className="cv-auto relative isolate overflow-hidden bg-ink-2 py-20 sm:py-24 lg:py-32">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div
        aria-hidden
        className="absolute -right-1/4 top-0 -z-10 size-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgb(234_166_7/0.08),transparent)]"
      />

      <Container size="wide">
        {/* Live heading: "We're Building a Network That Powers What Matters: Team Members, Market-Partners, and Communities" */}
        <RevealOnScroll>
          <SectionHeading
            id="network-title"
            eyebrow="Our network"
            title={
              <>
                We’re Building A Network That <span className="text-glow">Powers What Matters</span>
                <span className="sr-only">: Team Members, Market-Partners, and Communities</span>
              </>
            }
            className="max-w-4xl"
          />
          <ul aria-hidden className="mt-7 flex flex-wrap gap-3">
            {AUDIENCES.map((a) => (
              <li key={a} className="border border-gold/40 bg-gold/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                {a}
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:items-center lg:gap-16">
          <RevealOnScroll className="space-y-6 text-on-dark lg:col-span-5">
            <p className="text-lead">
              We unite independent generator service providers and electrical contractors under one trusted banner — empowering them to grow with
              confidence while preserving their local identities.
            </p>
            <p>
              Every technician, manager, and market-partner in our network plays a critical role in delivering backup power that protects people,
              enables progress, and delivers peace of mind.
            </p>
            <p className="border-l-2 border-gold pl-5 text-white">
              PowerChampions was built to help strong companies grow further. We recognize the work, pride, and commitment it takes to build a
              successful business. Our partnership model preserves your brand and leadership, while providing access to national expertise, capital
              and operational support.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
              <Button href="/contact-us" size="lg">
                Partner With Us
              </Button>
              <Button href="/who-we-are#PowerChampions-Team" variant="ghost" arrow>
                Meet the team
              </Button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="lg:col-span-7">
            <VideoFacade
              src={NETWORK_VIDEO}
              title="PowerChampions: building a network that powers what matters"
              poster={poster}
              posterAlt="A PowerChampions technician checks the oil level on a commercial generator"
              label="Inside the PowerChampions network"
            />
          </RevealOnScroll>
        </div>

        {/* Leadership strip */}
        <div className="mt-20 lg:mt-28">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h3 className="text-h3 font-bold">The PowerChampions Leadership Team</h3>
            <Link
              href="/who-we-are#PowerChampions-Team"
              className="text-sm font-bold uppercase tracking-[0.12em] text-white underline-offset-4 hover:text-gold hover:underline"
            >
              Full team &amp; advisory board →
            </Link>
          </div>

          {/* Phones: swipeable row with snap. Desktop: one 8-up grid. */}
          <RevealGroup
            as="ul"
            stagger={0.06}
            className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:scroll-px-6 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 xl:mx-0 xl:grid-cols-8 xl:px-0"
          >
            {TEAM.map((p) => (
              <RevealItem as="li" key={p.name} className="w-[44vw] max-w-56 shrink-0 snap-start md:w-auto md:max-w-none">
                <figure className="group/person">
                  <div className="relative aspect-[4/5] overflow-hidden border border-hairline bg-mist">
                    <Image
                      src={p.photo}
                      alt="" // the figcaption below names the person; alt text would repeat it
                      fill
                      sizes="(min-width: 1280px) 170px, (min-width: 768px) 24vw, 44vw"
                      quality={70}
                      className={cn(
                        "object-cover object-top grayscale transition-[filter,transform] duration-700 ease-out-expo group-hover/person:grayscale-0",
                        p.crop,
                      )}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold to-orange transition-transform duration-500 group-hover/person:scale-x-100"
                    />
                  </div>
                  <figcaption className="mt-3">
                    <span className="block text-sm font-bold text-white">{p.name}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-on-dark-muted">{p.title}</span>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
