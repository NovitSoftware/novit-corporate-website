import { gsap, scroller, ScrollTrigger } from "@/lib/gsap";
import { onPageReveal } from "@/lib/page-reveal";
import { ripple, trail } from "@/lib/signal";

/*
 * The hero's currents: a few lines wired the way the Academia's architecture
 * is wired — square runs, rounded corners, meeting at small plates — and a
 * signal that keeps finding its way through them.
 *
 * Drawn in a 1440 × 900 field anchored to the right of the band, so the
 * lines stand where the copy is not and run out under it, fading as they
 * go. Every line is written in the direction a signal travels it: in from
 * an edge of the band, from plate to plate, and out again — towards the copy
 * or off the foot of the band.
 */

export const FIELD = { width: 1440, height: 900 };

type Point = readonly [x: number, y: number];

/** The plates the lines meet at. */
export const HUBS = {
  a: [1120, 290],
  b: [1280, 520],
  c: [1010, 660],
} as const satisfies Record<string, Point>;

type Hub = keyof typeof HUBS;

/** A line: its corners in order, and the plate it ends at, if it ends at one. */
const LINES = {
  in1: { points: [[1440, 180], [1120, 180], HUBS.a], to: "a" },
  in2: { points: [[1440, 520], HUBS.b], to: "b" },
  in3: { points: [[1370, 900], [1370, 760], [1280, 760], HUBS.b], to: "b" },
  ab: { points: [HUBS.a, [1280, 290], HUBS.b], to: "b" },
  bc: { points: [HUBS.b, [1180, 520], [1180, 660], HUBS.c], to: "c" },
  outA: { points: [HUBS.a, [720, 290]], to: null },
  outC: { points: [HUBS.c, [1010, 900]], to: null },
} as const satisfies Record<string, { points: readonly Point[]; to: Hub | null }>;

export type LineName = keyof typeof LINES;

/** The ways a signal can go, each a run of lines end to end. */
const ROUTES: readonly (readonly LineName[])[] = [
  ["in1", "outA"],
  ["in1", "ab", "bc", "outC"],
  ["in2", "bc", "outC"],
  ["in3", "bc"],
  ["in2"],
  ["in1", "ab"],
];

/** Corner radius, in field units. */
const RADIUS = 34;

/** A run of square legs with its corners rounded. */
function rounded(points: readonly Point[]): string {
  const sign = (n: number) => Math.sign(n);
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    const r = Math.min(RADIUS, Math.hypot(x - px, y - py) / 2, Math.hypot(nx - x, ny - y) / 2);
    d += ` L${x - sign(x - px) * r} ${y - sign(y - py) * r} Q${x} ${y} ${x + sign(nx - x) * r} ${y + sign(ny - y) * r}`;
  }
  const [lx, ly] = points[points.length - 1];
  return `${d} L${lx} ${ly}`;
}

export const lines = (Object.keys(LINES) as LineName[]).map((name) => ({
  name,
  d: rounded(LINES[name].points),
}));

/** How fast a signal runs, in field units a second, and how long its light is. */
const SPEED = 250;
const RUN = 120;

/**
 * Sets the currents going. Returns a cleanup.
 *
 * Reduced motion never calls this: the lines stand drawn and nothing runs.
 */
export function mountCurrents(root: HTMLElement, context: gsap.Context): () => void {
  const q = gsap.utils.selector(root);
  const byName = <T extends Element>(selector: string, key: string) =>
    new Map(q<T>(selector).map((element) => [element.getAttribute(key) ?? "", element]));
  const paths = byName<SVGPathElement>(".hero-currents_line", "data-line");
  const trails = byName<SVGPathElement>(".hero-currents_trail", "data-line");
  const pulses = byName<SVGCircleElement>(".hero-currents_pulse", "data-hub");

  let visible = true;
  let last = -1;
  let current: gsap.core.Timeline | null = null;
  let next: gsap.core.Tween | null = null;
  let disposed = false;

  /** One signal, along a route picked at random — never the same twice running. */
  const send = () => {
    if (disposed) {
      return;
    }
    let pick = Math.floor(Math.random() * ROUTES.length);
    if (pick === last) {
      pick = (pick + 1) % ROUTES.length;
    }
    last = pick;

    // Legs follow each other at one speed, each leaving as the last one's
    // light reaches the plate, so the signal reads as one run through the
    // system rather than a hop per line.
    const timeline = gsap.timeline();
    let at = 0;
    for (const name of ROUTES[pick]) {
      const line = trails.get(name);
      const path = paths.get(name);
      if (!line || !path) {
        continue;
      }
      const length = path.getTotalLength();
      trail(timeline, line, { at, duration: (length + RUN) / SPEED, length: RUN, ease: "none" });
      at += length / SPEED;
      const hub = LINES[name].to;
      const pulse = hub ? pulses.get(hub) : undefined;
      if (hub && pulse) {
        const [x, y] = HUBS[hub];
        ripple(timeline, pulse, { x, y }, at, { from: 7, to: 26, duration: 1.1, opacity: 0.55 });
      }
    }
    current = timeline;
    // The next one leaves before this one has gone, now and then while it is
    // still running: the band is never still, and never busy.
    next = gsap.delayedCall(at * 0.7 + gsap.utils.random(0.4, 1.8), send);
    if (!visible) {
      timeline.pause();
      next.pause();
    }
  };

  // Drawn in as the page opens, from the edges inwards, and then the first
  // signal goes.
  const drawn = q(".hero-currents_line");
  const hubs = q(".hero-currents_hub");
  gsap.set(drawn, { drawSVG: "0%" });
  gsap.set(hubs, { opacity: 0 });
  const entrance = gsap.timeline({ paused: true, onComplete: send });
  entrance
    .to(drawn, { drawSVG: "100%", duration: 2.2, ease: "power2.inOut", stagger: 0.16 }, 0.3)
    .to(hubs, { opacity: 1, duration: 0.8, ease: "sine.out", stagger: 0.2 }, 1.2);

  const release = onPageReveal(() => {
    context.add(() => {
      entrance.play();
      // Nothing runs while the band is out of view.
      ScrollTrigger.create({
        trigger: root,
        scroller: scroller(),
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          visible = self.isActive;
          for (const tween of [current, next]) {
            if (visible) {
              tween?.resume();
            } else {
              tween?.pause();
            }
          }
        },
      });
    });
  });

  return () => {
    disposed = true;
    release();
    entrance.kill();
    current?.kill();
    next?.kill();
    gsap.set([...trails.values()], { opacity: 0 });
    gsap.set([...pulses.values()], { opacity: 0 });
  };
}
