/**
 * The motion vocabulary for the whole site.
 *
 * Five gestures, all derived from the isotipo — bars of unequal length that
 * settle into place. Everything on the page reuses one of them, so the motion
 * reads as a single language instead of a pile of effects:
 *
 * - `wipe`  a bar opening from the left (eyebrows, frames)
 * - `bar`   a rule drawing along its own axis (dividers, underlines)
 * - `words` headline words rising out of a mask, one after the next
 * - `rise`  supporting copy lifting into place
 * - `media` an image uncovering upward while its own frame settles
 *
 * The resting state of each gesture lives in `globals.css` under
 * "Motion entry states" so nothing flashes before the scripts run; the values
 * here are the destinations. Keep the two in sync.
 */

export const ease = {
  out: "power3.out",
  outSoft: "power2.out",
  outLong: "power4.out",
  inOut: "power3.inOut",
} as const;

export const speed = {
  fast: 0.45,
  base: 0.85,
  slow: 1.15,
} as const;

export type AnimName =
  | "rise"
  | "fade"
  | "wipe"
  | "bar"
  | "card"
  | "chip"
  | "media"
  | "words";

export type AnimRecipe = {
  /** Selector for descendants to animate instead of the element itself. */
  targets?: string;
  /** Explicit start values, for properties GSAP cannot read back from CSS. */
  from?: gsap.TweenVars;
  to: gsap.TweenVars;
  /** Seconds added to the block timeline before the next element starts. */
  lead: number;
  /** Companion tweens that run alongside the main one. */
  also?: ReadonlyArray<{ targets: string; to: gsap.TweenVars }>;
};

export const animRecipes: Record<AnimName, AnimRecipe> = {
  rise: {
    to: { opacity: 1, y: 0, duration: speed.base, ease: ease.out },
    lead: 0.09,
  },
  fade: {
    to: { opacity: 1, duration: speed.base, ease: ease.outSoft },
    lead: 0.09,
  },
  wipe: {
    to: { clipPath: "inset(0 0% 0 0)", duration: speed.base, ease: ease.inOut },
    lead: 0.1,
  },
  bar: {
    to: { scaleX: 1, duration: speed.slow, ease: ease.inOut },
    lead: 0.06,
  },
  card: {
    to: { opacity: 1, y: 0, duration: speed.base, ease: ease.out },
    lead: 0.1,
  },
  chip: {
    to: { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: ease.out },
    lead: 0.045,
  },
  media: {
    to: {
      clipPath: "inset(0 0 0% 0)",
      duration: speed.slow,
      ease: ease.inOut,
    },
    lead: 0.14,
    also: [
      {
        targets: "[data-anim-inner]",
        to: { scale: 1, duration: 1.6, ease: ease.outSoft },
      },
    ],
  },
  words: {
    targets: ".split-item",
    // The 115% in globals.css comes back from getComputedStyle already
    // resolved to pixels, which GSAP reads into `y` — so `yPercent` alone
    // would animate to zero and leave that pixel offset behind. Stating both
    // is what actually lands the word on its baseline.
    from: { yPercent: 115, y: 0 },
    to: {
      yPercent: 0,
      y: 0,
      duration: 1,
      ease: ease.outLong,
      stagger: 0.055,
    },
    lead: 0.16,
  },
};

const ANIM_NAMES = new Set<string>(Object.keys(animRecipes));

export function isAnimName(value: string | null | undefined): value is AnimName {
  return typeof value === "string" && ANIM_NAMES.has(value);
}
