/*
 * The site's travelling signal, in three marks: a dot carried along a path,
 * a short run of light moving down a line, and the ring left where either
 * arrives. The Academia's board, the customer map and the home hero all move
 * with these, so a request on the board, a route on the map and a current in
 * the hero read as the same thing.
 *
 * Each one writes attributes from the path's own geometry on every frame
 * instead of tweening them: a dot placed from `getPointAtLength` shares the
 * path's coordinate space, so it cannot drift off its line, and nothing here
 * keeps state between frames that a remount could leave stale.
 */

type Timeline = gsap.core.Timeline;

/**
 * Carries `dot` from one end of `path` to the other, starting at `at`.
 * Position first, then visibility, both from the same tick, so the dot never
 * shows for a frame where the last leg left it.
 */
export function travel(
  timeline: Timeline,
  path: SVGGeometryElement,
  dot: SVGCircleElement,
  { at, duration, reverse = false, ease = "sine.inOut" }: { at: number; duration: number; reverse?: boolean; ease?: string },
) {
  const length = path.getTotalLength();
  const progress = { t: 0 };
  timeline
    .fromTo(progress, { t: 0 }, {
      t: 1,
      duration,
      ease,
      immediateRender: false,
      onUpdate: () => {
        const point = path.getPointAtLength((reverse ? 1 - progress.t : progress.t) * length);
        dot.setAttribute("cx", point.x.toFixed(2));
        dot.setAttribute("cy", point.y.toFixed(2));
      },
    }, at)
    .to(dot, { opacity: 1, duration: 0.1, ease: "none" }, at)
    .to(dot, { opacity: 0, duration: 0.12, ease: "none" }, at + duration - 0.1);
}

/**
 * A run of light down `trail` — a copy of the line it travels, stroked in the
 * signal's ink — from the start to the end: one dash as long as `length`,
 * entering at the start and leaving past the end. `stroke-dashoffset` only,
 * so the line is never re-laid out, and the dash is set up on every play, so
 * a trail shared between signals is always the one being drawn.
 */
export function trail(
  timeline: Timeline,
  path: SVGGeometryElement,
  { at, duration, length = 90, ease = "sine.inOut" }: { at: number; duration: number; length?: number; ease?: string },
) {
  const total = path.getTotalLength();
  const run = Math.min(length, total * 0.6);
  const head = { d: 0 };
  timeline.fromTo(head, { d: 0 }, {
    d: total + run,
    duration,
    ease,
    immediateRender: false,
    onStart: () => {
      path.style.strokeDasharray = `${run.toFixed(1)} ${(total + run).toFixed(1)}`;
      path.style.opacity = "1";
    },
    onUpdate: () => {
      path.style.strokeDashoffset = (run - head.d).toFixed(1);
    },
    onComplete: () => {
      path.style.opacity = "0";
    },
  }, at);
}

/** The ring a signal leaves where it arrives, spreading out and fading. */
export function ripple(
  timeline: Timeline,
  ring: SVGCircleElement,
  point: { x: number; y: number },
  at: number,
  { from = 4, to = 17, duration = 0.7, opacity = 0.85 }: { from?: number; to?: number; duration?: number; opacity?: number } = {},
) {
  const spread = { t: 0 };
  timeline.fromTo(spread, { t: 0 }, {
    t: 1,
    duration,
    ease: "power2.out",
    immediateRender: false,
    onUpdate: () => {
      ring.setAttribute("cx", point.x.toFixed(2));
      ring.setAttribute("cy", point.y.toFixed(2));
      ring.setAttribute("r", (from + (to - from) * spread.t).toFixed(2));
      ring.style.opacity = (opacity * (1 - spread.t)).toFixed(3);
    },
    onComplete: () => {
      ring.style.opacity = "0";
    },
  }, at);
}

/** Where a path ends — or starts, for a signal travelling it backwards. */
export function endOf(path: SVGGeometryElement, reverse = false): DOMPoint {
  return path.getPointAtLength(reverse ? 0 : path.getTotalLength());
}
