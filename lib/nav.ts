import type { StaticImageData } from "next/image";
import backupPowerImg from "@/public/images/site/generator-load-bank-test-greenville-depot.jpg";
import dataCenterImg from "@/public/images/site/data-center.webp";

/**
 * Site navigation — mirrors the live power-champions.com header (see SITEMAP.md §2).
 * Copy below is taken from the live pages (content/*.md), not invented.
 */

export type NavLink = { label: string; href: string; description?: string };

export type MegaService = NavLink & { description: string; image: StaticImageData; imageAlt: string };

export type NavItem =
  | { kind: "link"; label: string; href: string }
  /** A page link that also has a small dropdown (e.g. Who We Are → Our Team). */
  | { kind: "dropdown"; label: string; href?: string; children: NavLink[] }
  | { kind: "mega"; label: string; services: MegaService[]; locations: Array<NavLink & { place: string }> };

export const NAV: NavItem[] = [
  {
    kind: "dropdown",
    label: "Who We Are",
    href: "/who-we-are",
    children: [
      { label: "Who We Are", href: "/who-we-are", description: "Our vision, mission and the values behind the network." },
      { label: "Our Team", href: "/who-we-are#PowerChampions-Team", description: "The leaders building PowerChampions." },
    ],
  },
  { kind: "link", label: "Market-Partners", href: "/partners" },
  {
    kind: "dropdown",
    label: "Resources",
    children: [
      { label: "News", href: "/news", description: "Announcements, partnerships and press releases." },
      { label: "Blogs", href: "/blogs", description: "Leadership, the trades and the future of critical power." },
      { label: "Podcast", href: "/podcast", description: "Powered to Win — conversations from across the industry." },
    ],
  },
  { kind: "link", label: "Careers", href: "/careers" },
  {
    kind: "mega",
    label: "Generator Services",
    services: [
      {
        label: "Backup Power Centers",
        href: "/backup-power-centers",
        description:
          "Comprehensive critical power services across the Southeast — generator maintenance, turnkey installation, rentals, compliance, and 24/7 emergency response.",
        image: backupPowerImg,
        imageAlt: "Load bank connected to a mobile generator at the PowerChampions Greenville depot",
      },
      {
        label: "Data Center Solutions",
        href: "/data-center-solutions",
        description: "Powering critical infrastructure with discipline, speed, and accountability.",
        image: dataCenterImg,
        imageAlt: "Rows of server racks inside a data center",
      },
    ],
    locations: [
      { label: "PowerChampions of Greenville", href: "https://www.greenville.power-champions.com/", place: "Greer, SC" },
      { label: "Triple T Critical Power Services", href: "https://tripletpower.com/", place: "Sumter, SC" },
      { label: "PowerChampions of Georgia", href: "https://atlanta.power-champions.com/", place: "Dacula, GA" },
    ],
  },
  { kind: "link", label: "Locations", href: "/locations" },
  { kind: "link", label: "Contact", href: "/contact-us" },
];

/** Live site: "Partner with Us" goes to the contact page. */
export const NAV_CTA: NavLink = { label: "Partner With Us", href: "/contact-us" };

export const SOCIAL = { linkedin: "https://www.linkedin.com/company/power-champions" };

/** Is `href` the current page (or a parent section of it)? Hash links never count as active. */
export function isActive(pathname: string, href?: string) {
  if (!href || href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function isItemActive(pathname: string, item: NavItem) {
  if (item.kind === "link") return isActive(pathname, item.href);
  if (item.kind === "dropdown") return isActive(pathname, item.href) || item.children.some((c) => isActive(pathname, c.href));
  return item.services.some((s) => isActive(pathname, s.href));
}
