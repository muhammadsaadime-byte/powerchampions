import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { PageHero } from "@/components/page/page-hero";
import { PostListing } from "@/components/page/post-listing";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Insights from PowerChampions on servant leadership, the skilled trades, technician retention, and the future of critical power.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero
        crumbs={[{ label: "Resources", href: "/blogs" }, { label: "Blogs", href: "/blogs" }]}
        eyebrow="Resources"
        title="Blogs"
        intro="Leadership, the trades and the future of critical power."
      />
      <PostListing kind="blogs" />
      <CtaBand />
    </main>
  );
}
