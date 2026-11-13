import { cn } from "@/lib/cn";

/**
 * Stylised dot-matrix map of the contiguous United States — no map library, no tiles.
 * Each row lists the longitude ranges of land at that latitude (1° grid, hand-traced).
 * All dots are one SVG <path> (round-capped zero-length segments), so ~1,000 dots = 1 DOM node.
 */
const LAND: Record<number, Array<[number, number]>> = {
  49: [[-123, -95]],
  48: [[-124, -89], [-69, -67]],
  47: [[-124, -84], [-70, -67]],
  46: [[-124, -84], [-74, -67]],
  45: [[-124, -83], [-76, -67]],
  44: [[-124, -87], [-85, -82], [-79, -69]],
  43: [[-124, -87], [-86, -83], [-80, -70]],
  42: [[-124, -71]],
  41: [[-124, -70]],
  40: [[-124, -73]],
  39: [[-123, -74]],
  38: [[-123, -75]],
  37: [[-122, -75]],
  36: [[-121, -75]],
  35: [[-120, -76]],
  34: [[-119, -77]],
  33: [[-117, -79]],
  32: [[-115, -80]],
  31: [[-111, -81]],
  30: [[-104, -81]],
  29: [[-103, -95], [-91, -89], [-83, -81]],
  28: [[-100, -96], [-83, -80]],
  27: [[-99, -97], [-82, -80]],
  26: [[-98, -97], [-82, -80]],
  25: [[-81, -80]],
};

const LON0 = -125;
const LAT0 = 50;
const KX = 0.8; // ≈ cos(37°): keeps the map from looking stretched sideways
export const MAP_W = 59 * KX;
export const MAP_H = 26;

/** Project lon/lat to the map's coordinate space (also used to place HTML markers as %). */
export function project(lat: number, lon: number) {
  return { x: (lon - LON0) * KX, y: LAT0 - lat };
}

/** The Southeast (where the network operates today) is drawn brighter. */
const isSoutheast = (lat: number, lon: number) => lat <= 37 && lat >= 30 && lon >= -91 && lon <= -75;

function dots(filter: (lat: number, lon: number) => boolean) {
  let d = "";
  for (const [latStr, ranges] of Object.entries(LAND)) {
    const lat = Number(latStr);
    for (const [a, b] of ranges)
      for (let lon = a; lon <= b; lon++) {
        if (!filter(lat, lon)) continue;
        const { x, y } = project(lat, lon);
        d += `M${x.toFixed(2)} ${y}h0`;
      }
  }
  return d;
}

const ALL = dots((lat, lon) => !isSoutheast(lat, lon));
const SE = dots(isSoutheast);

export function UsDotMap({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox={`-1 -1 ${MAP_W + 2} ${MAP_H + 2}`} className={cn("h-full w-full", className)}>
      <path d={ALL} stroke="rgb(255 255 255 / 0.16)" strokeWidth="0.42" strokeLinecap="round" />
      <path d={SE} stroke="rgb(234 166 7 / 0.55)" strokeWidth="0.46" strokeLinecap="round" />
    </svg>
  );
}
