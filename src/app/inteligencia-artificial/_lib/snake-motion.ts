import { agentSnake } from "@/content/inteligencia-artificial";
import { onPageReveal } from "@/lib/page-reveal";
import { considered, logEntry, pad, promptsThought, think, type LogEntry } from "./snake-copy";
import { COLS, MOVES, ROWS, SnakeAgent, type Point, type SnakeEvent } from "./snake-sim";

/*
 * The agent's motion: the board drawn on a canvas, the game advanced a step
 * at a time, and the audit beside it written from the same decision.
 *
 * It thinks before it acts. At a new game, a new target or a change of plan
 * it stops, its thinking streams into the audit word by word — the route it
 * is weighing drawing itself out on the board as it goes — and only then does
 * it move. The rest of the time it moves on the plan it has.
 *
 * The canvas never paints a ground — the slate behind it is the ground — and
 * its inks come from the `--snake-*` properties in agent-snake.css, so the
 * colours are changed there and nowhere here.
 */

/** Milliseconds per move at 1×; the speed control divides it. */
const STEP_MS = 160;
/** How fast a thought streams at 1×, in characters a second: a model's pace,
 *  and still one a reader can follow. */
const THOUGHT_CPS = 90;
/** "Pensando" alone, before the first word; and a beat after the last one
 *  before it moves. Both at 1×. */
const THOUGHT_LEAD_MS = 420;
const THOUGHT_SETTLE_MS = 260;
/** Steps a swallowed target takes to go from white back to the body's celeste. */
const DIGESTION = 9;
/** How long the last position holds before the next game fades in, and the fade. */
const END_HOLD_MS = 900;
const FADE_MS = 520;
/** The body's width, in cells. */
const THICKNESS = 0.56;

const copy = agentSnake;

type Inks = { body: string; head: string; target: string; grid: string; edge: string };
type Thinking = { words: string[]; shown: number; start: number; lead: number; stream: number; settle: number };

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

/**
 * Sets the agent going. Returns a cleanup.
 *
 * `motion` false is reduced motion: the game is played a stretch in silence
 * and shown as one still position, its thinking and audit filled in; nothing
 * moves after that.
 */
export function mountSnake(root: HTMLElement, motion: boolean): () => void {
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
    if (!events.length) {
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

  /** Starts a thought: "Pensando", then the words, then the move. */
  const ponder = (events: SnakeEvent[], now: number) => {
    const text = think(agent, events);
    const pace = stepMs / STEP_MS;
    thinking = {
      words: text.split(" "),
      shown: 0,
      start: now,
      lead: THOUGHT_LEAD_MS * pace,
      stream: ((text.length / THOUGHT_CPS) * 1000) * pace,
      settle: THOUGHT_SETTLE_MS * pace,
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

  /* ------------------------------------------------------------ the board */

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

  const segmentInk = (ate: number | null, t: number) =>
    ate === null ? inks.body : mix(inks.target, inks.body, smooth(Math.min(1, (agent.step - ate + t) / DIGESTION)));

  /** `t` is how far through its step the snake is; `reveal`, how much of its
   *  plan it has thought out — the route draws itself as the words arrive. */
  const paint = (t: number, now: number, reveal: number) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // The grid, and its edge.
    ctx.lineWidth = 1;
    ctx.strokeStyle = inks.grid;
    ctx.beginPath();
    for (let i = 1; i < COLS; i++) {
      ctx.moveTo(1 + i * cell + 0.5, 1);
      ctx.lineTo(1 + i * cell + 0.5, 1 + ROWS * cell);
    }
    for (let j = 1; j < ROWS; j++) {
      ctx.moveTo(1, 1 + j * cell + 0.5);
      ctx.lineTo(1 + COLS * cell, 1 + j * cell + 0.5);
    }
    ctx.stroke();
    ctx.strokeStyle = inks.edge;
    ctx.strokeRect(0.5, 0.5, COLS * cell + 1, ROWS * cell + 1);

    const head = agent.head;
    const hx = at(head.x);
    const hy = at(head.y);
    const tx = at(agent.target[0]);
    const ty = at(agent.target[1]);
    const { path, rejected } = agent.decision;

    /** A route from the head, drawn as far as `k` of its length. */
    const trace = (cells: readonly Point[], k: number) => {
      const points = [[hx, hy], ...cells.map(([x, y]) => [at(x), at(y)])];
      const reach = k * (points.length - 1);
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      for (let i = 1; i < points.length && i - 1 < reach; i++) {
        const f = Math.min(1, reach - (i - 1));
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
      }
      ctx.stroke();
    };

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // The route it found and turned down, because eating there would have
    // boxed it in: faint and still, so it reads as considered, not taken. It
    // is thought of first, so it draws in the first half of the thought.
    if (rejected) {
      ctx.setLineDash([1.5, 6]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = inks.target;
      ctx.globalAlpha = 0.28;
      trace(rejected, clamp(reveal * 2));
    }
    // The route it means to take — to the target, or round to its own tail —
    // cell by cell, moving the way it will.
    ctx.setLineDash([2, 8]);
    ctx.lineDashOffset = -now / 26;
    ctx.lineWidth = 2;
    ctx.strokeStyle = inks.body;
    ctx.globalAlpha = 0.55;
    trace(path, rejected ? clamp(reveal * 2 - 1) : reveal);
    ctx.restore();

    // The target: the icon set's `target`, with the customer map's pulse.
    const scale = (cell * 0.78) / 24;
    ctx.save();
    const beat = ((now / 1800) % 1 + 1) % 1;
    ctx.globalAlpha = 0.7 * (1 - beat);
    ctx.strokeStyle = inks.body;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(tx, ty, 9 * scale + beat * cell * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = inks.target;
    ctx.fillStyle = inks.target;
    ctx.lineWidth = Math.max(1.25, 1.5 * scale);
    for (const radius of [9, 4.6]) {
      ctx.beginPath();
      ctx.arc(tx, ty, radius * scale, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(tx, ty, 1.6 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // The body: one stroke per stretch, each in its own ink, round-capped so
    // the joins do not show. The head adds a point towards the next cell
    // rather than moving its own, so every turn stays a right angle.
    const points = agent.body.map((segment) => [at(segment.x), at(segment.y)]);
    const { dx, dy } = MOVES[agent.decision.move];
    const nx = hx + dx * cell * t;
    const ny = hy + dy * cell * t;
    points.push([nx, ny]);
    const [gx, gy] = agent.next;
    const growing = gx === agent.target[0] && gy === agent.target[1];
    if (!growing && points.length > 2) {
      points[0] = [points[0][0] + (points[1][0] - points[0][0]) * t, points[0][1] + (points[1][1] - points[0][1]) * t];
    }

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = cell * THICKNESS;
    // The light round the body is one stroke of the whole of it. Given to
    // each stretch it doubled up wherever two met and left bright knots.
    ctx.shadowBlur = 10;
    ctx.shadowColor = inks.body;
    ctx.strokeStyle = inks.body;
    ctx.beginPath();
    points.forEach(([x, y], index) => (index ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    ctx.shadowBlur = 0;
    for (let i = 0; i < points.length - 1; i++) {
      ctx.strokeStyle = segmentInk(agent.body[Math.min(i + 1, agent.body.length - 1)].ate, t);
      ctx.beginPath();
      ctx.moveTo(points[i][0], points[i][1]);
      ctx.lineTo(points[i + 1][0], points[i + 1][1]);
      ctx.stroke();
    }
    // The head is drawn as the board's travelling request is: white, a
    // celeste edge, a little light round it.
    ctx.shadowBlur = 8;
    ctx.fillStyle = inks.head;
    ctx.strokeStyle = inks.body;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(nx, ny, cell * THICKNESS * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
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
    if (promptsThought(events)) {
      ponder(events, now);
    }
  };

  const tick = (now: number) => {
    frame = 0;
    last ||= now;
    if (pending) {
      ponder(pending, now);
      pending = null;
    }
    let opacity = 1;
    let reveal = 1;

    if (fading) {
      const k = (now - fading.start) / FADE_MS;
      if (k >= 1) {
        fading = null;
        last = now;
      } else {
        opacity = Math.abs(k - 0.5) * 2;
        if (k >= 0.5 && !fading.swapped) {
          fading.swapped = true;
          took(agent.reset(), now);
        }
      }
      reveal = streamed(now);
    } else if (thinking) {
      // Thinking: it holds still until the thought is out, and a beat after.
      reveal = streamed(now);
      if (now - thinking.start >= thinking.lead + thinking.stream + thinking.settle) {
        conclude();
        last = now;
      }
    } else if (agent.over) {
      if (now - last >= END_HOLD_MS) {
        fading = { start: now, swapped: false };
      }
    } else if (now - last >= stepMs) {
      took(agent.advance(), now);
      // Keep the frame's overshoot, so the pace is the step's and not the
      // step's rounded up to the next frame — unless a hidden tab left a gap.
      last = now - last > stepMs * 2 ? now : last + stepMs;
      if (thinking) {
        reveal = 0;
      }
    }

    const t = fading || thinking || agent.over ? 0 : Math.min(1, (now - last) / stepMs);
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
    conclude(think(agent, []));
  }
  writeAudit();
  paint(0, 0, motion ? 0 : 1);

  const resize = new ResizeObserver(() => {
    measure();
    if (!running) {
      paint(0, performance.now(), thinking ? streamed(performance.now()) : pending ? 0 : 1);
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
