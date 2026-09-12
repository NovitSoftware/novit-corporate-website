/**
 * The isotipo's grid, as geometry — the brand's own graphic resource.
 *
 * This file used to carry the whole logo: the ten isotipo shapes plus the
 * wordmark's path data, split into five addressable glyphs, so the header, the
 * intro curtain, the favicon and the OpenGraph card could each draw the lockup
 * as live SVG. None of them do any more. The logo ships as artwork now (see
 * `lib/brand-logo.ts`), which is the only way to guarantee the drawn shape is
 * the official one, so all of the path data is gone.
 *
 * What is left is not the logo. The design system names the isotipo's
 * decomposition — "bandas horizontales y rectángulos, que generan una grilla" —
 * as a graphic resource in its own right, separate from the logo and with no
 * rule against using it as texture. `BarField` is the one consumer: it reads
 * the real bar lengths and left edges so the texture inherits the chevron
 * instead of being a generic stack of rules.
 */

/** Isotipo canvas. Five rows of 25, pitched 35 apart: 25 + 10 of gap. */
export const MARK_WIDTH = 205;

/**
 * The five bars, top row first. Their left edges step 35 -> 70 -> 105 -> 70 ->
 * 35 while their right edges step 160 -> 182.5 -> 205 -> 182.5 -> 160, so the
 * stack narrows toward the middle while reaching further right. That is the
 * chevron, and it is symmetric about the centre row.
 */
export const MARK_ROWS = [
  { y: 0, barX: 35, barWidth: 125 },
  { y: 35, barX: 70, barWidth: 112.5 },
  { y: 70, barX: 105, barWidth: 100 },
  { y: 105, barX: 70, barWidth: 112.5 },
  { y: 140, barX: 35, barWidth: 125 },
] as const;
