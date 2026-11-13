import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Sell Your Business To A Strategic Partner — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Sell Your Business To A Strategic Partner", "Market partners");
}
