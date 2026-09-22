import { cn } from "@/shared/lib/cn";
import { MARK_ROWS, MARK_WIDTH } from "@/shared/lib/brand-mark";

/**
 * The isotipo taken apart and used as texture: horizontal bars of unequal
 * length, breathing slowly out of phase.
 *
 * Both the lengths and the left edges are read off the real mark, so the
 * texture inherits the chevron — bars that narrow toward the middle while
 * reaching further right — instead of being a generic stack of rules. Values
 * are fixed rather than random, so the server and the client render the same
 * thing.
 *
 * Two densities, because they are doing different jobs:
 * - `field` fills a whole section background.
 * - `mark` is the five bars of the logo at logo spacing, for panels small
 *   enough that a full field would collapse into a barcode.
 */

/** The five bars of the mark, as percentages of its canvas. */
const BARS = MARK_ROWS.map((row) => ({
  left: (row.barX / MARK_WIDTH) * 100,
  width: (row.barWidth / MARK_WIDTH) * 100,
}));

type BarRow = {
  /** Vertical position, in percent of the container. */
  top: number;
  /** Index into BARS. */
  bar: number;
  delay: number;
  duration: number;
};

/**
 * Seven rows, not thirteen. Every one of these is an infinitely-animating,
 * permanently-composited element, and BarField has a dozen call sites — past a
 * few dozen layers the compositor starts refusing promotion and the whole set
 * falls back to the main thread with repaints. Seven reads as the same texture.
 */
const FIELD_ROWS: readonly BarRow[] = [
  { top: 8, bar: 0, delay: 0, duration: 11 },
  { top: 21, bar: 2, delay: 1.4, duration: 9 },
  { top: 34, bar: 4, delay: 0.6, duration: 13 },
  { top: 47, bar: 1, delay: 2.2, duration: 10 },
  { top: 60, bar: 3, delay: 3.1, duration: 12 },
  { top: 73, bar: 0, delay: 0.9, duration: 9.5 },
  { top: 88, bar: 2, delay: 2.6, duration: 14 },
];
/** The mark itself: five rows, in order, at roughly the mark's own pitch. */
const LOGO_ROWS: readonly BarRow[] = [
  { top: 10, bar: 0, delay: 0, duration: 9 },
  { top: 30, bar: 1, delay: 1.3, duration: 11 },
  { top: 50, bar: 2, delay: 2.5, duration: 10 },
  { top: 70, bar: 3, delay: 0.7, duration: 12.5 },
  { top: 90, bar: 4, delay: 1.9, duration: 10.5 },
];

const DENSITIES = {
  field: { rows: FIELD_ROWS, height: "2px" },
  mark: { rows: LOGO_ROWS, height: "4px" },
} as const;

export type BarFieldDensity = keyof typeof DENSITIES;

type BarFieldProps = {
  className?: string;
  density?: BarFieldDensity;
  /** Multiplies every bar length, to keep the texture off the copy. */
  spread?: number;
};

export function BarField({
  className,
  density = "field",
  spread = 1,
}: BarFieldProps) {
  const { rows, height } = DENSITIES[density];

  return (
    <div className={cn("bar-field", className)} aria-hidden="true">
      {rows.map((row) => (
        <span
          key={row.top}
          className="bar-field-row"
          style={
            {
              "--bar-top": `${row.top}%`,
              "--bar-height": height,
              "--bar-left": `${BARS[row.bar].left * spread}%`,
              "--bar-width": `${BARS[row.bar].width * spread}%`,
              "--bar-delay": `-${row.delay}s`,
              "--bar-duration": `${row.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
