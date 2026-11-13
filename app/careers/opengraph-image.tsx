import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Your career in critical power starts here. — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Your career in critical power starts here.", "Careers");
}
