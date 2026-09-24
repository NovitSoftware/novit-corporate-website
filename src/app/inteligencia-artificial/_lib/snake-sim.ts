/*
 * The agent: a snake that plays itself, and the reasoning behind every move.
 * State only — no DOM, no clock — so the board, the audit and the log all read
 * the same decision and cannot disagree about it.
 *
 * It plans rather than lunges. For each move it could make it asks three
 * things, in order, and its thinking in the audit is written from the
 * answers:
 *
 *   1. Is there a route to the target? The shortest one round its own body,
 *      counting the cells its tail will have left by the time it gets there.
 *   2. Having eaten at the end of it, could it still reach its tail? If it
 *      can, it can never be boxed in — it can always follow itself out.
 *   3. So: take the route; or, if eating there would trap it, follow its own
 *      tail until a safe route opens; or, with neither, head for the most
 *      room.
 *
 * A move into a wall or the body is vetoed before any of that: the guardrail.
 * The answers become a score per move, and a softmax over the scores is the
 * confidence the audit shows.
 */

/* Square, so the board stands as tall as the audit beside it at `xl`. */
export const COLS = 14;
export const ROWS = 14;
const CELLS = COLS * ROWS;

const START_LENGTH = 5;
/** Softmax temperature over the scores below: the chosen move leads clearly,
 *  and a close second still shows as one. */
const TEMPERATURE = 2.5;
/** New targets land within this many cells of the head, so it captures often. */
const NEAR = 9;
/** A game ends here, or after this long without a capture, so the loop turns over. */
const MAX_STEPS = 900;
const STALL = 220;

/* What a move is worth, by what the agent found. A safe route always beats
   following the tail, which always beats heading for room. */
const SAFE_ROUTE = 200;
const TAIL = 50;
const ROOM = 40;
/** A nudge to keep going straight when two moves are otherwise equal. */
const STRAIGHT = 0.25;

/** Left, right, up, down — the order the audit lists them in. */
export const MOVES = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
] as const;

export type Point = readonly [x: number, y: number];

/** A body cell, and the step it swallowed a target at, while that is still
 *  digesting. */
export type Segment = { x: number; y: number; ate: number | null };

export type Veto = "wall" | "body";

export type Plan = "target" | "tail" | "space" | "trapped";

/** What it found down one move: what its thinking is written from. */
export type Choice = {
  veto: Veto | null;
  /** Moves to the target going this way, this one included; null if none. */
  route: number | null;
  /** Whether, having eaten at the end of that route, it could still reach its tail. */
  exit: boolean;
};

export type Decision = {
  probs: readonly number[];
  /** Left, right, up, down, as it weighed them. */
  options: readonly Choice[];
  move: number;
  plan: Plan;
  /** Moves to the target by the route it takes — or, off one, by the
   *  shortest it turned down; null if the body closes every route. */
  route: number | null;
  /** The cells it means to cross, next one first: to the target, or to its tail. */
  path: readonly Point[];
  /** The route to the target it found and turned down, when it did. */
  rejected: readonly Point[] | null;
};

export type SnakeEvent =
  | { kind: "start"; step: number; game: number }
  | { kind: "capture"; step: number; took: number }
  | { kind: "avoid"; step: number }
  | { kind: "noroute"; step: number }
  | { kind: "resume"; step: number; route: number }
  | { kind: "end"; step: number; captures: number };

type Option = {
  move: number;
  cell: Point;
  veto: Veto | null;
  route: Point[] | null;
  exit: boolean;
  tail: Point[] | null;
  score: number;
};

const key = (x: number, y: number) => y * COLS + x;
const pointOf = (k: number): Point => [k % COLS, Math.floor(k / COLS)];
const inside = (x: number, y: number) => x >= 0 && x < COLS && y >= 0 && y < ROWS;
const same = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1];

/** A cell reached by a route: the way it came in, the turns taken, and how. */
type Reach = { k: number; dir: number; turns: number; from: Reach | null };

/**
 * The shortest way from the head (the body's last cell) to `goal`, as the
 * cells to cross, goal last — and of the shortest, the one with the fewest
 * turns, so it goes in straight legs rather than a staircase. With `timed` a
 * body cell opens once the tail has had time to leave it — the segment `i`
 * from the tail is gone after `i + 1` moves — so a route can run where the
 * body is now and will not be then. Without it the body is a wall, bar the
 * goal itself.
 */
function pathTo(body: readonly Point[], goal: Point, timed: boolean): Point[] | null {
  const opens = new Map<number, number>();
  body.forEach(([x, y], index) => opens.set(key(x, y), timed ? index + 1 : Infinity));
  const target = key(goal[0], goal[1]);
  opens.delete(target);

  const [hx, hy] = body[body.length - 1];
  const [px, py] = body[body.length - 2] ?? [hx, hy];
  const heading = MOVES.findIndex(({ dx, dy }) => hx - px === dx && hy - py === dy);
  // The move a cell was first reached on. A route may reach it several ways
  // on that move — that is where the fewest turns win — and never later, so
  // no route crosses its own track.
  const reachedOn = new Map<number, number>([[key(hx, hy), 0]]);
  let frontier: Reach[] = [{ k: key(hx, hy), dir: heading, turns: 0, from: null }];

  for (let moves = 1; frontier.length; moves++) {
    const next = new Map<number, Reach>();
    for (const reach of frontier) {
      const [x, y] = pointOf(reach.k);
      MOVES.forEach(({ dx, dy }, dir) => {
        const nx = x + dx;
        const ny = y + dy;
        const nk = key(nx, ny);
        // A cell that is still body is left unreached, so a later arrival
        // can still use it once it has opened.
        if (!inside(nx, ny) || (opens.get(nk) ?? 0) > moves || (reachedOn.get(nk) ?? moves) !== moves) {
          return;
        }
        const turns = reach.turns + (dir === reach.dir || reach.dir < 0 ? 0 : 1);
        const state = nk * 4 + dir;
        const known = next.get(state);
        if (!known || turns < known.turns) {
          next.set(state, { k: nk, dir, turns, from: reach });
        }
      });
    }
    for (const reach of next.values()) {
      reachedOn.set(reach.k, moves);
    }
    const arrivals = [...next.values()].filter((reach) => reach.k === target);
    if (arrivals.length) {
      const path: Point[] = [];
      let at: Reach | null = arrivals.reduce((a, b) => (b.turns < a.turns ? b : a));
      for (; at?.from; at = at.from) {
        path.unshift(pointOf(at.k));
      }
      return path;
    }
    frontier = [...next.values()];
  }
  return null;
}

/** The body after following `route`, eating at its end. */
function follow(body: readonly Point[], route: readonly Point[]): Point[] {
  const snake = body.slice();
  route.forEach((cell, index) => {
    snake.push(cell);
    if (index < route.length - 1) {
      snake.shift();
    }
  });
  return snake;
}

/** How many cells the head can still reach. */
function room(body: readonly Point[]): number {
  const walls = new Set(body.slice(1).map(([x, y]) => key(x, y)));
  const [hx, hy] = body[body.length - 1];
  const seen = new Set([key(hx, hy)]);
  const stack: Point[] = [[hx, hy]];
  while (stack.length) {
    const [x, y] = stack.pop()!;
    for (const { dx, dy } of MOVES) {
      const nk = key(x + dx, y + dy);
      if (inside(x + dx, y + dy) && !walls.has(nk) && !seen.has(nk)) {
        seen.add(nk);
        stack.push([x + dx, y + dy]);
      }
    }
  }
  return seen.size;
}

export class SnakeAgent {
  body: Segment[] = [];
  target: Point = [0, 0];
  decision: Decision = {
    probs: [0, 0, 0, 0],
    options: MOVES.map(() => ({ veto: null, route: null, exit: false })),
    move: 1,
    plan: "trapped",
    route: null,
    path: [],
    rejected: null,
  };
  step = 0;
  game = 0;
  captures = 0;
  /** Routes it found and turned down because eating there would have trapped it. */
  avoided = 0;
  over = false;

  private dir = 1;
  private lastCapture = 0;
  /* Turning a trap down, finding every route closed, and being off the
     target's route: each is logged when it starts, not on every step it
     lasts — following the tail round the board is one decision. */
  private avoiding = false;
  private closed = false;
  private off = false;

  constructor(private readonly random: () => number = Math.random) {}

  get head(): Segment {
    return this.body[this.body.length - 1];
  }

  /** Where the head is going next: the move already decided. */
  get next(): Point {
    const { dx, dy } = MOVES[this.decision.move];
    return [this.head.x + dx, this.head.y + dy];
  }

  reset(): SnakeEvent[] {
    const row = Math.floor(ROWS / 2);
    this.body = Array.from({ length: START_LENGTH }, (_, index) => ({ x: 2 + index, y: row, ate: null }));
    this.dir = 1;
    this.step = 0;
    this.captures = 0;
    this.avoided = 0;
    this.lastCapture = 0;
    this.avoiding = false;
    this.closed = false;
    this.off = false;
    this.over = false;
    this.game += 1;
    this.target = this.place() ?? [COLS - 2, row];
    return [{ kind: "start", step: 0, game: this.game }, ...this.decide()];
  }

  advance(): SnakeEvent[] {
    if (this.over) {
      return [];
    }

    this.dir = this.decision.move;
    const [x, y] = this.next;
    const ate = same([x, y], this.target);
    this.step += 1;
    this.body.push({ x, y, ate: ate ? this.step : null });

    const events: SnakeEvent[] = [];
    if (ate) {
      this.captures += 1;
      events.push({ kind: "capture", step: this.step, took: this.step - this.lastCapture });
      this.lastCapture = this.step;
      const target = this.place();
      if (!target) {
        return this.finish(events);
      }
      this.target = target;
    } else {
      this.body.shift();
    }

    events.push(...this.decide());

    const stalled = this.step - this.lastCapture >= STALL;
    if (this.decision.plan === "trapped" || this.step >= MAX_STEPS || stalled) {
      return this.finish(events);
    }
    return events;
  }

  private finish(events: SnakeEvent[]): SnakeEvent[] {
    this.over = true;
    events.push({ kind: "end", step: this.step, captures: this.captures });
    return events;
  }

  /** Weighs every move, picks one, and writes down why. */
  private decide(): SnakeEvent[] {
    const body: Point[] = this.body.map(({ x, y }) => [x, y]);
    // The tail is not in the way: it moves off as the head moves on.
    const occupied = new Set(body.slice(1).map(([x, y]) => key(x, y)));
    const { x: hx, y: hy } = this.head;

    const options = MOVES.map(({ dx, dy }, move): Option => {
      const cell: Point = [hx + dx, hy + dy];
      const veto: Veto | null = !inside(...cell) ? "wall" : occupied.has(key(...cell)) ? "body" : null;
      if (veto) {
        return { move, cell, veto, route: null, exit: false, tail: null, score: -Infinity };
      }
      const eats = same(cell, this.target);
      const after = eats ? [...body, cell] : [...body.slice(1), cell];
      const route = eats ? [] : pathTo(after, this.target, true);
      const fed = route ? follow(after, route) : null;
      const exit = fed !== null && pathTo(fed, fed[0], false) !== null;
      const tail = pathTo(after, after[0], false);
      const score =
        (route && exit
          ? SAFE_ROUTE - route.length
          : tail
            ? TAIL + Math.min(tail.length, 40) * 0.5
            : ROOM * (room(after) / CELLS)) + (move === this.dir ? STRAIGHT : 0);
      return { move, cell, veto: null, route, exit, tail, score };
    });

    const choices: Choice[] = options.map(({ veto, route, exit }) => ({
      veto,
      route: route ? route.length + 1 : null,
      exit,
    }));
    const best = Math.max(...options.map((option) => option.score));
    if (best === -Infinity) {
      this.decision = {
        probs: [0, 0, 0, 0],
        options: choices,
        move: this.dir,
        plan: "trapped",
        route: null,
        path: [],
        rejected: null,
      };
      return [];
    }

    const weights = options.map((option) =>
      option.score === -Infinity ? 0 : Math.exp((option.score - best) / TEMPERATURE),
    );
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    const chosen = options.find((option) => option.score === best)!;
    const plan: Plan = chosen.route && chosen.exit ? "target" : chosen.tail ? "tail" : "space";

    // The shortest route it found at all, safe or not: when it is not taking
    // one, this is the one it turned down.
    const shortest = options
      .filter((option) => option.route)
      .reduce<Option | null>((a, b) => (!a || b.route!.length < a.route!.length ? b : a), null);

    const route = plan === "target" ? chosen.route!.length + 1 : shortest ? shortest.route!.length + 1 : null;
    // The shortest way would box it in, so it is not taking it — by a longer
    // route or by following its tail. It is never taken: a route it takes is
    // one it can get out of.
    const avoiding = shortest !== null && !shortest.exit;

    this.decision = {
      probs: weights.map((weight) => weight / total),
      options: choices,
      move: chosen.move,
      plan,
      route,
      path:
        plan === "target"
          ? [chosen.cell, ...chosen.route!]
          : plan === "tail"
            ? [chosen.cell, ...chosen.tail!]
            : [chosen.cell],
      rejected: avoiding ? [shortest.cell, ...shortest.route!] : null,
    };

    // Each is logged as it starts, not on every step it lasts.
    const events: SnakeEvent[] = [];
    if (avoiding && !this.avoiding) {
      this.avoided += 1;
      events.push({ kind: "avoid", step: this.step });
    }
    const closed = plan !== "target" && shortest === null;
    if (closed && !this.closed) {
      events.push({ kind: "noroute", step: this.step });
    }
    const off = plan !== "target";
    if (!off && this.off) {
      events.push({ kind: "resume", step: this.step, route: route! });
    }
    this.avoiding = avoiding;
    this.closed = closed;
    this.off = off;

    return events;
  }

  /** A free cell for the next target, near the head when there is room. */
  private place(): Point | null {
    const occupied = new Set(this.body.map(({ x, y }) => key(x, y)));
    const { x: hx, y: hy } = this.head;
    const all: Point[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!occupied.has(key(x, y))) {
          all.push([x, y]);
        }
      }
    }
    if (!all.length) {
      return null;
    }
    const near = all.filter(([x, y]) => Math.abs(x - hx) + Math.abs(y - hy) <= NEAR);
    const pool = near.length >= 6 ? near : all;
    return pool[Math.floor(this.random() * pool.length)];
  }
}
