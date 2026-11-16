import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Container, GridBackground } from "@/components/ui";
import { SOCIAL } from "@/lib/nav";
import logo from "@/public/images/site/powerchampions-logo-trim.svg";
import egsa from "@/public/images/site/egsa-logo.jpg";
import flag from "@/public/images/site/american-flag.jpg";

/** Footer link columns. "Quick Links" mirrors the live footer; the rest mirror the live header menus. */
const COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Who We Are", href: "/who-we-are" },
      { label: "Market-Partners", href: "/partners" },
      { label: "Our Team", href: "/who-we-are#PowerChampions-Team" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact-us" },
      { label: "Locations", href: "/locations" },
    ],
  },
  {
    title: "Generator Services",
    links: [
      { label: "Backup Power Centers", href: "/backup-power-centers" },
      { label: "Data Center Solutions", href: "/data-center-solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "News", href: "/news" },
      { label: "Blogs", href: "/blogs" },
      { label: "Podcast", href: "/podcast" },
    ],
  },
];

const DEPOTS = [
  { name: "PowerChampions of Greenville", address: "175 Brookshire Rd, Greer, SC 29651", href: "https://www.greenville.power-champions.com/" },
  { name: "Triple T Critical Power Services", address: "1530 Airport Road, Sumter, SC 29153", href: "https://tripletpower.com/" },
  { name: "PowerChampions of Georgia", address: "3043 Braselton Hwy, Dacula, GA 30019", href: "https://atlanta.power-champions.com/" },
];

/** Cache Components: `new Date()` must be cached; the year is prerendered and refreshed daily. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const heading = "mb-5 text-eyebrow font-bold uppercase text-accent";
const link = "text-sm text-on-dark transition-colors hover:text-accent";

export function SiteFooter() {
  return (
    <footer aria-labelledby="footer-title" data-tone="dark" data-scheme="dark" className="cv-auto relative isolate overflow-hidden border-t border-hairline bg-page pt-20">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <GridBackground fade="bottom" glow={false} animated={false} />

      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-12 xl:col-span-4">
            <Link href="/" aria-label="PowerChampions home" className="inline-block">
              <Image src={logo} alt="PowerChampions" className="h-16 w-auto sm:h-20" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-on-dark">
              PowerChampions is redefining industrial critical power through servant leadership, integrity, and a trusted national network of
              partners.
            </p>
            <p className="mt-6 text-lg font-bold text-fg">
              Your Power. <span className="text-glow">Our Mission.</span>
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a href="https://egsa.org/" target="_blank" rel="noopener noreferrer" className="block bg-white p-1.5 transition-shadow hover:shadow-glow-soft">
                <Image src={egsa} alt="EGSA member: Electrical Generating Systems Association (opens in a new tab)" height={48} sizes="64px" className="h-12 w-auto" />
              </a>
              <Image src={flag} alt="American flag" height={48} sizes="84px" className="h-12 w-auto border border-hairline" />
            </div>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 xl:col-span-5">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className={heading}>{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={link}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Locations + social */}
          <div className="lg:col-span-5 xl:col-span-3">
            <p className={heading}>Service Locations</p>
            <ul className="space-y-5">
              {DEPOTS.map((d) => (
                <li key={d.href}>
                  <a href={d.href} target="_blank" rel="noopener noreferrer" className="group/depot block">
                    <span className="block text-sm font-bold text-fg group-hover/depot:text-accent">{d.name} ↗</span>
                    <span className="mt-1 block text-xs leading-relaxed text-on-dark-muted">{d.address}</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className={`${heading} mt-10`}>Connect With Us</p>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center border border-hairline text-fg transition-[border-color,color,box-shadow] hover:border-gold hover:text-accent hover:shadow-glow-soft"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm7 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
              </svg>
              <span className="sr-only">PowerChampions on LinkedIn (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-hairline py-8 text-xs text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> PowerChampions. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy-policy" className="hover:text-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-accent">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
