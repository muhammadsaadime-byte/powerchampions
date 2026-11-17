import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { getPost } from "@/lib/news";

export const alt = "PowerChampions news";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  const title = post?.title ?? "News";
  return renderOg(title.length > 84 ? title.slice(0, 82).trimEnd() + "…" : title, "News");
}
