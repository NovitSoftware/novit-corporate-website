import { agentSnake } from "@/content/inteligencia-artificial";
import { MOVES, type SnakeAgent, type SnakeEvent } from "./snake-sim";

/*
 * The agent's words: its log, and its thinking. Both are written from what
 * the simulation found and nothing else, so the audit can only say what the
 * agent actually worked out.
 */

const copy = agentSnake;
const said = copy.thinking;

export type LogEntry = { kind: SnakeEvent["kind"]; step: string; label: string; detail: string };

export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, name: string) => String(values[name]));
export const plural = (n: number, forms: { one: string; other: string }) =>
  fill(n === 1 ? forms.one : forms.other, { n });
export const pad = (n: number, width: number) => String(n).padStart(width, "0");

export function logEntry(event: SnakeEvent): LogEntry {
  const step = `#${pad(event.step, 3)}`;
  const { events } = copy;
  switch (event.kind) {
    case "start":
      return { kind: event.kind, step, label: fill(events.start.label, { n: pad(event.game, 2) }), detail: events.start.detail };
    case "capture":
      return { kind: event.kind, step, label: events.capture.label, detail: plural(event.took, events.capture) };
    case "avoid":
    case "noroute":
      return { kind: event.kind, step, label: events[event.kind].label, detail: events[event.kind].detail };
    case "resume":
      return { kind: event.kind, step, label: events.resume.label, detail: plural(event.route, events.resume) };
    case "end":
      return { kind: event.kind, step, label: events.end.label, detail: plural(event.captures, events.end) };
  }
}

/** The events that make it stop and think: a new game, a new target, a change of plan. */
const PROMPTS = new Set<SnakeEvent["kind"]>(["start", "capture", "avoid", "noroute", "resume", "end"]);

export const promptsThought = (events: readonly SnakeEvent[]) => events.some((event) => PROMPTS.has(event.kind));

/**
 * What it thinks at this point, in its own words: what just happened, the
 * routes it found and how they compare, whether eating at the end of one
 * would box it in, and what it will do.
 */
export function think(agent: SnakeAgent, events: readonly SnakeEvent[]): string {
  const { decision } = agent;
  const kinds = new Set(events.map((event) => event.kind));
  const way = (move: number) => said.directions[move];
  const steps = (n: number) => plural(n, said.steps);
  const lines: string[] = [];

  if (kinds.has("start")) {
    lines.push(fill(said.start, { n: agent.body.length }));
  } else if (kinds.has("capture")) {
    lines.push(said.caught[agent.captures % said.caught.length]);
  }
  if (kinds.has("resume")) {
    lines.push(said.resumed);
  }
  if (kinds.has("end")) {
    return [...lines, plural(agent.captures, said.end)].join(" ");
  }

  // The routes it found, shortest first.
  const routes = decision.options
    .map((option, move) => ({ ...option, move }))
    .filter((option) => option.route !== null)
    .sort((a, b) => a.route! - b.route!);
  const [shortest] = routes;

  switch (decision.plan) {
    case "target": {
      const chosen = routes.find((option) => option.move === decision.move)!;
      if (shortest.move !== chosen.move && !shortest.exit) {
        // The short way is a trap: it says so, and takes the long safe one.
        lines.push(fill(said.one, { a: way(shortest.move), n: steps(shortest.route!) }), said.but);
        lines.push(fill(said.instead, { b: way(chosen.move), m: chosen.route! }));
        break;
      }
      const other = routes.find((option) => option.move !== chosen.move);
      lines.push(
        !other
          ? fill(said.one, { a: way(chosen.move), n: steps(chosen.route!) })
          : other.route === chosen.route
            ? fill(said.tie, { a: way(chosen.move), b: way(other.move), n: steps(chosen.route!) })
            : fill(said.two, { a: way(chosen.move), n: steps(chosen.route!), b: way(other.move), m: other.route! }),
      );
      lines.push(said.exit, course(agent));
      break;
    }
    case "tail":
      lines.push(
        ...(shortest ? [fill(said.one, { a: way(shortest.move), n: steps(shortest.route!) }), said.trap] : [said.closed]),
        said.tail,
      );
      break;
    case "space":
      lines.push(shortest ? said.trap : said.closed, said.space);
      break;
    case "trapped":
      lines.push(said.trapped);
      break;
  }
  return lines.join(" ");
}

/**
 * The route it will walk, the way it will walk it: "bajo 1 y voy 6 a la
 * izquierda". A route of more than two legs is going round the body, and
 * says so rather than listing every turn.
 */
function course(agent: SnakeAgent): string {
  let [x, y] = [agent.head.x, agent.head.y];
  const legs: { move: number; n: number }[] = [];
  for (const [cx, cy] of agent.decision.path) {
    const move = MOVES.findIndex(({ dx, dy }) => cx - x === dx && cy - y === dy);
    const leg = legs[legs.length - 1];
    if (leg?.move === move) {
      leg.n += 1;
    } else {
      legs.push({ move, n: 1 });
    }
    [x, y] = [cx, cy];
  }
  const [first, second] = legs.map(({ move, n }) => fill(said.legs[move], { n }));
  if (legs.length > 2) {
    return fill(said.winding, { a: said.directions[legs[0].move] });
  }
  const text = second ? fill(said.course, { a: first, b: second }) : `${first}.`;
  return text[0].toLocaleUpperCase("es") + text.slice(1);
}

/** What the status says once it has finished thinking. */
export const considered = (agent: SnakeAgent) =>
  plural(agent.decision.options.filter((option) => !option.veto).length, said.done);
