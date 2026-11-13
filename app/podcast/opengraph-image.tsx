import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Powered to Win Podcast — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Powered to Win Podcast", "Resources");
}
