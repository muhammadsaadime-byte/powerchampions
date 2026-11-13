import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Let’s Talk Partnership, Growth, and Opportunity — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Let’s Talk Partnership, Growth, and Opportunity", "Contact");
}
