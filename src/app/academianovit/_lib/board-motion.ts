import { gsap, scroller, ScrollTrigger } from "@/lib/gsap";
import { onPageReveal } from "@/lib/page-reveal";
import { endOf, ripple, travel } from "@/lib/signal";

/*
 * The board's motion: the drawing, the request that keeps crossing it, and
 * the route a hovered part lights up.
 *
 * Everything addresses the drawing by name. A part of it — a node, a link,
 * a note — carries `data-part`; a path a request can travel carries
 * `data-route`; a part that answers the pointer carries `data-node`. The
 * routes below are written in those names, so the geometry lives in the
 * component and the story lives here.
 */

/** One stretch of a request: the paths it takes at once, and what lights
 *  when it arrives. */
type Step = {
  legs: readonly string[];
  glow?: readonly string[];
  /** Travels the path end to start — the answer coming back. */
  reverse?: boolean;
};

/** One pass along a route: what it lights for as long as it runs, and its
 *  steps in order. */
type Lap = {
  lit: readonly string[];
  steps: readonly Step[];
};

type Route = {
  laps: readonly Lap[];
  /** The idle loop: nothing is pointed at, so nothing is dimmed. */
  dimless?: boolean;
};

const CHANNELS = 4;
const AGENTS = 3;
const SYSTEMS = 4;
/** The system the idle loop indexes from: SAP · ERP, where most of a
 *  client's documents live. */
const SOURCE = 1;
/** How fast a request travels, in viewBox units a second, and the limits on
 *  one leg — so a long wire is not a blur and a short hop is not a blink. */
const SPEED = 170;
const LEG_MIN = 0.45;
const LEG_MAX = 2.2;
/** Seconds a part holds the request before it moves on. */
const HOLD = 0.16;
/** Seconds between one request and the next. */
const LAP_REST = 0.5;
/** The drawing's cadence: one step every this many seconds. */
const STEP_GAP = 0.26;
/** The most any one step spends staggering its parts, s. */
const STEP_SPREAD = 0.24;

const range = (count: number) => Array.from({ length: count }, (_, index) => index);

/**
 * A whole request: it leaves a channel, the orchestrator hands it to an
 * agent, the agent's model writes a query, the RAG answers it — the
 * retriever reads the vector store and builds the context — the model
 * reasons over that context and calls a tool on a system; the result comes
 * back, the orchestrator merges it, and the answer goes out the channel the
 * request came in by.
 */
function request(channel: number, agent: number, system: number): Step[] {
  return [
    { legs: [], glow: [`ch-${channel}`] },
    { legs: [`in-${channel}`], glow: ["hex"] },
    ...fromAgent(agent, system),
    { legs: [`in-${channel}`], glow: [`ch-${channel}`], reverse: true },
  ];
}

/** The same request from the moment an agent has it, to the orchestrator
 *  taking its result back. */
function fromAgent(agent: number, system: number): Step[] {
  return [
    { legs: [`out-${agent}`], glow: [`ag-${agent}`, "agents", "llm"] },
    ...inside(),
    { legs: ["answer"], glow: ["llm", `ag-${agent}`] },
    { legs: [`sys-${system}`], glow: [`sys-${system}`] },
    { legs: [`sys-${system}`], glow: ["llm", `ag-${agent}`], reverse: true },
    { legs: [`out-${agent}`], glow: ["hex"], reverse: true },
  ];
}

/**
 * The query inside the RAG, one continuous line: down onto the retriever,
 * across to the vector store and back with what it found, on to the
 * context. Each leg starts on the square the last one reached.
 */
function inside(): Step[] {
  return [
    { legs: ["ask"], glow: ["rag", "rag-4"] },
    { legs: ["pipe-4"], glow: ["rag-3"], reverse: true },
    { legs: ["pipe-4"], glow: ["rag-4"] },
    { legs: ["pipe-5"], glow: ["rag-5"] },
  ];
}

/** What an agent's part of a request lights: from the orchestrator on. */
function agentParts(agent: number, system: number): string[] {
  return [
    "hex", `out-${agent}`, `ag-${agent}`, "agents", "llm",
    "ask", "rag", "rag-3", "pipe-4", "rag-4", "pipe-5", "rag-5", "answer",
    "act", "bus", `tick-${system}`, `sys-${system}`,
  ];
}

function requestParts(channel: number, agent: number, system: number): string[] {
  return [`ch-${channel}`, `in-${channel}`, ...agentParts(agent, system)];
}

/** Indexing: a system's documents go into the knowledge base — split into
 *  chunks, embedded, stored — once, for every agent to query. */
function indexing(system: number): Lap {
  return {
    lit: [
      `sys-${system}`, `tick-${system}`, "bus", "ingest", "rag",
      "rag-0", "pipe-1", "rag-1", "pipe-2", "rag-2", "pipe-3", "rag-3", "note-rag",
    ],
    steps: [
      { legs: [], glow: [`sys-${system}`] },
      { legs: [`ingest-${system}`], glow: ["rag-0"] },
      { legs: ["pipe-1"], glow: ["rag-1"] },
      { legs: ["pipe-2"], glow: ["rag-2"] },
      { legs: ["pipe-3"], glow: ["rag-3"] },
    ],
  };
}

const query: Lap = {
  lit: ["agents", "llm", "ask", "rag", "rag-3", "pipe-4", "rag-4", "pipe-5", "rag-5", "answer", "note-rag"],
  steps: [...inside(), { legs: ["answer"], glow: ["llm"] }],
};

/** The idle loop: the knowledge base is indexed, then one request per
 *  channel queries it, each handed to the next agent. */
const AUTO: Route = {
  dimless: true,
  laps: [
    indexing(SOURCE),
    ...range(CHANNELS).map((channel) => ({
      lit: [],
      steps: request(channel, channel % AGENTS, channel % SYSTEMS),
    })),
  ],
};

/** What each part shows when the pointer is on it. */
function routeFor(node: string): Route | null {
  const [kind, raw] = node.split("-");
  const n = Number(raw);

  switch (kind) {
    // A channel: its request, handed to each agent in turn — the orchestrator
    // deciding, lap by lap.
    case "ch":
      return {
        laps: range(AGENTS).map((agent) => ({
          lit: requestParts(n, agent, (n + agent) % SYSTEMS),
          steps: request(n, agent, (n + agent) % SYSTEMS),
        })),
      };
    // The orchestrator: every channel converging on it, the work fanning out
    // to the agents, their results coming back to be merged, the answers
    // going out.
    case "hex":
      return {
        laps: [
          {
            lit: [
              ...range(CHANNELS).flatMap((c) => [`ch-${c}`, `in-${c}`]),
              "hex", "note-hex", "agents",
              ...range(AGENTS).flatMap((a) => [`out-${a}`, `ag-${a}`]),
            ],
            // Orchestrator-workers in full: split, delegate, merge, answer.
            steps: [
              { legs: [], glow: range(CHANNELS).map((c) => `ch-${c}`) },
              { legs: range(CHANNELS).map((c) => `in-${c}`), glow: ["hex"] },
              {
                legs: range(AGENTS).map((a) => `out-${a}`),
                glow: ["agents", ...range(AGENTS).map((a) => `ag-${a}`)],
              },
              { legs: range(AGENTS).map((a) => `out-${a}`), glow: ["hex"], reverse: true },
              {
                legs: range(CHANNELS).map((c) => `in-${c}`),
                glow: range(CHANNELS).map((c) => `ch-${c}`),
                reverse: true,
              },
            ],
          },
        ],
      };
    // An agent: its work from the orchestrator on, acting on each system in turn.
    case "ag":
      return {
        laps: range(SYSTEMS).map((system) => ({
          lit: agentParts(n, system),
          steps: fromAgent(n, system),
        })),
      };
    // The model: every agent reasons with it, in turn.
    case "llm":
      return {
        laps: range(AGENTS).map((agent) => ({
          lit: agentParts(agent, (agent + 1) % SYSTEMS),
          steps: fromAgent(agent, (agent + 1) % SYSTEMS),
        })),
      };
    // A system: the model's tool call reaching it and the result coming back,
    // and its documents going into the knowledge base.
    case "sys":
      return {
        laps: [
          {
            lit: ["agents", "llm", "act", "bus", `tick-${n}`, `sys-${n}`],
            steps: [
              { legs: [`sys-${n}`], glow: [`sys-${n}`] },
              { legs: [`sys-${n}`], glow: ["llm"], reverse: true },
            ],
          },
          indexing(n),
        ],
      };
    // The RAG: indexed once, read on every question. Any indexing step shows
    // both, so a document is seen ending up as an agent's context.
    case "rag":
      if (Number.isNaN(n) || n < 4) {
        return { laps: [indexing(SOURCE), query] };
      }
      return { laps: [query] };
    // Governance holds over every request, so it runs one from each channel
    // in turn — and, like every other part, lights exactly what it runs.
    case "gov":
      return {
        laps: range(CHANNELS).map((channel) => ({
          lit: [...requestParts(channel, channel % AGENTS, channel % SYSTEMS), `gov-${n}`],
          steps: request(channel, channel % AGENTS, channel % SYSTEMS),
        })),
      };
    default:
      return null;
  }
}

/**
 * Sets the board up for motion. Returns a cleanup.
 *
 * `motion` false is reduced motion: the drawing is left finished, nothing
 * travels, and a hovered part still lights its route — a highlight is not
 * movement.
 */
export function mountBoard(root: HTMLElement, motion: boolean, context: gsap.Context): () => void {
  const svg = root.querySelector<SVGSVGElement>(".academy-board_art");
  if (!svg) {
    return () => {};
  }

  // One board per element, whatever remounted it. A second instance on the
  // same drawing drives the same dots, and a loop nobody owns any more keeps
  // running where the highlight says nothing is happening.
  const host = root as HTMLElement & { disposeBoard?: () => void };
  host.disposeBoard?.();

  const q = gsap.utils.selector(root);
  const parts = new Map<string, Element[]>();
  for (const element of q("[data-part]")) {
    const name = element.getAttribute("data-part") ?? "";
    parts.set(name, [...(parts.get(name) ?? []), element]);
  }
  const route = (name: string) => root.querySelector<SVGPathElement>(`[data-route="${name}"]`);
  const pulses = q<SVGCircleElement>(".board-pulse");
  const rings = q<SVGCircleElement>(".board-ring");
  let ring = 0;

  let drawn = !motion;
  let visible = true;
  let idle: gsap.core.Timeline | null = null;
  let focused: gsap.core.Timeline | null = null;
  let focus: string | null = null;
  // Everything below that fires later — the idle loop coming back after a
  // hover, a hover ending — is scheduled after mount, so the GSAP context
  // never sees it and cannot revert it. These are cancelled by hand, and
  // `disposed` stops anything already on its way.
  let resume: gsap.core.Tween | null = null;
  let leaving: gsap.core.Tween | null = null;
  let disposed = false;

  const each = (names: readonly string[], fn: (element: Element) => void) => {
    for (const name of names) {
      for (const element of parts.get(name) ?? []) {
        fn(element);
      }
    }
  };

  const setLit = (names: readonly string[]) => {
    for (const element of q(".is-lit")) {
      element.classList.remove("is-lit");
    }
    each(names, (element) => element.classList.add("is-lit"));
  };

  const glow = (names: readonly string[]) => {
    if (disposed) {
      return;
    }
    each(names, (element) => {
      element.classList.add("is-glow");
      gsap.delayedCall(0.6, () => element.classList.remove("is-glow"));
    });
  };

  /** The ring a request leaves where it arrives, on the next ring free. */
  const burst = (timeline: gsap.core.Timeline, path: SVGPathElement, at: number, reverse: boolean) => {
    const target = rings[ring++ % rings.length];
    if (target) {
      ripple(timeline, target, endOf(path, reverse), at);
    }
  };

  /** Lays a route out on a timeline: laps in order, steps in order, the legs
   *  of a step side by side. Placed by a cursor rather than by the timeline's
   *  length, so an arrival ring fading out does not hold the next leg back. */
  const build = (plan: Route, repeat: boolean) => {
    const timeline = gsap.timeline({ paused: true, repeat: repeat ? -1 : 0, repeatDelay: 0.5 });
    let cursor = 0;
    for (const lap of plan.laps) {
      if (!plan.dimless) {
        timeline.call(setLit, [lap.lit], cursor);
      }
      lap.steps.forEach((step, stepIndex) => {
        const at = cursor;
        let longest = 0;
        step.legs.forEach((name, index) => {
          const path = route(name);
          const pulse = pulses[index];
          if (!path || !pulse) {
            return;
          }
          const reverse = step.reverse ?? false;
          const duration = Math.min(LEG_MAX, Math.max(LEG_MIN, path.getTotalLength() / SPEED));
          longest = Math.max(longest, duration);
          travel(timeline, path, pulse, { at, duration, reverse });
          if (index === 0) {
            burst(timeline, path, at + duration - 0.05, reverse);
          }
        });
        if (process.env.NODE_ENV !== "production") {
          // Development only: lets a test follow the route leg by leg.
          timeline.call(announce, [step, stepIndex === 0], at);
        }
        const arrives = step.legs.length ? at + longest - 0.05 : at;
        if (step.glow) {
          timeline.call(glow, [step.glow], arrives);
        }
        // The next leg leaves while this part is still lit, so the request
        // reads as handed on rather than stopped and restarted.
        cursor = at + longest + HOLD;
      });
      cursor += LAP_REST;
    }
    timeline.set({}, {}, cursor);
    return timeline;
  };

  const announce = (step: Step, first: boolean) => {
    svg.dispatchEvent(
      new CustomEvent("board-step", {
        detail: { legs: step.legs, reverse: step.reverse ?? false, glow: step.glow ?? [], focus, first },
      }),
    );
  };

  const hidePulses = () => gsap.set([...pulses, ...rings], { opacity: 0 });

  const playIdle = () => {
    if (disposed || !motion || !drawn || !visible || focus) {
      return;
    }
    idle ??= build(AUTO, true);
    idle.play();
  };

  const clearFocus = () => {
    if (disposed || !focus) {
      return;
    }
    focus = null;
    delete svg.dataset.focus;
    setLit([]);
    focused?.kill();
    focused = null;
    hidePulses();
    resume?.kill();
    resume = gsap.delayedCall(0.8, playIdle);
  };

  const setFocus = (node: string) => {
    if (disposed || !drawn || node === focus) {
      return;
    }
    const plan = routeFor(node);
    if (!plan) {
      clearFocus();
      return;
    }
    focus = node;
    resume?.kill();
    idle?.pause();
    focused?.kill();
    hidePulses();

    // Everything a hover runs is lit and everything else dims, so nothing
    // ever moves where the highlight says nothing is happening. With motion
    // the laps light their own parts as they run; without it the whole route
    // is lit at once and stays.
    svg.dataset.focus = node;
    setLit(motion ? plan.laps[0].lit : plan.laps.flatMap((lap) => lap.lit));

    if (motion) {
      focused = build(plan, true);
      if (visible) {
        focused.play();
      }
    }
  };

  // Hover is delegated: one listener on the drawing, `data-node` decides.
  const onOver = (event: PointerEvent) => {
    const node = (event.target as Element).closest("[data-node]")?.getAttribute("data-node");
    leaving?.kill();
    if (node) {
      setFocus(node);
    } else {
      // Crossing the gap between two parts should not drop the route.
      leaving = gsap.delayedCall(0.18, clearFocus);
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
    const strokes = q(".board-draw, .board-glyph > *");
    const writing = q(".board-writing");
    gsap.set(strokes, { drawSVG: "0%" });
    gsap.set(q(".board-fill"), { fillOpacity: 0 });
    gsap.set(q(".board-text"), { opacity: 0, y: 4 });
    gsap.set(q(".board-note"), { opacity: 0, y: 6 });
    gsap.set(writing, { attr: { width: 0 } });

    drawing = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Hand opacity back to the stylesheet, which is what dims a part
        // off the hovered route; an inline 1 would outrank it.
        gsap.set(q(".board-text, .board-note"), { clearProps: "opacity,transform" });
        drawn = true;
        playIdle();
      },
    });
    // The title is written before anything is drawn under it.
    drawing.to(writing, { attr: { width: 700 }, duration: 0.9, ease: "power1.inOut" }, 0);
    q("[data-board-step]").forEach((step, index) => addStep(drawing!, step, index));

    // Drawn once, when the page is open and the board is in view. On the wide
    // layout it is in view as the page opens; below that it waits to be
    // scrolled to.
    release = onPageReveal(() => {
      context.add(() => {
        ScrollTrigger.create({
          trigger: root,
          scroller: scroller(),
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.delayedCall(0.3, () => drawing?.play());
          },
        });
        // Whatever travels is decoration: it only runs while it can be seen.
        ScrollTrigger.create({
          trigger: root,
          scroller: scroller(),
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            if (visible) {
              if (focused) {
                focused.play();
              } else {
                playIdle();
              }
            } else {
              idle?.pause();
              focused?.pause();
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
    idle?.kill();
    focused?.kill();
    hidePulses();
    delete svg.dataset.focus;
    for (const element of q(".is-lit, .is-glow")) {
      element.classList.remove("is-lit", "is-glow");
    }
    if (host.disposeBoard === dispose) {
      delete host.disposeBoard;
    }
  };
  host.disposeBoard = dispose;
  return dispose;
}

/**
 * One step of the drawing: its outlines draw, its fills settle in behind
 * them, its words arrive last — the order a hand puts them on a board. The
 * steps start on a fixed cadence and overlap, so the board fills as one
 * gesture rather than ten, and a step with twelve parts takes no longer than
 * one with four.
 */
function addStep(timeline: gsap.core.Timeline, step: Element, index: number) {
  const q = gsap.utils.selector(step);
  const label = `step-${index}`;
  timeline.addLabel(label, index * STEP_GAP);

  const add = (targets: Element[], vars: gsap.TweenVars, each: number, offset: number) => {
    if (targets.length) {
      timeline.to(
        targets,
        { ...vars, stagger: Math.min(each, STEP_SPREAD / Math.max(1, targets.length - 1)) },
        `${label}+=${offset}`,
      );
    }
  };

  add(q(".board-draw"), { drawSVG: "100%", duration: 0.6, ease: "power2.inOut" }, 0.05, 0);
  add(q(".board-fill"), { fillOpacity: 1, duration: 0.5, ease: "sine.out" }, 0.05, 0.2);
  add(q(".board-glyph > *"), { drawSVG: "100%", duration: 0.5, ease: "power2.out" }, 0.02, 0.15);
  add(q(".board-text"), { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.04, 0.3);
  add(q(".board-note"), { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.15, 0);
}
