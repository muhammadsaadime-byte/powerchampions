import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Network Of Trusted Brands — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Network Of Trusted Brands", "Locations");
}
