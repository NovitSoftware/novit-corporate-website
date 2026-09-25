import { gsap, scroller, ScrollTrigger } from "@/lib/gsap";
import { onPageReveal } from "@/lib/page-reveal";
import { endOf, ripple, trail, travel } from "@/lib/signal";

/*
 * The customer map's motion: Argentina and its routes drawing in, then a
 * signal leaving home for each country in turn — or, while the pointer is on
 * one, for that one only.
 *
 * It is the board's motion at the scale of a continent, written with the same
 * marks (`@/lib/signal`) so the two read as one system: a route that lights
 * while it is in use, a run of light down it, a ring where it lands.
 */

/** How fast a signal crosses the map, in viewBox units a second, and the
 *  limits on one crossing — so the long routes do not drag and the short hop
 *  to Chile is still seen. */
const SPEED = 300;
const LEG_MIN = 1.1;
const LEG_MAX = 2.6;
/** Seconds between one country's signal and the next. */
const REST = 0.7;

type Focus = number | "home" | null;

/**
 * Sets the map up for motion. Returns a cleanup.
 *
 * `motion` false is reduced motion: the drawing is left finished, nothing
 * travels, and pointing at a country still lights its route.
 */
export function mountMap(root: HTMLElement, motion: boolean, context: gsap.Context): () => void {
  const svg = root.querySelector<SVGSVGElement>(".customer-map_art");
  if (!svg) {
    return () => {};
  }

  const q = gsap.utils.selector(root);
  const routes = q<SVGPathElement>(".customer-map_route");
  const trails = q<SVGPathElement>(".customer-map_trail");
  const signals = q<SVGCircleElement>(".customer-map_signal");
  const places = q<SVGGElement>("[data-place]");
  const home = root.querySelector<SVGGElement>("[data-home]");
  const pulses = places.map((place) => place.querySelector<SVGCircleElement>(".customer-map_pulse"));
  const homePulse = home?.querySelector<SVGCircleElement>(".customer-map_pulse") ?? null;

  let drawn = !motion;
  let visible = true;
  let focus: Focus = null;
  let loop: gsap.core.Timeline | null = null;
  let focused: gsap.core.Timeline | null = null;
  // Scheduled after mount, so the GSAP context never sees them: cancelled by
  // hand, the way the board does it.
  let resume: gsap.core.Tween | null = null;
  let leaving: gsap.core.Tween | null = null;
  let disposed = false;

  const setLit = (indices: readonly number[], homeLit: boolean) => {
    routes.forEach((path, index) => path.classList.toggle("is-lit", indices.includes(index)));
    places.forEach((place, index) => place.classList.toggle("is-lit", indices.includes(index)));
    home?.classList.toggle("is-lit", homeLit);
  };

  /** One signal, home to `index`, on `timeline` at `at`. Returns how long it takes. */
  const send = (timeline: gsap.core.Timeline, index: number, at: number) => {
    const path = routes[index];
    const duration = Math.min(LEG_MAX, Math.max(LEG_MIN, path.getTotalLength() / SPEED));
    if (homePulse) {
      ripple(timeline, homePulse, endOf(path, true), at, { from: 7, to: 22, duration: 0.8, opacity: 0.6 });
    }
    trail(timeline, trails[index], { at, duration, length: 64 });
    travel(timeline, path, signals[index], { at, duration });
    const pulse = pulses[index];
    if (pulse) {
      ripple(timeline, pulse, endOf(path), at + duration - 0.06, { from: 7, to: 30, duration: 1, opacity: 0.8 });
    }
    return duration;
  };

  /** The idle loop: every country in turn. */
  const buildLoop = () => {
    const timeline = gsap.timeline({ paused: true, repeat: -1 });
    let cursor = 0.2;
    routes.forEach((_, index) => {
      cursor += send(timeline, index, cursor) + REST;
    });
    timeline.set({}, {}, cursor);
    return timeline;
  };

  /** A pointed-at country, again and again; or home, to all of them at once. */
  const buildFocus = (target: Exclude<Focus, null>) => {
    const timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.5 });
    const indices = target === "home" ? routes.map((_, index) => index) : [target];
    const longest = Math.max(...indices.map((index) => send(timeline, index, 0.15)));
    timeline.set({}, {}, longest + 0.9);
    return timeline;
  };

  const quiet = () => {
    gsap.set([...signals, ...trails], { opacity: 0 });
    gsap.set([...pulses, homePulse].filter(Boolean), { opacity: 0 });
  };

  const playLoop = () => {
    if (disposed || !motion || !drawn || !visible || focus !== null) {
      return;
    }
    loop ??= buildLoop();
    loop.play();
  };

  const clearFocus = () => {
    if (disposed || focus === null) {
      return;
    }
    focus = null;
    delete svg.dataset.focus;
    setLit([], false);
    focused?.kill();
    focused = null;
    quiet();
    resume?.kill();
    resume = gsap.delayedCall(0.6, playLoop);
  };

  const setFocus = (target: Exclude<Focus, null>) => {
    if (disposed || !drawn || target === focus) {
      return;
    }
    focus = target;
    resume?.kill();
    loop?.pause();
    focused?.kill();
    quiet();
    svg.dataset.focus = "";
    setLit(target === "home" ? routes.map((_, index) => index) : [target], target === "home");
    if (motion) {
      focused = buildFocus(target);
      if (visible) {
        focused.play();
      }
    }
  };

  // Delegated, like the board's: only the hit circles answer the pointer.
  const onOver = (event: PointerEvent) => {
    const target = event.target as Element;
    const place = target.closest("[data-place]");
    leaving?.kill();
    if (place) {
      setFocus(Number(place.getAttribute("data-place")));
    } else if (target.closest("[data-home]")) {
      setFocus("home");
    } else {
      leaving = gsap.delayedCall(0.2, clearFocus);
    }
  };
  const onLeave = () => {
    leaving?.kill();
    clearFocus();
  };
  svg.addEventListener("pointerover", onOver);
  svg.addEventListener("pointerleave", onLeave);

  let drawing: gsap.core.Timeline | null = null;
  let release = () => {};

  if (motion) {
    // Home first — the outline tracing itself, the point settling on it —
    // then the routes running out of it, each country arriving as its route
    // reaches it.
    const outline = q(".customer-map_home-land");
    const dots = q(".customer-map_dot, .customer-map_home");
    gsap.set([...outline, ...routes], { drawSVG: "0%" });
    gsap.set(outline, { fillOpacity: 0 });
    gsap.set(dots, { scale: 0, transformOrigin: "50% 50%" });

    drawing = gsap.timeline({
      paused: true,
      onComplete: () => {
        drawn = true;
        playLoop();
      },
    });
    drawing
      .to(outline, { drawSVG: "100%", duration: 1.8, ease: "power2.inOut" }, 0)
      .to(outline, { fillOpacity: 1, duration: 1, ease: "sine.out" }, 1.2)
      .to(q(".customer-map_home"), { scale: 1, duration: 0.6, ease: "back.out(2)" }, 0.9)
      .to(routes, { drawSVG: "100%", duration: 1.2, ease: "power2.inOut", stagger: 0.14 }, 1.2)
      .to(q(".customer-map_dot"), { scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.14 }, 2.1);

    release = onPageReveal(() => {
      context.add(() => {
        ScrollTrigger.create({
          trigger: root,
          scroller: scroller(),
          start: "top 88%",
          once: true,
          onEnter: () => drawing?.play(),
        });
        // Decoration only runs while it can be seen.
        ScrollTrigger.create({
          trigger: root,
          scroller: scroller(),
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            if (!visible) {
              loop?.pause();
              focused?.pause();
            } else if (focused) {
              focused.play();
            } else {
              playLoop();
            }
          },
        });
      });
    });
  }

  const dispose = () => {
    if (disposed) {
      return;
    }
    disposed = true;
    release();
    svg.removeEventListener("pointerover", onOver);
    svg.removeEventListener("pointerleave", onLeave);
    resume?.kill();
    leaving?.kill();
    drawing?.kill();
    loop?.kill();
    focused?.kill();
    quiet();
    delete svg.dataset.focus;
    setLit([], false);
  };
  return dispose;
}
