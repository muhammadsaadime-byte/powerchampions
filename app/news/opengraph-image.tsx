import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "News and Resources — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("News and Resources", "Newsroom");
}
