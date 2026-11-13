import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Data Center Solutions — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Data Center Solutions", "Generator services");
}
