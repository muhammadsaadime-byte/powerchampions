import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { PageHero } from "@/components/page/page-hero";
import { PostListing } from "@/components/page/post-listing";

export const metadata: Metadata = {
  title: "Podcast: Powered to Win",
  description: "Powered to Win, the PowerChampions podcast: conversations on leadership, the skilled trades, generator technology, and the future of critical power.",
  alternates: { canonical: "/podcast" },
};

export default function PodcastPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[{ label: "Resources", href: "/podcast" }, { label: "Podcast", href: "/podcast" }]}
        eyebrow="Powered to Win"
        title="Podcast"
        intro="Powered to Win — conversations from across the industry."
      />
      <PostListing kind="podcast" />
      <CtaBand />
    </main>
  );
}
