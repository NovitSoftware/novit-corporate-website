import { agentSnake } from "@/content/inteligencia-artificial";
import { onPageReveal } from "@/lib/page-reveal";
import { considered, logEntry, pad, promptsThought, think, type LogEntry } from "./snake-copy";
import { COLS, MOVES, ROWS, SnakeAgent, type Point, type SnakeEvent } from "./snake-sim";

/*
 * The agent's motion: the field drawn on a canvas, the game advanced a step
 * at a time underneath, and the audit beside it written from the same
 * decision.
 *
 * The game is decided in steps; what is drawn never stops. It used to halt at
 * every new target and change of plan while its thinking streamed in, and
 * turn every corner square, which read as a program ticking rather than an
 * agent deciding. Now it thinks while it moves — the thought streams into
 * the audit as it goes, the route it is weighing drawing itself out ahead of
 * it — and its body is one line through the middles of the cells' edges, so
 * every turn is a quarter circle and a step never shows as a step.
 *
 * It is drawn as the site draws a signal: a thin celeste line fading back
 * along its length, a white point at its head, the map's ring round the
 * target and the board's ring where it arrives. The canvas never paints a
 * ground — the page's gradient is the ground — and its inks come from the
 * `--snake-*` properties in agent-snake.css, so the colours are changed there
 * and nowhere here.
 */

/** Milliseconds per move at 1×; the speed control divides it. */
const STEP_MS = 160;
/** How fast a thought streams at 1×, in characters a second: a model's pace,
 *  and still one a reader can follow. */
const THOUGHT_CPS = 110;
/** "Pensando" alone, before the first word; and how long a finished thought
 *  stays before the next one replaces it. Both at 1×. */
const THOUGHT_LEAD_MS = 240;
const THOUGHT_REST_MS = 900;
/** Steps a swallowed target takes to go from white back to the body's celeste. */
const DIGESTION = 9;
/** How long the last position holds before the next game fades in, and the fade. */
const END_HOLD_MS = 500;
const FADE_MS = 640;
/** A new target settling in, and the ring a captured one leaves. */
const APPEAR_MS = 420;
const RIPPLE_MS = 720;
/** The line's width and the light round it, in cells. */
const LINE = 0.15;
const HALO = 0.52;
/** How far round the head the field's points come up, in cells. */
const REACH = 3.2;

const copy = agentSnake;

type Inks = { body: string; head: string; target: string; grid: string; edge: string };
type Thinking = { words: string[]; shown: number; start: number; lead: number; stream: number };
type Dir = readonly [dx: number, dy: number];

/**
 * The line through one cell: in at the middle of the edge it came from, out
 * at the middle of the edge it leaves by — straight across, or a quarter
 * circle round the corner those two edges share.
 */
type Piece = {
  x: number;
  y: number;
  straight: boolean;
  din: Dir;
  /** The arc's centre, start angle and signed sweep, when it turns. */
  ox: number;
  oy: number;
  a0: number;
  sweep: number;
};

/** Mixes two hex colours; `k` 0 is `a`, 1 is `b`. */
function mix(a: string, b: string, k: number): string {
  const rgb = (hex: string) => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
    return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
  };
  const [from, to] = [rgb(a), rgb(b)];
  if (from.some(Number.isNaN) || to.some(Number.isNaN)) {
    return b;
  }
  return `rgb(${from.map((v, i) => Math.round(v + (to[i] - v) * k)).join(",")})`;
}

const smooth = (k: number) => k * k * (3 - 2 * k);
const clamp = (k: number) => Math.min(1, Math.max(0, k));
const easeOut = (k: number) => 1 - (1 - k) ** 3;
const dirOf = (a: Point, b: Point): Dir => [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])];

/**
 * Sets the agent going. Returns a cleanup.
 *
 * `motion` false is reduced motion: the game is played a stretch in silence
 * and shown as one still position, its thinking and audit filled in; nothing
 * moves after that. `compact` is the phone, where the figure is the ground
 * behind the opener's copy: the field and the audit are left out and only
 * the line is drawn.
 */
export function mountSnake(root: HTMLElement, { motion, compact }: { motion: boolean; compact: boolean }): () => void {
  const canvas = root.querySelector<HTMLCanvasElement>(".agent-snake_canvas");
  const context = canvas?.getContext("2d");
  const stage = canvas?.parentElement;
  if (!canvas || !context || !stage) {
    return () => {};
  }
  const ctx = context;

  // One agent per element, whatever remounted it — see `mountBoard`.
  const host = root as HTMLElement & { disposeSnake?: () => void };
  host.disposeSnake?.();

  const moveRows = [...root.querySelectorAll<HTMLElement>("[data-snake-move]")];
  const values = moveRows.map((row) => row.querySelector<HTMLElement>("[data-snake-value]"));
  const bars = moveRows.map((row) => row.querySelector<HTMLElement>("[data-snake-bar]"));
  const logRows = [...root.querySelectorAll<HTMLElement>("[data-snake-log] > li")];
  const field = (name: string) => root.querySelector<HTMLElement>(`[data-snake-${name}]`);
  const fields = {
    game: field("game"),
    step: field("step"),
    captures: field("captures"),
    avoided: field("avoided"),
    thinking: field("thinking"),
    thought: field("thought"),
    status: field("status"),
  };

  const style = getComputedStyle(root);
  const ink = (name: string) => style.getPropertyValue(`--snake-${name}`).trim();
  const inks: Inks = { body: ink("body"), head: ink("head"), target: ink("target"), grid: ink("grid"), edge: ink("edge") };

  const agent = new SnakeAgent();
  const entries: LogEntry[] = [];

  /* ------------------------------------------------------------ the audit */

  const writeLog = (events: SnakeEvent[]) => {
    if (compact || !events.length) {
      return;
    }
    entries.unshift(...events.map(logEntry).reverse());
    entries.length = Math.min(entries.length, logRows.length);
    logRows.forEach((row, index) => {
      const entry = entries[index];
      row.dataset.kind = entry?.kind ?? "";
      const [step, label, detail] = row.children;
      step.textContent = entry?.step ?? "";
      label.textContent = entry?.label ?? "";
      detail.textContent = entry?.detail ?? "";
    });
    if (motion) {
      logRows[0]?.animate(
        [
          { opacity: 0, transform: "translateY(-4px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 320, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
      );
    }
  };

  const writeAudit = () => {
    if (compact) {
      return;
    }
    const { decision } = agent;
    moveRows.forEach((row, index) => {
      const { veto } = decision.options[index];
      row.toggleAttribute("data-chosen", !agent.over && index === decision.move);
      row.toggleAttribute("data-blocked", veto !== null);
      const value = values[index];
      if (value) {
        value.textContent = veto ? copy.audit.blocked : `${Math.round(decision.probs[index] * 100)}%`;
      }
      bars[index]?.style.setProperty("transform", `scaleX(${decision.probs[index]})`);
    });
    if (fields.game) fields.game.textContent = pad(agent.game, 2);
    if (fields.step) fields.step.textContent = pad(agent.step, 3);
    if (fields.captures) fields.captures.textContent = pad(agent.captures, 2);
    if (fields.avoided) fields.avoided.textContent = pad(agent.avoided, 2);
  };

  /* ---------------------------------------------------------- the thought */

  let stepMs = STEP_MS;
  let thinking: Thinking | null = null;
  /** What happened while it was still thinking about something else. */
  let queued: SnakeEvent[] | null = null;
  /** When the thought on screen may give way to the next. */
  let restUntil = 0;

  /** Starts a thought: "Pensando", then the words. It keeps moving throughout. */
  const ponder = (events: SnakeEvent[], now: number) => {
    const text = think(agent, events);
    const pace = stepMs / STEP_MS;
    thinking = {
      words: text.split(" "),
      shown: 0,
      start: now,
      lead: THOUGHT_LEAD_MS * pace,
      stream: ((text.length / THOUGHT_CPS) * 1000) * pace,
    };
    fields.thinking?.setAttribute("data-live", "");
    if (fields.thought) fields.thought.textContent = "";
    if (fields.status) fields.status.textContent = copy.thinking.live;
  };

  /** How far into its thought it is, 0 to 1; writes the words that are due. */
  const streamed = (now: number): number => {
    if (!thinking) {
      return 1;
    }
    const k = clamp((now - thinking.start - thinking.lead) / thinking.stream);
    const count = Math.ceil(k * thinking.words.length);
    if (count !== thinking.shown && fields.thought) {
      thinking.shown = count;
      fields.thought.textContent = thinking.words.slice(0, count).join(" ");
    }
    return k;
  };

  /** Lays the whole thought down at once, and says what it weighed. */
  const conclude = (text?: string) => {
    if (text !== undefined && fields.thought) fields.thought.textContent = text;
    else if (thinking && fields.thought) fields.thought.textContent = thinking.words.join(" ");
    thinking = null;
    fields.thinking?.removeAttribute("data-live");
    if (fields.status) fields.status.textContent = considered(agent);
  };

  /**
   * Something happened that it has to think about. A new game or the end of
   * one is said at once; anything else waits for the thought on screen to
   * finish and be read, and is then thought about as things stand — so a
   * thought is never cut off, and never about a moment already past.
   */
  const prompt = (events: SnakeEvent[], now: number) => {
    if (compact || !promptsThought(events)) {
      return;
    }
    const urgent = events.some((event) => event.kind === "start" || event.kind === "end");
    if (thinking && !urgent) {
      queued = [...(queued ?? []), ...events];
      return;
    }
    queued = null;
    ponder(events, now);
  };

  /* ------------------------------------------------------------ the field */

  let cell = 24;
  let dpr = 1;

  const measure = () => {
    cell = Math.max(10, Math.floor((stage.clientWidth - 2) / COLS));
    const width = COLS * cell + 2;
    const height = ROWS * cell + 2;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  };

  /** The centre of a cell, in canvas pixels. The 1px inset is the edge line. */
  const at = (c: number) => 1 + c * cell + cell / 2;

  /** The pieces of a line through `cells`, entering the first by `first` and
   *  leaving the last by `last`. */
  const piecesOf = (cells: readonly Point[], first: Dir, last: Dir): Piece[] => {
    const h = cell / 2;
    return cells.map((c, i) => {
      const din = i ? dirOf(cells[i - 1], c) : first;
      const dout = i < cells.length - 1 ? dirOf(c, cells[i + 1]) : last;
      const x = at(c[0]);
      const y = at(c[1]);
      const straight = din[0] === dout[0] && din[1] === dout[1];
      // Round the corner the entry and exit edges share: entering along
      // `din` and leaving along `dout`, that corner is `-din + dout` half a
      // cell from the centre.
      const ox = x + (dout[0] - din[0]) * h;
      const oy = y + (dout[1] - din[1]) * h;
      const a0 = Math.atan2(-dout[1], -dout[0]);
      let sweep = Math.atan2(din[1], din[0]) - a0;
      sweep = Math.atan2(Math.sin(sweep), Math.cos(sweep));
      return { x, y, straight, din, ox, oy, a0, sweep };
    });
  };

  const pointOn = (p: Piece, f: number): [number, number] => {
    const h = cell / 2;
    if (p.straight) {
      return [p.x + p.din[0] * h * (2 * f - 1), p.y + p.din[1] * h * (2 * f - 1)];
    }
    const a = p.a0 + p.sweep * f;
    return [p.ox + Math.cos(a) * h, p.oy + Math.sin(a) * h];
  };

  /** Continues the current path along a piece, from `f0` to `f1` of it. */
  const along = (p: Piece, f0: number, f1: number) => {
    if (p.straight) {
      const [x, y] = pointOn(p, f1);
      ctx.lineTo(x, y);
    } else {
      ctx.arc(p.ox, p.oy, cell / 2, p.a0 + p.sweep * f0, p.a0 + p.sweep * f1, p.sweep < 0);
    }
  };

  /** A line through pieces, from `start` of the first to `end` of the last,
   *  drawn as far as `k` of its length. */
  const stroke = (pieces: readonly Piece[], start: number, end: number, k = 1) => {
    const spans = pieces.map((_, i) => [i ? 0 : start, i === pieces.length - 1 ? end : 1]);
    let budget = k * spans.reduce((sum, [f0, f1]) => sum + Math.max(0, f1 - f0), 0);
    ctx.beginPath();
    const [sx, sy] = pointOn(pieces[0], start);
    ctx.moveTo(sx, sy);
    for (let i = 0; i < pieces.length && budget > 0; i++) {
      const [f0, f1] = spans[i];
      const f = Math.min(f1, f0 + budget);
      if (f > f0) {
        along(pieces[i], f0, f);
      }
      budget -= f1 - f0;
    }
    ctx.stroke();
  };

  /** The last target, while the head closes on it, and when it was taken. */
  let caught: { x: number; y: number; at: number } | null = null;
  let placed = -Infinity;

  const segmentInk = (ate: number | null, t: number) =>
    ate === null ? inks.body : mix(inks.target, inks.body, smooth(Math.min(1, (agent.step - ate + t) / DIGESTION)));

  /** The field: a point at every corner of the grid, brighter round the head. */
  const paintField = (hx: number, hy: number) => {
    const reach = REACH * cell;
    ctx.fillStyle = inks.grid;
    for (let j = 0; j <= ROWS; j++) {
      for (let i = 0; i <= COLS; i++) {
        const x = 1 + i * cell;
        const y = 1 + j * cell;
        const near = Math.max(0, 1 - Math.hypot(x - hx, y - hy) / reach);
        ctx.globalAlpha = Math.min(1, 0.3 + 0.9 * near * near);
        ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
      }
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = inks.edge;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(0.5, 0.5, COLS * cell + 1, ROWS * cell + 1, Math.min(10, cell * 0.4));
    ctx.stroke();
  };

  /** The target, as the customer map marks a place: a point, a ring round
   *  it, and a slower ring spreading out of it. */
  const paintTarget = (x: number, y: number, scale: number, now: number) => {
    if (scale <= 0) {
      return;
    }
    const beat = ((now / 1800) % 1 + 1) % 1;
    ctx.strokeStyle = inks.target;
    ctx.fillStyle = inks.target;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.55 * (1 - beat) * scale;
    ctx.beginPath();
    ctx.arc(x, y, cell * (0.22 + 0.55 * beat), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.6 * scale;
    ctx.beginPath();
    ctx.arc(x, y, cell * 0.3 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = scale;
    ctx.beginPath();
    ctx.arc(x, y, cell * 0.12 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  /** `t` is how far through its step the snake is; `reveal`, how much of its
   *  plan it has thought out — the route draws itself as the words arrive. */
  const paint = (t: number, now: number, reveal: number) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const cells: Point[] = agent.body.map(({ x, y }) => [x, y]);
    const n = cells.length - 1;
    const move = MOVES[agent.decision.move];
    const headIn = n ? dirOf(cells[n - 1], cells[n]) : ([move.dx, move.dy] as Dir);
    const body = piecesOf(cells, n ? dirOf(cells[0], cells[1]) : headIn, [move.dx, move.dy]);
    const [gx, gy] = agent.next;
    const growing = gx === agent.target[0] && gy === agent.target[1];
    const tailF = growing ? 0 : t;
    const [hx, hy] = pointOn(body[n], t);

    if (!compact) {
      paintField(hx, hy);

      const { path, rejected } = agent.decision;
      const head = cells[n];
      /** A route from the head's cell, on the same curve the body keeps. */
      const plan = (route: readonly Point[], from: number, k: number) => {
        if (!route.length || k <= 0) {
          return;
        }
        const all = [head, ...route];
        stroke(piecesOf(all, headIn, dirOf(all[all.length - 2], all[all.length - 1])), from, 0.5, k);
      };
      // The route it found and turned down, because eating there would have
      // boxed it in: faint and still, so it reads as considered, not taken.
      // It is thought of first, so it draws in the first half of the thought.
      if (rejected) {
        ctx.setLineDash([1, 5]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = inks.target;
        ctx.globalAlpha = 0.3;
        plan(rejected, 0.5, clamp(reveal * 2));
      }
      // The route it means to take — to the target, or round to its own
      // tail — leaving from the head and running the way it will.
      ctx.setLineDash([1, 7]);
      ctx.lineDashOffset = -now / 30;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = inks.body;
      ctx.globalAlpha = 0.6;
      plan(path, t, rejected ? clamp(reveal * 2 - 1) : reveal);
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    // The target: the one just taken shrinking into the head as it arrives,
    // the new one settling in once it has.
    const handover = stepMs * 0.5;
    if (caught && now - caught.at < handover) {
      paintTarget(caught.x, caught.y, 1 - easeOut((now - caught.at) / handover), now);
    } else {
      paintTarget(at(agent.target[0]), at(agent.target[1]), easeOut(clamp((now - placed) / APPEAR_MS)), now);
    }
    if (caught && now - caught.at >= handover) {
      const k = (now - caught.at - handover) / RIPPLE_MS;
      if (k < 1) {
        ctx.strokeStyle = inks.body;
        ctx.lineWidth = 1.25;
        ctx.globalAlpha = 0.8 * (1 - k);
        ctx.beginPath();
        ctx.arc(caught.x, caught.y, cell * (0.25 + 0.75 * easeOut(k)), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        caught = null;
      }
    }

    // The light round the body: one stroke of the whole of it, faint. Given
    // to each piece it doubled up wherever two met and left bright knots.
    ctx.lineWidth = cell * HALO;
    ctx.strokeStyle = inks.body;
    ctx.globalAlpha = 0.08;
    stroke(body, tailF, t);

    // The line itself, a piece at a time so each can carry its own ink and
    // fade back towards the tail. Butt caps: the pieces meet end to end on
    // one tangent, so they join without a seam and without overlapping.
    ctx.lineCap = "butt";
    ctx.lineWidth = Math.max(2, cell * LINE);
    const length = n + t - tailF;
    for (let i = 0; i <= n; i++) {
      const f0 = i ? 0 : tailF;
      const f1 = i === n ? t : 1;
      if (f1 <= f0) {
        continue;
      }
      const k = clamp((i + (f0 + f1) / 2 - tailF) / Math.max(length, 1));
      ctx.globalAlpha = 0.22 + 0.78 * k ** 1.3;
      ctx.strokeStyle = segmentInk(agent.body[i].ate, t);
      ctx.beginPath();
      const [x, y] = pointOn(body[i], f0);
      ctx.moveTo(x, y);
      along(body[i], f0, f1);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.lineCap = "round";

    // The head, drawn as the board's travelling request is: white, a celeste
    // edge.
    ctx.fillStyle = inks.head;
    ctx.strokeStyle = inks.body;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(hx, hy, Math.max(3, cell * 0.17), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };

  /* ------------------------------------------------------------ the speed */

  const setSpeed = (factor: number) => {
    stepMs = STEP_MS / (factor > 0 ? factor : 1);
    root.style.setProperty("--snake-step", `${stepMs}ms`);
  };
  const speed = root.querySelector<HTMLInputElement>("[data-snake-speed] input:checked");
  setSpeed(Number(speed?.value ?? 1));
  const onSpeed = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.checked && input.closest("[data-snake-speed]")) {
      setSpeed(Number(input.value));
    }
  };
  root.addEventListener("change", onSpeed);

  /* ------------------------------------------------------------- the loop */

  let frame = 0;
  let running = false;
  let visible = true;
  let revealed = false;
  let last = 0;
  let fading: { start: number; swapped: boolean } | null = null;
  /** What the opening position prompts, held until the loop first runs. */
  let pending: SnakeEvent[] | null = null;

  /** One step's worth of consequences: logged, audited, and thought about. */
  const took = (events: SnakeEvent[], now: number) => {
    writeLog(events);
    writeAudit();
    prompt(events, now);
  };

  const advance = (now: number) => {
    const [x, y] = agent.target;
    const events = agent.advance();
    if (events.some((event) => event.kind === "capture")) {
      caught = { x: at(x), y: at(y), at: now };
      placed = now + stepMs * 0.5;
    }
    took(events, now);
  };

  const tick = (now: number) => {
    frame = 0;
    last ||= now;
    if (pending) {
      prompt(pending, now);
      pending = null;
    }
    let opacity = 1;

    if (fading) {
      const k = (now - fading.start) / FADE_MS;
      if (k >= 1) {
        fading = null;
        last = now;
      } else {
        opacity = Math.abs(k - 0.5) * 2;
        if (k >= 0.5 && !fading.swapped) {
          fading.swapped = true;
          placed = now;
          caught = null;
          took(agent.reset(), now);
        }
      }
    } else if (agent.over) {
      if (now - last >= END_HOLD_MS) {
        fading = { start: now, swapped: false };
      }
    } else {
      // As many steps as are due — none on most frames, and never more than
      // two after a hidden tab left a gap — keeping each frame's overshoot, so
      // the pace is the step's and not the step's rounded up to a frame.
      if (now - last > stepMs * 2) {
        last = now - stepMs;
      }
      while (!agent.over && now - last >= stepMs) {
        advance(now);
        last += stepMs;
      }
    }

    // Thinking runs beside the game, never in its way.
    let reveal = 1;
    if (thinking) {
      reveal = streamed(now);
      if (now - thinking.start >= thinking.lead + thinking.stream) {
        conclude();
        restUntil = now + THOUGHT_REST_MS * (stepMs / STEP_MS);
      }
    } else if (queued && now >= restUntil) {
      const events = queued;
      queued = null;
      ponder(events, now);
      reveal = 0;
    }

    const t = fading || agent.over ? 0 : clamp((now - last) / stepMs);
    canvas.style.opacity = String(opacity);
    paint(t, now, reveal);
    if (running) {
      frame = requestAnimationFrame(tick);
    }
  };

  const start = () => {
    if (running || !revealed || !visible) {
      return;
    }
    running = true;
    last = 0;
    if (thinking) {
      // Coming back into view mid-thought picks it up where it was.
      thinking.start = performance.now() - (thinking.lead + (thinking.shown / thinking.words.length) * thinking.stream);
    }
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  measure();
  const opening = agent.reset();
  writeLog(opening);
  if (motion) {
    pending = opening;
  } else {
    for (let i = 0; i < 90 && !agent.over; i++) {
      writeLog(agent.advance());
    }
    // Mid-route, so the thought is about the plan, not about what just happened.
    if (!compact) {
      conclude(think(agent, []));
    }
  }
  writeAudit();
  paint(0, 0, motion ? 0 : 1);

  const resize = new ResizeObserver(() => {
    measure();
    if (!running) {
      const now = performance.now();
      paint(0, now, thinking ? streamed(now) : pending ? 0 : 1);
    }
  });
  resize.observe(stage);

  // It only plays where it can be seen, and only once the page is open.
  let seen: IntersectionObserver | null = null;
  let release = () => {};
  if (motion) {
    seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        start();
      } else {
        stop();
      }
    });
    seen.observe(root);
    release = onPageReveal(() => {
      revealed = true;
      start();
    });
  }

  const dispose = () => {
    stop();
    release();
    resize.disconnect();
    seen?.disconnect();
    root.removeEventListener("change", onSpeed);
    root.style.removeProperty("--snake-step");
    canvas.style.opacity = "";
    if (host.disposeSnake === dispose) {
      delete host.disposeSnake;
    }
  };
  host.disposeSnake = dispose;
  return dispose;
}
