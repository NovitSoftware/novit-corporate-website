"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import { basePath, withBasePath } from "@/lib/base-path";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { coverPage, revealPage } from "@/lib/page-reveal";

/** How far the page and the logo are zoomed before they settle to 1. */
const ZOOM = 1.1;
const RADIUS = 24;
/** The badge's margin round the logo and its rule, in px. */
const BADGE_PAD_X = 24;
const BADGE_PAD_Y = 36;
/** How long the logo stands in its badge before the page opens, in s. */
const HOLD = 0.7;
/** How far ahead of the final expand the ground's second beat starts, in s. */
const LEAD = 0.35;
/** How far the ramps step along their axis on a beat, in % of the ground. */
const FLOW = 5;
/** How long a beat moves the shared ground layers, in s. */
const BEAT = 0.6;
/** How long a page takes to fold back into the badge, in s. */
const SHRINK = 0.6;
/** When a closing page is fully covered and the next route can be swapped in. */
const COVERED = 0.85;
/**
 * The curves. Each expand is one tween of the frame with the zoom on the same
 * duration and curve, so the edge and the content never drift apart; and the
 * curves are the gentle ones, since a hard ease-in-out reads as a lurch at
 * full-viewport size.
 */
const ARRIVE = "power3.out";
const TRAVEL = "power2.inOut";
const FADE = "sine.inOut";
/** How far the ground turns from cabecera to cierre while the logo is up. */
const CIERRE = 0.85;
/** Past this a navigation is given up on and the browser loads the page itself. */
const NAVIGATION_TIMEOUT_MS = 6000;
/** Navigations run the same choreography as the first load, a little quicker. */
const NAVIGATION_PACE = 0.8;

type Parts = {
  stage: HTMLElement;
  lens: HTMLElement;
  window: HTMLElement;
  outline: HTMLElement;
  stack: HTMLElement;
  rule: HTMLElement;
  ramps: HTMLElement;
  cierre: HTMLElement;
  glow: HTMLElement;
  /** One per beat, so the second can start while the first is still out. */
  ripples: [HTMLElement, HTMLElement];
};

/**
 * The page's visible window, centred in the viewport: its size in px and its
 * corner radius. Tweened as plain numbers and written out by `paint` — GSAP
 * interpolating `clip-path` strings pairs the numbers up wrongly once the
 * browser shortens `inset(a b a b)` to `inset(a b)`, which knocks the frame
 * off centre mid-flight.
 */
type Frame = { w: number; h: number; r: number; vw: number; vh: number };

/** The badge round the whole lockup and its rule. */
type Badge = { w: number; h: number };

type Destination = {
  /** What `router.push` takes: no base path, with search and hash. */
  route: string;
  path: string;
  hash: string;
};

type TransitionState = {
  busy: boolean;
  shown: string;
  pending: Destination | null;
  timeline: gsap.core.Timeline | null;
  frame: Frame;
  fallback: number;
};

/**
 * The page curtain, and the one way every page arrives.
 *
 * First load: a white-edged frame opens out from the centre to fit the logo,
 * the logo settling inside it; it holds there; then the page opens out of the
 * badge to fill the viewport. The frame is the same one throughout, so the
 * logo and the page arrive by the same gesture.
 *
 * Every navigation plays it again, shorter: internal links are taken over and
 * routed client-side, the page folds back into the badge, the next route is
 * swapped in behind the logo, and it opens the same way. Back and forward
 * cannot be held while the page closes, so they cut to the badge and open
 * from there.
 *
 * The page is clipped and zoomed as one piece — `[data-page-stage]` carries
 * the clip, `[data-page-lens]` inside it the zoom — so the header, the
 * atmosphere and the content all arrive together.
 *
 * Reduced motion gets none of it: no curtain on arrival (the pre-paint script
 * never sets `data-curtain`) and plain page loads between routes.
 */
export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef<Lenis | undefined>(undefined);
  const state = useRef<TransitionState>({
    busy: false,
    shown: normalize(pathname),
    pending: null,
    timeline: null,
    frame: { w: 0, h: 0, r: RADIUS, vw: 0, vh: 0 },
    fallback: 0,
  });

  // Nothing scrolls under the curtain.
  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && document.documentElement.dataset.curtain) {
      lenis.stop();
    }
  }, [lenis]);

  // The first load. A passive effect, so every scene on the page has measured
  // itself before the zoom changes what it would measure.
  useEffect(() => {
    const root = document.documentElement;
    const parts = findParts();
    const current = state.current;
    // "opening" as well: development mounts effects twice, and the second run
    // has to rebuild the timeline the first one's cleanup killed.
    const phase = root.dataset.curtain;

    if ((phase !== "intro" && phase !== "opening") || !parts) {
      delete root.dataset.curtain;
      revealPage();
      return;
    }

    current.busy = true;
    const frame = current.frame;
    const badge = measure(parts, frame);
    gsap.set([parts.stage, parts.outline], { opacity: 0 });
    gsap.set(parts.lens, { scale: ZOOM });
    Object.assign(frame, { w: 0, h: 0, r: RADIUS });
    paint(parts, frame);
    // Hands the stage and the logo over from their CSS resting clips.
    root.dataset.curtain = "opening";

    const timeline = gsap.timeline({
      onComplete: () => settle(parts, current, lenisRef.current),
    });
    const lands = addBadge(timeline, parts, frame, badge, 0.05);
    const opensAt = lands + HOLD;
    // The ground answers the badge landing, then again as the page is about
    // to open, so the page comes out in the wake of the second.
    addBeat(timeline, parts, lands - 0.25, parts.ripples[0], FLOW, CIERRE);
    addBeat(timeline, parts, opensAt - LEAD, parts.ripples[1], -FLOW, 1);
    addOpening(timeline, parts, frame, opensAt, 1);
    current.timeline = timeline;

    return () => {
      timeline.kill();
    };
  }, []);

  // Internal links, back and forward, and pages restored from the bfcache.
  useEffect(() => {
    const current = state.current;
    const prefetched = new Set<string>();

    const navigate = (destination: Destination) => {
      const parts = findParts();
      if (!parts) {
        return false;
      }

      current.busy = true;
      coverPage();
      document.documentElement.dataset.curtain = "nav";
      lenisRef.current?.stop();

      const frame = current.frame;
      const badge = measure(parts, frame);
      Object.assign(frame, { w: frame.vw, h: frame.vh, r: 0 });
      paint(parts, frame);
      gsap.set([parts.outline, parts.stack, parts.glow, parts.cierre], {
        opacity: 0,
      });

      const swap = () => {
        // Back to an unzoomed page before the next one mounts, so its scenes
        // measure where things really are.
        gsap.set(parts.lens, { clearProps: "transform" });
        // A link inside the open menu restarts the scroll as it closes.
        lenisRef.current?.stop();
        lenisRef.current?.scrollTo(0, { immediate: true, force: true });
        current.pending = destination;
        router.push(destination.route, { scroll: false });
        current.fallback = window.setTimeout(() => {
          window.location.assign(withBasePath(destination.route));
        }, NAVIGATION_TIMEOUT_MS);
      };

      // The swap goes in as soon as the page is covered, not when the last
      // tween happens to end.
      const timeline = gsap.timeline();
      timeline.add(swap, COVERED);
      timeline
        .to(
          frame,
          {
            w: badge.w,
            h: badge.h,
            r: RADIUS,
            duration: SHRINK,
            ease: TRAVEL,
            onUpdate: () => paint(parts, frame),
          },
          0,
        )
        .to(parts.outline, { opacity: 1, duration: 0.25, ease: FADE }, 0.05)
        .fromTo(
          parts.lens,
          { scale: 1 },
          { scale: ZOOM, duration: SHRINK, ease: TRAVEL },
          0,
        )
        .to(parts.stage, { opacity: 0, duration: 0.25, ease: FADE }, 0.4);
      addMark(timeline, parts, 0.35, 0.6);
      // The ground runs its beat backwards while the page folds away: the
      // ripple gathers onto the badge as the page lands in it, the ramps flow
      // back and the violet recedes. The next page opens on the beat forwards.
      addBeatReversed(
        timeline,
        parts,
        0,
        SHRINK,
        parts.ripples[0],
        nextFlow(parts),
        CIERRE,
      );
      current.timeline = timeline;
      return true;
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        prefersReducedMotion()
      ) {
        return;
      }

      const destination = destinationOf(event.target);
      if (!destination) {
        return;
      }

      event.preventDefault();
      if (!current.busy && !navigate(destination)) {
        window.location.assign(withBasePath(destination.route));
      }
    };

    const onIntent = (event: Event) => {
      const destination = destinationOf(event.target);
      if (destination && !prefetched.has(destination.path)) {
        prefetched.add(destination.path);
        router.prefetch(destination.path);
      }
    };

    const onPopState = () => {
      const parts = findParts();
      if (
        !parts ||
        prefersReducedMotion() ||
        normalize(currentPath()) === current.shown
      ) {
        return;
      }

      current.timeline?.kill();
      current.timeline = null;
      current.pending = null;
      current.busy = true;
      coverPage();
      document.documentElement.dataset.curtain = "nav";
      lenisRef.current?.stop();

      // Straight to the badge, logo up.
      const frame = current.frame;
      const badge = measure(parts, frame);
      Object.assign(frame, { w: badge.w, h: badge.h, r: RADIUS });
      paint(parts, frame);
      gsap.set(parts.stage, { opacity: 0 });
      gsap.set(parts.lens, { clearProps: "transform" });
      gsap.set([parts.outline, parts.stack, parts.glow], { opacity: 1 });
      gsap.set(parts.cierre, { opacity: CIERRE });
      gsap.set(parts.rule, { scaleX: 1 });

      window.clearTimeout(current.fallback);
      current.fallback = window.setTimeout(() => {
        window.location.reload();
      }, NAVIGATION_TIMEOUT_MS);
    };

    // The fallback above can leave a closed page in the bfcache.
    const onPageShow = (event: PageTransitionEvent) => {
      const parts = findParts();
      if (event.persisted && parts && document.documentElement.dataset.curtain) {
        current.timeline?.kill();
        settle(parts, current, lenisRef.current);
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onIntent);
    document.addEventListener("focusin", onIntent);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("focusin", onIntent);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [router]);

  /**
   * The next route has rendered behind the curtain.
   *
   * A layout effect, because it runs before the new page's own layout effects
   * — its scenes measure themselves in those, and they have to find the page
   * already scrolled to where it opens. The opening itself waits a frame, for
   * the same measurements to finish before the zoom goes on.
   */
  useLayoutEffect(() => {
    const current = state.current;
    const path = normalize(pathname);
    if (path === current.shown) {
      return;
    }

    current.shown = path;
    window.clearTimeout(current.fallback);
    const hash = current.pending?.hash ?? window.location.hash;
    current.pending = null;

    const parts = findParts();
    land(lenisRef.current, hash);

    if (!parts || !document.documentElement.dataset.curtain) {
      revealPage();
      return;
    }

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const timeline = gsap.timeline({
        onComplete: () => {
          settle(parts, current, lenisRef.current);
          focusArrival(hash);
        },
      });
      // The second beat, then the page out in its wake.
      addBeat(timeline, parts, 0, parts.ripples[1], nextFlow(parts), 1);
      addOpening(timeline, parts, current.frame, 0.2, NAVIGATION_PACE);
      current.timeline = timeline;
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

function findParts(): Parts | null {
  const pick = (selector: string) =>
    document.querySelector<HTMLElement>(selector);
  const parts = {
    stage: pick("[data-page-stage]"),
    lens: pick("[data-page-lens]"),
    window: pick("[data-curtain-window]"),
    outline: pick("[data-curtain-outline]"),
    stack: pick("[data-curtain-stack]"),
    rule: pick("[data-curtain-rule]"),
    ramps: pick("[data-curtain-ramps]"),
    cierre: pick("[data-curtain-cierre]"),
    glow: pick("[data-curtain-glow]"),
  };
  const ripples = document.querySelectorAll<HTMLElement>("[data-curtain-ripple]");

  if (!Object.values(parts).every(Boolean) || ripples.length < 2) {
    return null;
  }
  return { ...(parts as Omit<Parts, "ripples">), ripples: [ripples[0], ripples[1]] };
}

/**
 * The badge the page opens out of, measured off the logo at rest. Also records
 * the viewport on the frame, which is what the page opens to.
 */
function measure(parts: Parts, frame: Frame): Badge {
  frame.vw = parts.stage.clientWidth;
  frame.vh = parts.stage.clientHeight;
  gsap.set(parts.stack, { y: 0, scale: 1 });

  const stack = parts.stack.getBoundingClientRect();
  const badge = {
    w: Math.min(stack.width + BADGE_PAD_X * 2, frame.vw),
    h: Math.min(stack.height + BADGE_PAD_Y * 2, frame.vh),
  };
  gsap.set(parts.ripples, { width: badge.w, height: badge.h });
  return badge;
}

/** Writes the frame out: the stage's clip, the logo's, and the outline on them. */
function paint(parts: Parts, frame: Frame) {
  const x = Math.max(0, (frame.vw - frame.w) / 2);
  const y = Math.max(0, (frame.vh - frame.h) / 2);
  const clip = `inset(${y}px ${x}px ${y}px ${x}px round ${frame.r}px)`;
  parts.stage.style.clipPath = clip;
  parts.window.style.clipPath = clip;

  const outline = parts.outline.style;
  outline.left = `${x}px`;
  outline.top = `${y}px`;
  outline.width = `${frame.vw - x * 2}px`;
  outline.height = `${frame.vh - y * 2}px`;
  outline.borderRadius = `${frame.r}px`;
}

/**
 * The first expand: the frame opens out from the centre to fit the whole
 * logo, which settles inside it as it is uncovered.
 *
 * Returns when the badge is complete, for the hold to be counted from.
 */
function addBadge(
  timeline: gsap.core.Timeline,
  parts: Parts,
  frame: Frame,
  badge: Badge,
  at: number,
): number {
  const open = 0.7;

  timeline
    .to(
      frame,
      {
        w: badge.w,
        h: badge.h,
        duration: open,
        ease: ARRIVE,
        onUpdate: () => paint(parts, frame),
      },
      at,
    )
    .to(parts.outline, { opacity: 1, duration: 0.2, ease: FADE }, at)
    .fromTo(
      parts.stack,
      { opacity: 0, scale: ZOOM },
      { opacity: 1, scale: 1, duration: 0.8, ease: ease.outSoft },
      at + 0.08,
    )
    .to(parts.glow, { opacity: 1, duration: 0.8, ease: FADE }, at + 0.1)
    .fromTo(
      parts.rule,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: TRAVEL },
      at + 0.35,
    );

  return at + open;
}

/**
 * One beat of the ground, answering the frame: an echo of the badge's edge
 * radiating out, the ramps flowing a step along their axis to `flow`, the glow
 * behind the badge swelling and settling, and the ground turning to `cierre`.
 */
function addBeat(
  timeline: gsap.core.Timeline,
  parts: Parts,
  at: number,
  ripple: HTMLElement,
  flow: number,
  cierre: number,
) {
  // Beats can come closer together than a ripple lasts, so each ripple has an
  // element of its own; the shared layers finish inside BEAT, and should one
  // beat still catch the last of another, the newer takes the property over.
  const shared = { overwrite: "auto" as const };

  timeline
    .set(ripple, { scale: 1, opacity: 0 }, at)
    .to(ripple, { scale: 1.9, duration: 1, ease: ease.outSoft }, at)
    .to(ripple, { opacity: 0.75, duration: 0.18, ease: "sine.out" }, at)
    .to(ripple, { opacity: 0, duration: 0.8, ease: "sine.in" }, at + 0.18)
    .to(
      parts.ramps,
      { ...shared, xPercent: flow, duration: BEAT, ease: FADE },
      at,
    )
    .to(
      parts.glow,
      {
        ...shared,
        scale: 1.25,
        duration: BEAT / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      },
      at,
    )
    .to(parts.cierre, { ...shared, opacity: cierre, duration: BEAT, ease: FADE }, at);
}

/**
 * The same beat run backwards and fitted into `duration`: the ripple gathers
 * in from the edges onto the badge and the ramps and the violet come back to
 * where they are now. Its first frame is the beat's last, which the full page
 * still covers, so nothing jumps in view.
 */
function addBeatReversed(
  timeline: gsap.core.Timeline,
  parts: Parts,
  at: number,
  duration: number,
  ripple: HTMLElement,
  flow: number,
  cierre: number,
) {
  const beat = gsap.timeline({ paused: true });
  addBeat(beat, parts, 0, ripple, flow, cierre);
  timeline.add(
    beat.tweenFromTo(beat.duration(), 0, { duration, ease: "none" }),
    at,
  );
}

/** A beat flows the ramps the other way from wherever the last one left them. */
function nextFlow(parts: Parts): number {
  return Number(gsap.getProperty(parts.ramps, "xPercent")) > 0 ? -FLOW : FLOW;
}

/** The logo arriving in a badge that is already there: it settles into it. */
function addMark(
  timeline: gsap.core.Timeline,
  parts: Parts,
  at: number,
  pace: number,
) {
  timeline
    .fromTo(
      parts.stack,
      { opacity: 0, scale: ZOOM },
      { opacity: 1, scale: 1, duration: 0.8 * pace, ease: ease.outSoft },
      at,
    )
    .to(parts.glow, { opacity: 1, duration: 0.8 * pace, ease: FADE }, at)
    .fromTo(
      parts.rule,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5 * pace, ease: TRAVEL },
      at + 0.25 * pace,
    );
}

/**
 * The page opening: out of the badge to the edges in one move, with the page
 * fading up inside it, the zoom settling, the logo lifting away and the
 * outline letting go as it reaches the viewport. The page's own entrance is
 * released partway, so it is already arriving as the frame opens.
 */
function addOpening(
  timeline: gsap.core.Timeline,
  parts: Parts,
  frame: Frame,
  at: number,
  pace: number,
) {
  const travel = pace;

  timeline
    .to(
      frame,
      {
        w: frame.vw,
        h: frame.vh,
        r: 0,
        duration: travel,
        ease: TRAVEL,
        onUpdate: () => paint(parts, frame),
      },
      at,
    )
    .fromTo(
      parts.lens,
      { scale: ZOOM },
      { scale: 1, duration: travel, ease: TRAVEL, immediateRender: false },
      at,
    )
    .to(parts.stage, { opacity: 1, duration: 0.4 * pace, ease: "sine.out" }, at)
    .to(
      parts.stack,
      { opacity: 0, y: -16, scale: 1.04, duration: 0.4 * pace, ease: FADE },
      at,
    )
    .to(parts.glow, { opacity: 0, duration: 0.5 * pace, ease: FADE }, at)
    .to(
      parts.outline,
      { opacity: 0, duration: 0.35 * pace, ease: FADE },
      at + 0.6 * pace,
    )
    .add(revealPage, at + 0.4 * pace);
}

/** The page is open: hand it back as if the curtain had never been there. */
function settle(parts: Parts, current: TransitionState, lenis: Lenis | undefined) {
  // Attribute first: it holds the CSS resting clip, and clearing the inline
  // clip under it would close the page for a frame.
  delete document.documentElement.dataset.curtain;
  gsap.set(parts.stage, { clearProps: "clipPath,opacity" });
  gsap.set(parts.lens, { clearProps: "transform" });
  revealPage();
  current.busy = false;
  current.timeline = null;
  lenis?.start();
  // Anything that refreshed during the zoom measured a scaled page.
  ScrollTrigger.refresh();
}

/** Where the next route opens: its fragment if it names one, else the top. */
function land(lenis: Lenis | undefined, hash: string) {
  const target =
    hash.length > 1
      ? document.getElementById(decodeURIComponent(hash.slice(1)))
      : null;

  lenis?.resize();
  lenis?.scrollTo(target ?? 0, { immediate: true, force: true });
}

/** Focus follows the navigation, as it would on a page load. */
function focusArrival(hash: string) {
  const target =
    (hash.length > 1
      ? document.getElementById(decodeURIComponent(hash.slice(1)))
      : null) ?? document.getElementById("contenido");
  if (!target) {
    return;
  }

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });
}

/** An in-site route the link points at, or null for anything to leave alone. */
function destinationOf(target: EventTarget | null): Destination | null {
  if (!(target instanceof Element)) {
    return null;
  }

  const link = target.closest("a[href]");
  if (
    !(link instanceof HTMLAnchorElement) ||
    (link.target && link.target !== "_self") ||
    link.hasAttribute("download")
  ) {
    return null;
  }

  const url = new URL(link.href);
  if (
    url.origin !== window.location.origin ||
    (basePath &&
      url.pathname !== basePath &&
      !url.pathname.startsWith(`${basePath}/`))
  ) {
    return null;
  }

  const path = url.pathname.slice(basePath.length) || "/";
  // A file is not a route, and a link into the page already open stays an
  // in-page jump.
  if (/\.[a-z0-9]+$/i.test(path) || normalize(path) === normalize(currentPath())) {
    return null;
  }

  return { route: `${path}${url.search}${url.hash}`, path, hash: url.hash };
}

function currentPath(): string {
  return window.location.pathname.slice(basePath.length) || "/";
}

/** `trailingSlash` makes pathnames `/ruta/`; the hrefs have none. */
function normalize(path: string): string {
  return path.replace(/(.)\/$/, "$1");
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
