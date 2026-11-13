import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Redefining Leadership In Industrial Critical Power — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Redefining Leadership In Industrial Critical Power", "PowerChampions");
}
