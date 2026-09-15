"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type Lenis from "lenis";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** One arrow-key press, in pixels. Matches a browser's own line step. */
const ARROW_STEP = 110;
/** Page keys and space move just under a screen, so context is kept. */
const PAGE_FRACTION = 0.9;

type SmoothScrollProps = {
  children: ReactNode;
};

/**
 * Owns scrolling for the whole site.
 *
 * The document itself is pinned to the viewport: everything lives inside one
 * scroll container that Lenis drives, the way the reference does it. Scroll
 * position becomes a value the site owns — the header rail reads it, every
 * ScrollTrigger measures against it, and nothing is left to the browser's own
 * scroll animation.
 *
 * The container is still genuinely scrollable, so the wheel, touch,
 * find-in-page and a visitor with no JavaScript all keep working; only the
 * scrollbar is gone. Keyboard keys are handled in `ScrollBridge`, because a
 * browser only offers those to the document, and the document no longer
 * scrolls.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const reduced = usePrefersReducedMotion();

  /**
   * The resting states in `globals.css` are keyed off `data-motion`, which a
   * pre-paint script sets. If the visitor turns reduced motion on mid-session
   * that flag has to go, or anything not yet revealed stays hidden.
   */
  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);

    const sync = () => {
      if (media.matches) {
        delete document.documentElement.dataset.motion;
      }
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <ReactLenis
      className="scroll-shell"
      /* A scrollable region has to be reachable by keyboard. With scripts the
         keys in `ScrollBridge` do it; this is what carries the visitor
         without them. */
      tabIndex={0}
      options={{
        autoRaf: false,
        lerp: 0.12,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        smoothWheel: !reduced,
        syncTouch: !reduced,
        // Handled in `ScrollBridge`, so focus and the address bar move with
        // the scroll.
        anchors: false,
      }}
    >
      <ScrollBridge reduced={reduced} />
      {children}
    </ReactLenis>
  );
}

/**
 * Everything that needs the live Lenis instance.
 *
 * It sits inside the provider on purpose: the instance is created in an
 * effect, so a parent holding a ref to it still has nothing on the first
 * commit — which is the frame the whole page is wired up in. Reading it from
 * context means each of these runs the moment it exists, and again if it is
 * ever rebuilt.
 */
function ScrollBridge({ reduced }: { reduced: boolean }) {
  const lenis = useLenis();

  useFrameSync(lenis);
  useSceneGradient(lenis, reduced);
  useInitialHash(lenis);
  useAnchorNavigation(lenis, reduced);
  useKeyboardScroll(lenis, reduced);

  return null;
}

/**
 * One clock for the whole site: GSAP's ticker advances Lenis, and Lenis tells
 * ScrollTrigger to re-read position as it goes. Without that hand-off the two
 * keep their own clocks and every scroll-linked animation trails the page by a
 * frame or two.
 */
function useFrameSync(lenis: Lenis | undefined) {
  useEffect(() => {
    if (!lenis) {
      return;
    }

    const update = () => ScrollTrigger.update();
    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", update);
    gsap.ticker.add(raf);
    // Lenis already interpolates; letting GSAP also compensate for dropped
    // frames makes scrubbed animations jump.
    gsap.ticker.lagSmoothing(0);

    // Triggers created by children measure against the shell, which only
    // exists once this has mounted.
    ScrollTrigger.refresh();
    // Web fonts settle after first paint and can shift trigger positions.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);
}

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
function useSceneGradient(lenis: Lenis | undefined, reduced: boolean) {
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
        // intro curtain: arrive, do not travel.
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

/**
 * A link into the middle of the page — someone else's `#seguridad`, or a
 * reload on one — lands on the document, which no longer moves. The jump is
 * ours to make, once, on arrival.
 */
function useInitialHash(lenis: Lenis | undefined) {
  const jumped = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!lenis || jumped.current || hash.length < 2) {
      return;
    }

    const section = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!section) {
      return;
    }

    jumped.current = true;

    // After layout, and `force` because the intro holds the scroll while it
    // plays — the visitor should be at the section when the curtain lifts.
    requestAnimationFrame(() => {
      lenis.resize();
      lenis.scrollTo(section, { immediate: true, force: true });
    });
  }, [lenis]);
}

/**
 * Takes over in-page links so they glide to their section, update the address
 * bar, and still hand focus to the destination the way a native jump would.
 *
 * Where they stop is the section’s own `scroll-mt-anchor`, which Lenis reads
 * off the target — the same value a browser would use for a plain anchor jump
 * with no scripts running.
 */
function useAnchorNavigation(lenis: Lenis | undefined, reduced: boolean) {
  useEffect(() => {
    if (!lenis) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!link || !hash || hash === "#") {
        return;
      }

      const section = document.getElementById(
        decodeURIComponent(hash.slice(1)),
      );
      if (!section) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, "", hash);

      /**
       * Two frames before moving, and `force` on the tween. Both are here
       * because a click can land in the same frame as a React state change
       * that holds or re-lays-out the scroller — the intro releasing, a
       * section mounting — and Lenis reads its limits once per tween.
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lenis.resize();
          lenis.scrollTo(section, {
            duration: reduced ? 0 : 1.2,
            immediate: reduced,
            easing: easeOutExpo,
            force: true,
            onComplete: () => handOverFocus(section),
          });
        });
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis, reduced]);
}

/**
 * Arrows, Page keys, space, Home and End. The browser hands these to the
 * document, which is pinned, so without this the shell would be reachable by
 * wheel and touch only — the scroll equivalent of a keyboard trap.
 *
 * Anything the key already means something to keeps it: typing in a field,
 * space on a control, and any inner scroller marked `data-lenis-prevent`.
 */
function useKeyboardScroll(lenis: Lenis | undefined, reduced: boolean) {
  useEffect(() => {
    if (!lenis) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (target instanceof Element && ownsTheKey(target, event.key)) {
        return;
      }

      const options = {
        duration: reduced ? 0 : 0.7,
        immediate: reduced,
        easing: easeOutExpo,
      };

      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        lenis.scrollTo(event.key === "Home" ? 0 : lenis.limit, options);
        return;
      }

      const delta = keyDelta(event, lenis.rootElement.clientHeight);
      if (delta !== 0) {
        event.preventDefault();
        lenis.scrollTo(lenis.scroll + delta, options);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lenis, reduced]);
}

const TYPING =
  "input, textarea, select, [contenteditable]:not([contenteditable=false])";
const ACTIVATABLE = "a[href], button, summary, [role=button]";

function ownsTheKey(target: Element, key: string): boolean {
  if (target.closest(TYPING) || target.closest("[data-lenis-prevent]")) {
    return true;
  }
  // Space activates whatever is focused; the arrows and page keys do not.
  return key === " " && target.closest(ACTIVATABLE) !== null;
}

function keyDelta(event: KeyboardEvent, viewport: number): number {
  const page = viewport * PAGE_FRACTION;

  switch (event.key) {
    case "ArrowDown":
      return ARROW_STEP;
    case "ArrowUp":
      return -ARROW_STEP;
    case "PageDown":
      return page;
    case "PageUp":
      return -page;
    case " ":
      return event.shiftKey ? -page : page;
    default:
      return 0;
  }
}

function handOverFocus(section: HTMLElement) {
  if (!section.hasAttribute("tabindex")) {
    section.setAttribute("tabindex", "-1");
  }
  section.focus({ preventScroll: true });
}

