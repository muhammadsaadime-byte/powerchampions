import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Blogs — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Blogs", "Resources");
}
