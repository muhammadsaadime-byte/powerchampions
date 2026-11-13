/**
 * Hand-drawn line icons for the four PowerChampions values (no icon library).
 * 32×32 grid, 1.6 stroke, square-ish joins to match the angular Exo type and square buttons.
 * pathLength={1} lets one CSS "draw" animation (.pc-icon-draw in globals.css) work on every path.
 */
type IconProps = { className?: string };

const svgProps = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Servant-Leadership: a person lifted up by open, supporting hands. */
export function ServantLeadershipIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="16" cy="8" r="3.2" pathLength={1} />
      <path d="M10.5 19.5c0-3.3 2.5-5.6 5.5-5.6s5.5 2.3 5.5 5.6" pathLength={1} />
      <path d="M3.5 17.5v3.2c0 2.9 2.3 5.3 5.2 5.3h14.6c2.9 0 5.2-2.4 5.2-5.3v-3.2" pathLength={1} />
      <path d="M9 22.5h14" pathLength={1} />
    </svg>
  );
}

/** Empathy: a heart carrying a pulse line. */
export function EmpathyIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M16 27.5S4.5 20.7 4.5 12.6A6.1 6.1 0 0 1 16 9.4a6.1 6.1 0 0 1 11.5 3.2c0 8.1-11.5 14.9-11.5 14.9Z" pathLength={1} />
      <path d="M8 15.5h3.8l2-3.2 3.1 6.2 2-3h5.1" pathLength={1} />
    </svg>
  );
}

/** Integrity: a shield with a check. */
export function IntegrityIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M16 3.5 26 7.3v7.9c0 6.9-4.4 11.1-10 13.8C10.4 26.3 6 22.1 6 15.2V7.3L16 3.5Z" pathLength={1} />
      <path d="m11.2 15.8 3.4 3.4 6.4-6.6" pathLength={1} />
    </svg>
  );
}

/** Sincerity: a speech bubble holding a heart — "we mean what we say, with heart". */
export function SincerityIcon({ className }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M5 6.5h22v14.5H13.5L7.5 26v-5H5V6.5Z" pathLength={1} />
      <path d="M16 18s-4.2-2.4-4.2-5.2a2.15 2.15 0 0 1 4.2-.9 2.15 2.15 0 0 1 4.2.9C20.2 15.6 16 18 16 18Z" pathLength={1} />
    </svg>
  );
}
