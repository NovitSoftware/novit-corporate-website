/* The scroll-driven ground: the brandbook ramps, pinned to points on the page. */

import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap } from "@/lib/gsap";

/**
 * The scroll journey, as brandbook ramps pinned to points on the page. Four
 * stages rather than two, because with only cabecera and cierre the first stop
 * moved by three points across the entire site — `#0D0B92` and `#0F0086` are
 * nearly the same colour, so the top-left corner of the gradient sat still
 * while stops 2 and 3 did all the work.
 *
 * Reading down: cabecera, then a brighter blue with the violet already planted
 * at the far edge, then the cierre ramp exactly as the brandbook draws it,
 * held there for the last stretch of the page. Every stop travels in every
 * segment up to that point; the brandbook has no gradient past cierre, so the
 * ground settles instead of inventing one — magenta stays reserved for the
 * one deliberate accent in `AcademyBlock`, not the page-wide atmosphere.
 *
 * `at` is where each stage lands, weighted rather than evenly spaced, so the
 * bright stage arrives while the visitor is still in the argument and the
 * violet is there by the closing block — the brandbook's rule that the violet
 * is where Novit speaks for itself.
 *
 * Stage 0 must stay equal to `--scene-0..3` in globals.css: those are the
 * resting values a visitor sees with no JavaScript.
 *
 * `#4F8ED5` at stage 1 is the tightest constraint on the page: it is the one
 * colour here that needs `.scene-blooms::after` to hold body copy at AA. If
 * that veil is ever weakened, this is what breaks first.
 */
const SCENE_STAGES = [
  { at: 0, ramp: ["#0D0B92", "#1B4BB9", "#4F8ED5", "#3398DC"] }, // cabecera
  { at: 0.4, ramp: ["#1B4BB9", "#4F8ED5", "#3DB0E4", "#510371"] }, // apertura
  { at: 0.72, ramp: ["#0F0086", "#2C037B", "#510371", "#85067B"] }, // cierre
  { at: 1, ramp: ["#0F0086", "#2C037B", "#510371", "#85067B"] }, // cierre (held)
] as const;

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

const SCENE_RGB = SCENE_STAGES.map((stage) => ({
  at: stage.at,
  ramp: stage.ramp.map(hexToRgb),
}));

/** How many stops the gradient has. */
const SCENE_STOPS = SCENE_RGB[0].ramp.length;

function lerpChannel(from: number, to: number, progress: number): number {
  return Math.round(from + (to - from) * progress);
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * Zero derivative at both ends, applied to the position *within* a stage and
 * never to the overall progress — easing the whole scroll would slide the
 * stages off the positions that define them. This only removes the change in
 * rate at each boundary, which on a slow scroll reads as a gear change.
 */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/** How far the painted colour closes on the scroll each frame: ~0.33s to settle. */
const SCENE_CHASE = 0.06;
/** Below this the colour has arrived, and there is nothing to write. */
const SCENE_SETTLED = 0.0002;
/** Reduced motion gets this many discrete grounds instead of a smooth slide. */
const SCENE_STEPS = 12;
/**
 * How many distinct grounds the journey is allowed to paint.
 *
 * `body`'s gradient reads `--scene-0..3`, so every write to them re-rasters a
 * full-viewport gradient — the exact cost `.scene-sweep` is built to avoid,
 * paid on the layer underneath it. Writing per frame put that repaint on every
 * frame of Lenis' inertial tail and held scrolling around 20fps.
 *
 * Quantising the progress *before* the colour is derived is what fixes it: the
 * ground can only land on one of these steps, so the paint is skipped outright
 * on the frames between two of them. 96 steps over the widest stop travel on
 * the page (stop 2, #4F8ED5 → #85067B, 136 units on its longest channel) is
 * ~1.4 units per step — inside the 8-bit rounding the old code already
 * tolerated, so nothing is visibly coarser. The chase above still eases
 * between steps; it just does it in colour space, not in repaints.
 */
const SCENE_QUANTUM = 96;

/**
 * The site's own ambient backdrop, painted on `body` in globals.css. `body`
 * never scrolls in this layout, so the gradient there reads as one constant
 * atmosphere behind the whole page rather than as a band belonging to any
 * section.
 *
 * The colour is chased rather than read straight off the scroll position. Two
 * reasons: a flick-scroll would otherwise step a full-viewport colour change
 * in a couple of frames, which is a photosensitivity risk at this size; and
 * the chase keeps running for about a third of a second after the last scroll
 * event, so the ground eases to a stop instead of freezing mid-move.
 */
export function useSceneGradient(lenis: Lenis | undefined, reduced: boolean) {
  useEffect(() => {
    if (!lenis) {
      return;
    }

    const root = document.documentElement.style;
    const written: string[] = new Array(SCENE_STOPS).fill("");
    let writtenMix = "";
    let current = 0;
    let seeded = false;
    /** The last quantised step actually painted. -1 so the first frame paints. */
    let painted = -1;

    const paint = (progress: number) => {
      // Which pair of stages this progress falls between.
      let stage = SCENE_RGB.length - 2;
      while (stage > 0 && progress < SCENE_RGB[stage].at) {
        stage -= 1;
      }

      const from = SCENE_RGB[stage];
      const to = SCENE_RGB[stage + 1];
      const span = to.at - from.at;
      const t = smoothstep(
        clamp01(span > 0 ? (progress - from.at) / span : 0),
      );

      for (let stop = 0; stop < SCENE_STOPS; stop += 1) {
        const [r, g, b] = from.ramp[stop];
        const [tr, tg, tb] = to.ramp[stop];
        const next = `${lerpChannel(r, tr, t)} ${lerpChannel(g, tg, t)} ${lerpChannel(b, tb, t)}`;

        // Lenis reports a new position on every frame of its inertial tail,
        // but rounded to 8 bits the colour is usually the one already there.
        // Skipping the write skips a full-viewport repaint with it.
        if (next !== written[stop]) {
          written[stop] = next;
          root.setProperty(`--scene-${stop}`, next);
        }
      }

      // Read by the atmosphere layers in globals.css, which use it for
      // `opacity` and nothing else — see the note there.
      const nextMix = progress.toFixed(3);
      if (nextMix !== writtenMix) {
        writtenMix = nextMix;
        root.setProperty("--scene-mix", nextMix);
      }
    };

    /**
     * On GSAP's ticker rather than `lenis.on("scroll")`, because the chase has
     * to keep settling for a beat after the last scroll event. `useFrameSync`
     * registers first, so `lenis.progress` is already this frame's value.
     */
    const tick = () => {
      const target = clamp01(lenis.progress || 0);

      if (!seeded) {
        // First frame, and any deep link `useInitialHash` jumps to behind the
        // page curtain: arrive, do not travel.
        seeded = true;
        current = target;
      } else {
        const delta = target - current;
        if (Math.abs(delta) < SCENE_SETTLED) {
          return;
        }
        current += delta * SCENE_CHASE;
      }

      // Reduced motion keeps the journey — a colour change carries no motion
      // vector, and it is entirely driven by the visitor's own scrolling — but
      // in far fewer steps, so it reads as a dozen grounds rather than a slide.
      const steps = reduced ? SCENE_STEPS : SCENE_QUANTUM;
      const step = Math.round(current * steps);

      // The whole point of the quantum: between two steps there is no new
      // colour to paint, so the full-viewport repaint is skipped entirely.
      if (step === painted) {
        return;
      }

      painted = step;
      paint(step / steps);
    };

    tick();
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [lenis, reduced]);
}
