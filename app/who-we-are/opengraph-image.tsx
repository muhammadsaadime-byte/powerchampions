import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Who We Are — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Who We Are", "People-first critical power");
}
