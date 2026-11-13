import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { PageHero } from "@/components/page/page-hero";
import { PostListing } from "@/components/page/post-listing";

export const metadata: Metadata = {
  title: "News and Resources",
  description: "PowerChampions news: partnerships, new locations, conference appearances, and press releases from across our critical power network.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[{ label: "Resources", href: "/news" }, { label: "News", href: "/news" }]}
        eyebrow="Resources"
        title="News and Resources"
        intro="Announcements, partnerships and press releases."
      />
      <PostListing kind="news" />
      <CtaBand />
    </main>
  );
}
