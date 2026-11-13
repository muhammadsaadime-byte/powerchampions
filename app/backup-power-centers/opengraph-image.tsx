import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Backup Power Centers — PowerChampions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Backup Power Centers", "Generator services");
}
