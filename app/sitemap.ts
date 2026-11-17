import type { MetadataRoute } from "next";
import { NEWS } from "@/lib/news";
import { SITE_URL } from "@/lib/site";

const ROUTES: Array<[string, number]> = [
  ["/", 1],
  ["/who-we-are", 0.8],
  ["/partners", 0.9],
  ["/careers", 0.8],
  ["/contact-us", 0.8],
  ["/locations", 0.8],
  ["/backup-power-centers", 0.9],
  ["/data-center-solutions", 0.9],
  ["/blogs", 0.6],
  ["/news", 0.6],
  ["/podcast", 0.6],
  ["/privacy-policy", 0.2],
  ["/terms-conditions", 0.2],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...ROUTES.map(([path, priority]) => ({ url: `${SITE_URL}${path === "/" ? "" : path}`, priority })),
    ...NEWS.map((p) => ({ url: `${SITE_URL}/news/${p.slug}`, lastModified: p.date, priority: 0.5 })),
  ];
}
