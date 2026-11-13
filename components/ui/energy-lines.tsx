import { cn } from "@/lib/cn";
import { AnimateWhenVisible } from "./animate-when-visible";

/**
 * Circuit traces in a 1440×800 design space. Each one runs in from a frame edge with 45° bends,
 * like a PCB trace or a one-line electrical diagram.
 */
const VB_W = 1440;
const VB_H = 800;
const TRACES: Array<{ pts: Array<[number, number]>; dur: number; delay: number }> = [
  { pts: [[0, 620], [260, 620], [340, 540], [620, 540], [680, 480], [900, 480]], dur: 7, delay: 0 },
  { pts: [[1440, 180], [1180, 180], [1100, 260], [860, 260], [800, 320], [640, 320]], dur: 8, delay: 1.2 },
  { pts: [[0, 250], [160, 250], [240, 330], [430, 330]], dur: 5.5, delay: 2.4 },
  { pts: [[1440, 690], [1240, 690], [1160, 610], [980, 610], [920, 550], [770, 550]], dur: 7.5, delay: 0.6 },
  { pts: [[520, 800], [520, 700], [580, 640], [720, 640]], dur: 4.5, delay: 3.1 },
  { pts: [[960, 0], [960, 90], [1020, 150], [1210, 150]], dur: 5, delay: 1.8 },
];

/** Share of each cycle spent travelling; the rest is a pause before the next pulse. */
const TRAVEL = 0.7;
const cq = (v: number) => `${((v / VB_W) * 100).toFixed(4)}cqw`;
const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

/** Build compositor-only keyframes (translate + rotate) that walk a pulse along a polyline. */
function keyframes(i: number, pts: Array<[number, number]>) {
  const segs = pts.slice(1).map((p, k) => {
    const [x0, y0] = pts[k];
    return { len: Math.hypot(p[0] - x0, p[1] - y0), angle: (Math.atan2(p[1] - y0, p[0] - x0) * 180) / Math.PI };
  });
  const total = segs.reduce((s, g) => s + g.len, 0);
  const frames: string[] = [];
  const at = (t: number, [x, y]: [number, number], a: number) =>
    `${pct(t)}{transform:translate3d(${cq(x)},${cq(y)},0) rotate(${a.toFixed(1)}deg)}`;
  let run = 0;
  frames.push(at(0, pts[0], segs[0].angle));
  segs.forEach((g, k) => {
    run += g.len;
    const t = (run / total) * TRAVEL;
    frames.push(at(t, pts[k + 1], g.angle));
    // Snap to the next segment's heading at each corner.
    if (k < segs.length - 1) frames.push(at(t + 0.0001, pts[k + 1], segs[k + 1].angle));
  });
  frames.push(at(1, pts.at(-1)!, segs.at(-1)!.angle));
  return `@keyframes pc-trace-${i}{${frames.join("")}}`;
}

const CSS =
  TRACES.map((t, i) => keyframes(i, t.pts)).join("") +
  `@keyframes pc-comet-fade{0%{opacity:0}3%{opacity:1}${pct(TRAVEL - 0.04)}{opacity:1}${pct(TRAVEL)},100%{opacity:0}}`;

type Props = {
  className?: string;
  /** 0–1 multiplier for the whole effect. */
  intensity?: number;
};

/**
 * Gold "energy" pulses flowing along circuit traces.
 * - The traces are a static SVG; they never repaint.
 * - Pulses and terminal rings are tiny HTML elements animated with transform/opacity only,
 *   so they run on the GPU compositor with zero main-thread work per frame.
 * - The layout mimics `preserveAspectRatio="xMidYMid slice"` (cover) with container-query
 *   units, so pulses always sit exactly on the traces at every screen size.
 * - <AnimateWhenVisible> starts them once the page is idle after load and pauses them off-screen.
 * - Reduced motion: pulses and rings are hidden; the static traces and nodes remain.
 */
export function EnergyLines({ className, intensity = 1 }: Props) {
  return (
    <AnimateWhenVisible
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden [container-type:size]", className)}
      style={{ opacity: intensity }}
    >
      <style href="pc-energy-lines" precedence="default">
        {CSS}
      </style>
      {/* Design-space frame: 1440:800, scaled to cover the parent and centred. */}
      <div className="absolute left-1/2 top-1/2 aspect-[1440/800] w-[max(100cqw,180cqh)] -translate-x-1/2 -translate-y-1/2 [container-type:inline-size]">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full">
          {TRACES.map((t, i) => (
            <g key={i}>
              <polyline points={t.pts.join(" ")} fill="none" stroke="rgb(234 166 7 / 0.14)" strokeWidth="1.25" />
              <circle cx={t.pts.at(-1)![0]} cy={t.pts.at(-1)![1]} r="3" fill="#EAA607" />
            </g>
          ))}
        </svg>

        {TRACES.map((t, i) => {
          const timing = { animationDuration: `${t.dur}s`, animationDelay: `-${t.delay}s` };
          const [ex, ey] = t.pts.at(-1)!;
          return (
            <div key={i} className="motion-reduce:hidden">
              {/* Mover: origin = pulse head. */}
              <div
                className="decor-anim absolute left-0 top-0 origin-top-left will-change-transform"
                style={{ ...timing, animationName: `pc-trace-${i}`, animationTimingFunction: "linear", animationIterationCount: "infinite" }}
              >
                <div
                  className="decor-anim absolute -top-[3.5px] right-0 h-[7px] w-[6.5cqw]"
                  style={{ ...timing, animationName: "pc-comet-fade", animationTimingFunction: "linear", animationIterationCount: "infinite" }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent to-gold/25 blur-[2px]" />
                  <span className="absolute inset-x-0 top-1/2 h-[1.75px] -translate-y-1/2 bg-gradient-to-r from-transparent via-orange to-gold" />
                  <span className="absolute right-0 top-1/2 size-[5px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#ffe3a3] shadow-[0_0_8px_2px_rgb(234_166_7/0.8)]" />
                </div>
              </div>
              {/* Terminal ring pulse */}
              <span
                className="decor-anim absolute size-1.5 -translate-x-1/2 -translate-y-1/2 animate-pulse-dot rounded-full border border-gold"
                style={{ left: `${(ex / VB_W) * 100}%`, top: `${(ey / VB_H) * 100}%`, animationDelay: `${t.delay}s` }}
              />
            </div>
          );
        })}
      </div>
    </AnimateWhenVisible>
  );
}
