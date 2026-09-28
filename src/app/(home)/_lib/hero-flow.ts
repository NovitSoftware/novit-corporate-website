import type { IconName } from "@/components/ui/Icon";
import { gsap, scroller, ScrollTrigger } from "@/lib/gsap";
import { onPageReveal } from "@/lib/page-reveal";

/*
 * The home hero's flow: an agentic business process, drawn the way the
 * Academia's architecture is drawn and running the way one runs.
 *
 * Work arrives from four channels and waits in a queue. The orchestrator
 * takes the next item and hands it to a free agent; the agent works it;
 * guardrails check the result and send an exception to a person first; the
 * result is written to a system of record. Under it, throughput against a
 * baseline — one agent's. The flow opens with one agent at work and the
 * queue full, the other three come online, the queue drains and the line
 * climbs off the baseline and stays there.
 *
 * It is simulated, not choreographed: a small queueing model on its own
 * clock, drawn every frame from the model's state. An item is always where
 * the model has it, the queue holds exactly what is waiting, and the chart
 * plots the agents the model has busy — each one completing one agent's
 * worth — so the gain it shows is the one the model produces, not one drawn
 * in. Plotting completions instead was honest and unreadable: one agent
 * finishes an item every three seconds or so, and a count that small jumps
 * from nothing to double between samples.
 */

/* ----------------------------------------------------------------------------
 * The drawing, in viewBox units. At the width the hero gives it one unit is
 * about one CSS pixel.
 * ------------------------------------------------------------------------- */

export const VIEW = { width: 560, height: 640 };
export const PLATE = 30;
const HALF = PLATE / 2;
/** The spine everything converges on. */
export const CX = 280;

/** Where work comes from: a row of channels, each ticking down to one bus. */
export const SOURCES: readonly { x: number; icon: IconName }[] = [
  { x: 100, icon: "mail" },
  { x: 220, icon: "document" },
  { x: 340, icon: "chat" },
  { x: 460, icon: "blocks" },
];
export const SRC_TOP = 20;
const SRC_BUS = 74;

/** The queue: slots stacked over the orchestrator, the head at the bottom. */
export const QUEUE = { top: 84, slots: 6, pitch: 14, width: 18 };
const QUEUE_BOTTOM = QUEUE.top + QUEUE.slots * QUEUE.pitch + 4;
const slotY = (index: number) => QUEUE_BOTTOM - 2 - QUEUE.pitch / 2 - index * QUEUE.pitch;

/** The orchestrator, as the board draws it. */
export const HEX = { left: CX - 104, right: CX + 104, top: 186, bottom: 230, inset: 20 };
export const HEX_MID = (HEX.top + HEX.bottom) / 2;

/** The agents, one lane each. */
export const AGENTS = [100, 220, 340, 460] as const;
const FAN_BUS = 254;
export const AG_TOP = 276;
export const AG_Y = AG_TOP + HALF;
/** The ring that fills while an agent works. */
export const PROGRESS_R = 21;
const MERGE_BUS = 330;

/** Guardrails on the spine; a person beside them for the exceptions. */
export const GUARD = { x: CX, top: 350 };
const GUARD_Y = GUARD.top + HALF;
export const REVIEW = { x: 440, top: 387 };
export const REVIEW_Y = REVIEW.top + HALF;

/** The systems of record. */
export const SYSTEMS: readonly { x: number; icon: IconName }[] = [
  { x: 160, icon: "database" },
  { x: 280, icon: "blocks" },
  { x: 400, icon: "link" },
];
const SYS_BUS = 434;
export const SYS_TOP = 454;

/** Throughput, as a monitor plots it: a scrolling series over a baseline. */
export const CHART = { left: 40, right: 520, top: 532, bottom: 612 };
/** The chart's scale, in multiples of the baseline. */
const CHART_MAX = 4.2;
/** Samples on screen, and how often one is taken, in s. */
const POINTS = 31;
const BUCKET = 0.8;
const PITCH = (CHART.right - CHART.left) / (POINTS - 1);

/** What is drawn and stays: the wiring, in the order it is drawn in. */
export const WIRES: readonly string[] = [
  ...SOURCES.map(({ x }) => `M${x} ${SRC_TOP + PLATE + 3} V${SRC_BUS}`),
  `M${SOURCES[0].x} ${SRC_BUS} H${SOURCES[3].x}`,
  `M${CX} ${SRC_BUS} V${QUEUE.top}`,
  `M${CX} ${QUEUE_BOTTOM} V${HEX.top}`,
  `M${CX} ${HEX.bottom} V${FAN_BUS}`,
  `M${AGENTS[0]} ${FAN_BUS} H${AGENTS[3]}`,
  `M${AGENTS[0]} ${MERGE_BUS} H${AGENTS[3]}`,
  `M${CX} ${MERGE_BUS} V${GUARD.top}`,
  `M${CX + HALF + 3} ${GUARD_Y} H${REVIEW.x} V${REVIEW.top}`,
  `M${REVIEW.x - HALF} ${REVIEW_Y} H${CX}`,
  `M${CX} ${GUARD.top + PLATE} V${SYS_BUS}`,
  `M${SYSTEMS[0].x} ${SYS_BUS} H${SYSTEMS[2].x}`,
  ...SYSTEMS.map(({ x }) => `M${x} ${SYS_BUS} V${SYS_TOP}`),
];

/** Each lane's own two ticks, which dim with it while it is idle. */
export const laneWires = (x: number) => [
  `M${x} ${FAN_BUS} V${AG_TOP}`,
  `M${x} ${AG_TOP + PLATE} V${MERGE_BUS}`,
];

/** The ways an item travels, by name. Never drawn: the wires above are. */
export const ROUTES: Record<string, string> = {
  ...Object.fromEntries(
    SOURCES.map(({ x }, index) => [
      `in-${index}`,
      `M${x} ${SRC_TOP + PLATE + 3} V${SRC_BUS} H${CX} V${QUEUE.top + 2}`,
    ]),
  ),
  take: `M${CX} ${slotY(0)} V${HEX_MID}`,
  ...Object.fromEntries(
    AGENTS.map((x, index) => [`out-${index}`, `M${CX} ${HEX_MID} V${FAN_BUS} H${x} V${AG_TOP - 3}`]),
  ),
  ...Object.fromEntries(
    AGENTS.map((x, index) => [`down-${index}`, `M${x} ${AG_TOP + PLATE + 3} V${MERGE_BUS} H${CX} V${GUARD.top - 3}`]),
  ),
  review: `M${CX + HALF + 3} ${GUARD_Y} H${REVIEW.x} V${REVIEW.top - 3}`,
  ...Object.fromEntries(
    SYSTEMS.map(({ x }, index) => [`commit-${index}`, `M${CX} ${GUARD.top + PLATE + 3} V${SYS_BUS} H${x} V${SYS_TOP - 3}`]),
  ),
  ...Object.fromEntries(
    SYSTEMS.map(({ x }, index) => [
      `back-${index}`,
      `M${REVIEW.x - HALF - 3} ${REVIEW_Y} H${CX} V${SYS_BUS} H${x} V${SYS_TOP - 3}`,
    ]),
  ),
};

/** Items the drawing can show at once, and rings it can leave. */
export const JOBS = 18;
export const RINGS = 6;

/* ----------------------------------------------------------------------------
 * The chart
 * ------------------------------------------------------------------------- */

const chartY = (value: number) =>
  CHART.bottom - (Math.min(value, CHART_MAX) / CHART_MAX) * (CHART.bottom - CHART.top);

export const BASELINE_Y = chartY(1);

/** A series as a line and the area under it, `phase` of a sample scrolled
 *  left, with `head` as the live value at the right edge. */
export function chartPaths(series: readonly number[], phase = 0, head = series[series.length - 1]) {
  const points = series.map((value, index) => [CHART.left + (index - phase) * PITCH, chartY(value)] as const);
  points.push([CHART.right, chartY(head)]);
  // Through the midpoints, so the line is smooth and still meets every sample.
  let line = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    line += ` Q${x.toFixed(1)} ${y.toFixed(1)} ${((x + nx) / 2).toFixed(1)} ${((y + ny) / 2).toFixed(1)}`;
  }
  const [lx, ly] = points[points.length - 1];
  line += ` L${lx.toFixed(1)} ${ly.toFixed(1)}`;
  const area = `${line} L${lx.toFixed(1)} ${CHART.bottom} L${points[0][0].toFixed(1)} ${CHART.bottom} Z`;
  return { line, area, head: { x: lx, y: ly } };
}

/**
 * The series as it stands once the flow has run a while — on the baseline
 * with one agent, then off it as the others come online. What reduced motion
 * and the first paint show; with motion the chart starts on the baseline and
 * climbs live.
 */
export function settledSeries(): number[] {
  return Array.from({ length: POINTS }, (_, index) => {
    const k = Math.min(1, Math.max(0, (index - 9) / 12));
    const eased = k * k * (3 - 2 * k);
    return 1 + 2.4 * eased + 0.08 * Math.sin(index * 1.7);
  });
}

/* ----------------------------------------------------------------------------
 * The model
 * ------------------------------------------------------------------------- */

/** How fast an item travels, in units a second. */
const SPEED = 190;
/** Mean seconds between arrivals; each gap is drawn from ±60% of it. */
const ARRIVE = 0.9;
/** The orchestrator deciding, and the least it waits between two decisions, s. */
const DECIDE = 0.18;
const DISPATCH_GAP = 0.3;
/** An agent's work on one item: the least and the spread, s. */
const WORK = 1.7;
const WORK_SPREAD = 0.8;
/** Guardrails checking a result, and a person reviewing an exception, s. */
const CHECK = 0.22;
const REVIEW_HOLD = 1.8;
/** The share of results guardrails send to a person. */
const EXCEPTIONS = 0.15;
/** How long the model runs with one agent before it is first drawn, s: long
 *  enough for the queue to fill and every sample on the chart to be one
 *  agent's throughput. */
const WARM_UP = 36;
/** When lanes two to four come online, s after the flow is first drawn. */
const RAMP = [4, 6.5, 9].map((at) => WARM_UP + at);
/** How quickly the plotted throughput follows the model, s. */
const SMOOTHING = 1.2;
/** How long a part stays lit after an item reaches it, s. */
const GLOW = 0.7;

type Stage =
  | "in"
  | "queued"
  | "take"
  | "decide"
  | "out"
  | "work"
  | "down"
  | "check"
  | "review"
  | "hold"
  | "back"
  | "commit";

type Job = {
  dot: SVGCircleElement;
  stage: Stage;
  start: number;
  duration: number;
  route: string;
  lane: number;
  system: number;
  exception: boolean;
  /** Its height while it waits in the queue, eased towards its slot. */
  y: number;
};

const ease = (k: number) => 0.5 - Math.cos(Math.PI * k) / 2;
const clamp = (k: number) => Math.min(1, Math.max(0, k));

/**
 * Sets the flow going. Returns a cleanup.
 *
 * `motion` false is reduced motion: the drawing stays as rendered — every
 * lane online and the chart already off the baseline — and nothing runs.
 */
export function mountFlow(root: HTMLElement, motion: boolean, context: gsap.Context): () => void {
  if (!motion) {
    return () => {};
  }

  const q = gsap.utils.selector(root);
  const routes = new Map(
    q<SVGPathElement>("[data-route]").map((path) => [path.dataset.route ?? "", { path, length: path.getTotalLength() }]),
  );
  const hubs = new Map(q<SVGElement>("[data-glow]").map((element) => [element.dataset.glow ?? "", element]));
  const lanes = q<SVGGElement>("[data-lane]");
  const progress = q<SVGCircleElement>("[data-progress]");
  const reviewRing = root.querySelector<SVGCircleElement>("[data-review-progress]");
  const dots = q<SVGCircleElement>(".hero-flow_job");
  const rings = q<SVGCircleElement>(".hero-flow_ring");
  const line = root.querySelector<SVGPathElement>(".hero-flow_trend");
  const area = root.querySelector<SVGPathElement>(".hero-flow_area");
  const headDot = root.querySelector<SVGCircleElement>(".hero-flow_head");
  const circumference = 2 * Math.PI * PROGRESS_R;

  const travel = (name: string) => (routes.get(name)?.length ?? 0) / SPEED;

  /* The model's state. `clock` is its own time, in s: it only moves while the
     flow can be seen, so nothing jumps when it comes back into view. */
  let clock = 0;
  let active = 1;
  const laneFade = AGENTS.map((_, index) => (index === 0 ? 1 : 0));
  const working: (Job | null)[] = AGENTS.map(() => null);
  const busy: boolean[] = AGENTS.map(() => false);
  const jobs: Job[] = [];
  const queue: Job[] = [];
  const free = [...dots];
  const lit = new Map<string, number>();
  const bursts: { ring: SVGCircleElement; x: number; y: number; start: number }[] = [];
  let ringIndex = 0;
  let nextArrival = 0.3;
  let nextDispatch = 0;
  const series = Array.from({ length: POINTS }, () => 1);
  let shown = 1;
  let sampled = 0;

  const glow = (name: string) => lit.set(name, clock);

  const begin = (job: Job, stage: Stage, route = "", duration = travel(route)) => {
    job.stage = stage;
    job.start = clock;
    job.route = route;
    job.duration = duration;
  };

  const finish = (job: Job) => {
    const system = SYSTEMS[job.system];
    glow(`sys-${job.system}`);
    const ring = rings[ringIndex++ % rings.length];
    if (ring) {
      bursts.push({ ring, x: system.x, y: SYS_TOP + HALF, start: clock });
    }
    jobs.splice(jobs.indexOf(job), 1);
    job.dot.style.opacity = "0";
    free.push(job.dot);
  };

  /** Moves the model on by `dt` seconds. */
  const step = (dt: number) => {
    clock += dt;

    // Lanes come online on their schedule.
    while (active < AGENTS.length && clock >= RAMP[active - 1]) {
      glow(`ag-${active}`);
      active++;
    }

    // Arrivals, while the queue has room for them.
    if (clock >= nextArrival) {
      const arriving = jobs.filter((job) => job.stage === "in").length;
      const dot = free.pop();
      if (dot && queue.length + arriving < QUEUE.slots) {
        const source = Math.floor(Math.random() * SOURCES.length);
        const job: Job = { dot, stage: "in", start: 0, duration: 0, route: "", lane: 0, system: 0, exception: false, y: QUEUE.top };
        begin(job, "in", `in-${source}`);
        jobs.push(job);
        glow(`src-${source}`);
      } else if (dot) {
        free.push(dot);
      }
      nextArrival = clock + ARRIVE * (0.4 + 1.2 * Math.random());
    }

    // The orchestrator hands the head of the queue to a free agent, once the
    // head has settled into its slot.
    if (clock >= nextDispatch && queue.length && Math.abs(queue[0].y - slotY(0)) < 1) {
      const idle = busy.map((taken, index) => (!taken && index < active ? index : -1)).filter((index) => index >= 0);
      if (idle.length) {
        const job = queue.shift()!;
        job.lane = idle[Math.floor(Math.random() * idle.length)];
        busy[job.lane] = true;
        begin(job, "take", "take");
        nextDispatch = clock + DISPATCH_GAP;
      }
    }

    for (const job of [...jobs]) {
      const elapsed = clock - job.start;
      if (job.stage === "queued") {
        const target = slotY(queue.indexOf(job));
        job.y += (target - job.y) * (1 - Math.exp(-dt * 12));
        continue;
      }
      if (elapsed < job.duration) {
        continue;
      }
      switch (job.stage) {
        case "in":
          begin(job, "queued", "", Infinity);
          job.y = QUEUE.top + 2;
          queue.push(job);
          break;
        case "take":
          begin(job, "decide", "", DECIDE);
          glow("hex");
          break;
        case "decide":
          begin(job, "out", `out-${job.lane}`);
          break;
        case "out":
          begin(job, "work", "", WORK + Math.random() * WORK_SPREAD);
          working[job.lane] = job;
          break;
        case "work":
          working[job.lane] = null;
          busy[job.lane] = false;
          glow(`ag-${job.lane}`);
          begin(job, "down", `down-${job.lane}`);
          break;
        case "down":
          begin(job, "check", "", CHECK);
          glow("guard");
          break;
        case "check":
          job.system = Math.floor(Math.random() * SYSTEMS.length);
          job.exception = Math.random() < EXCEPTIONS;
          if (job.exception) {
            begin(job, "review", "review");
          } else {
            begin(job, "commit", `commit-${job.system}`);
          }
          break;
        case "review":
          begin(job, "hold", "", REVIEW_HOLD);
          break;
        case "hold":
          glow("review");
          begin(job, "back", `back-${job.system}`);
          break;
        case "back":
        case "commit":
          finish(job);
          break;
      }
    }

    // Throughput, in agents: how many have an item.
    const rate = busy.filter(Boolean).length;
    shown += (rate - shown) * (1 - Math.exp(-dt / SMOOTHING));
    if (clock - sampled >= BUCKET) {
      sampled += BUCKET;
      series.shift();
      series.push(shown);
    }

    for (let index = 0; index < AGENTS.length; index++) {
      const target = index < active ? 1 : 0;
      laneFade[index] += (target - laneFade[index]) * (1 - Math.exp(-dt * 4));
    }
  };

  /** Draws the model as it stands. */
  const paint = () => {
    for (const job of jobs) {
      const { dot } = job;
      let x = CX;
      let y = job.y;
      let visible = true;
      if (job.route) {
        const route = routes.get(job.route);
        if (route) {
          const point = route.path.getPointAtLength(route.length * ease(clamp((clock - job.start) / job.duration)));
          x = point.x;
          y = point.y;
        }
      } else if (job.stage === "decide") {
        y = HEX_MID;
      } else if (job.stage !== "queued") {
        // Inside a part — an agent, the guardrails, the reviewer.
        visible = false;
      }
      dot.setAttribute("cx", x.toFixed(1));
      dot.setAttribute("cy", y.toFixed(1));
      dot.style.opacity = visible ? "1" : "0";
    }

    for (const [name, element] of hubs) {
      const since = clock - (lit.get(name) ?? -Infinity);
      const lane = name.startsWith("ag-") ? Number(name.slice(3)) : -1;
      const steady = lane >= 0 && working[lane] ? 0.55 : 0;
      element.style.opacity = Math.max(steady, 1 - since / GLOW).toFixed(3);
    }

    lanes.forEach((group, index) => {
      group.style.opacity = (0.28 + 0.72 * laneFade[index]).toFixed(3);
    });

    progress.forEach((ring, index) => {
      const job = working[index];
      const k = job ? clamp((clock - job.start) / job.duration) : 0;
      ring.style.strokeDashoffset = (circumference * (1 - k)).toFixed(1);
      ring.style.opacity = job ? "1" : "0";
    });

    if (reviewRing) {
      const job = jobs.find((item) => item.stage === "hold");
      const k = job ? clamp((clock - job.start) / job.duration) : 0;
      reviewRing.style.strokeDashoffset = (circumference * (1 - k)).toFixed(1);
      reviewRing.style.opacity = job ? "1" : "0";
    }

    for (const burst of [...bursts]) {
      const k = (clock - burst.start) / 0.8;
      if (k >= 1) {
        burst.ring.style.opacity = "0";
        bursts.splice(bursts.indexOf(burst), 1);
        continue;
      }
      burst.ring.setAttribute("cx", String(burst.x));
      burst.ring.setAttribute("cy", String(burst.y));
      burst.ring.setAttribute("r", (HALF + 2 + 14 * (1 - (1 - k) ** 2)).toFixed(1));
      burst.ring.style.opacity = (0.8 * (1 - k)).toFixed(3);
    }

    const chart = chartPaths(series, (clock - sampled) / BUCKET, shown);
    line?.setAttribute("d", chart.line);
    area?.setAttribute("d", chart.area);
    headDot?.setAttribute("cx", chart.head.x.toFixed(1));
    headDot?.setAttribute("cy", chart.head.y.toFixed(1));
  };

  /* ------------------------------------------------------------- the loop */

  let frame = 0;
  let running = false;
  let started = false;
  let visible = true;
  let last = 0;

  const tick = (now: number) => {
    // A hidden tab or a long frame moves the model on by one short step, not
    // by the gap.
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    step(dt);
    paint();
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || !started || !visible) {
      return;
    }
    running = true;
    last = 0;
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  // One agent at it for a while, unseen; the drawing is uncovered, then it
  // runs on from there.
  while (clock < WARM_UP) {
    step(1 / 30);
  }
  const chart = chartPaths(series);
  line?.setAttribute("d", chart.line);
  area?.setAttribute("d", chart.area);
  headDot?.setAttribute("cx", chart.head.x.toFixed(1));
  headDot?.setAttribute("cy", chart.head.y.toFixed(1));
  lanes.forEach((group, index) => {
    group.style.opacity = index === 0 ? "1" : "0.28";
  });

  const drawn = q(".hero-flow_wire, .hero-flow_draw, .hero-flow_glyph > *");
  const plates = q(".hero-flow_plate, .hero-flow_text, .hero-flow_baseline, .hero-flow_area, .hero-flow_head");
  gsap.set(drawn, { drawSVG: "0%" });
  gsap.set(plates, { opacity: 0 });
  const entrance = gsap.timeline({
    paused: true,
    onComplete: () => {
      // The trend is redrawn every frame at a new length; a dash left from
      // drawing it in would cut it short.
      gsap.set(drawn, { clearProps: "strokeDasharray,strokeDashoffset" });
      started = true;
      start();
    },
  });
  entrance
    .to(drawn, { drawSVG: "100%", duration: 1.4, ease: "power2.inOut", stagger: { amount: 1.2 } }, 0.2)
    .to(plates, { opacity: 1, duration: 0.6, ease: "sine.out", stagger: { amount: 0.8 } }, 0.6);

  const release = onPageReveal(() => {
    context.add(() => {
      // Drawn in once it is in view: beside the copy that is as the page
      // opens; below `xl`, where it follows the copy, when it is scrolled to.
      ScrollTrigger.create({
        trigger: root,
        scroller: scroller(),
        start: "top 85%",
        once: true,
        onEnter: () => entrance.play(),
      });
      // Nothing runs while the band is out of view.
      ScrollTrigger.create({
        trigger: root,
        scroller: scroller(),
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          visible = self.isActive;
          if (visible) {
            start();
          } else {
            stop();
          }
        },
      });
    });
  });

  return () => {
    stop();
    release();
    entrance.kill();
    // Back to the drawing as rendered, which is what reduced motion keeps.
    const meters = reviewRing ? [...progress, reviewRing] : progress;
    for (const element of [...dots, ...rings, ...hubs.values(), ...lanes, ...meters]) {
      element.style.removeProperty("opacity");
    }
    for (const ring of meters) {
      ring.style.removeProperty("stroke-dashoffset");
    }
    const settled = chartPaths(settledSeries());
    line?.setAttribute("d", settled.line);
    area?.setAttribute("d", settled.area);
    headDot?.setAttribute("cx", settled.head.x.toFixed(1));
    headDot?.setAttribute("cy", settled.head.y.toFixed(1));
  };
}
