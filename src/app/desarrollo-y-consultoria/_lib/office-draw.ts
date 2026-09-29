import { uv } from "./office-atlas";
import { LOGO_ISOTIPO, LOGO_WORD } from "./office-logo";

/*
 * The office walk's drawing kit: the buffers the renderer takes, the few
 * things the scene can write into them — a line, a surface that hides what
 * is behind it, a light, a painted panel — and the solids the rest is built
 * out of.
 *
 * There are two sets of buffers. Inside is the floor the camera walks; the
 * city out of the windows goes outside, drawn with its own depth range and
 * haze, so a street 300 m off keeps its precision and never shows through a
 * wall.
 *
 * Plans are in map coordinates — X east, Z north, y up, metres — with
 * "right" as a person means it; `gl()` turns them into the renderer's.
 */

export type V3 = readonly [number, number, number];
export type V2 = readonly [number, number];
export type Ink = readonly [number, number, number, number];

export const WHITE = [1, 1, 1] as const;
export const CELESTE = [0.239, 0.69, 0.894] as const;
export const ink = (rgb: readonly number[], alpha: number): Ink => [rgb[0], rgb[1], rgb[2], alpha];

/** The inks, strongest first: the frames and edges that make a room, the
 *  furniture, then the fine detail — a drawing's hierarchy, a step back
 *  from white throughout. */
export const INK = {
  frame: ink(WHITE, 0.42),
  furniture: ink(WHITE, 0.34),
  structure: ink(WHITE, 0.3),
  glass: ink(WHITE, 0.2),
  detail: ink(WHITE, 0.12),
  faint: ink(WHITE, 0.07),
  accent: ink(CELESTE, 0.8),
  leaf: ink(CELESTE, 0.42),
  logo: ink(WHITE, 0.4),
  logoMark: ink(CELESTE, 0.48),
} as const;

/** How a line moves, worked out in the shader from the clock: 0 still;
 *  1 flow — a pulse every 2.6 m running along it at `param` m/s, `from` and
 *  `to` being its ends' places along the run; 2 traffic — a car's lights
 *  now and then, nothing between them, the lane told apart by the kind's
 *  fraction. */
export type Anim = readonly [kind: number, from: number, to: number, param: number];
export const STILL: Anim = [0, 0, 0, 0];

/** A light's blink: [on, rate, phase, duty] — lit for `duty` of every
 *  1/`rate` s, low between. */
export type Blink = readonly [number, number, number, number];
export const STEADY: Blink = [0, 0, 0, 0];

/** A panel's reveal — [kind, start, duration, rows] — drawn in when the
 *  camera gets to it: 1 left to right, 2 row by row, 0 not at all. */
export type Reveal = readonly [number, number, number, number];
export const SHOWN: Reveal = [0, 0, 0, 0];

/* ----------------------------------------------------------------------------
 * The buffers
 * ------------------------------------------------------------------------- */

/** Per line: a (3) b (3) colour (4) motion (4) billboard centre and flag (4)
 *  weight (1). */
export const LINE_FLOATS = 19;
/** Per occluder vertex: position (3) billboard centre and flag (4). */
export const OCCLUDER_FLOATS = 7;
/** Per point: position (3) colour (4) blink (4) size (1). */
export const POINT_FLOATS = 12;
/** Per panel vertex: position (3) texture (2) place on the panel (2) reveal (4). */
export const PANEL_FLOATS = 11;

/** A float buffer that grows as it is written, so a scene of many thousand
 *  lines never goes through a JavaScript array of numbers. */
class Floats {
  data = new Float32Array(1 << 14);
  length = 0;

  room(count: number) {
    if (this.length + count <= this.data.length) return;
    let size = this.data.length * 2;
    while (size < this.length + count) size *= 2;
    const next = new Float32Array(size);
    next.set(this.data.subarray(0, this.length));
    this.data = next;
  }

  put(...values: number[]) {
    this.room(values.length);
    this.data.set(values, this.length);
    this.length += values.length;
  }

  done() {
    return this.data.slice(0, this.length);
  }
}

type Layer = { lines: Floats; occluders: Floats; points: Floats; panels: Floats };
const newLayer = (): Layer => ({ lines: new Floats(), occluders: new Floats(), points: new Floats(), panels: new Floats() });

let inside = newLayer();
let outside = newLayer();
let layer = inside;

/** Whatever `build` draws goes to the outside buffers: the city. */
export function outdoors(build: () => void) {
  layer = outside;
  try {
    build();
  } finally {
    layer = inside;
  }
}

export type LayerData = { lines: Float32Array; occluders: Float32Array; points: Float32Array; panels: Float32Array };
export type SceneData = { inside: LayerData; outside: LayerData };

/** Hands over everything drawn so far, and starts afresh. */
export function takeScene(): SceneData {
  const done = (l: Layer): LayerData => ({ lines: l.lines.done(), occluders: l.occluders.done(), points: l.points.done(), panels: l.panels.done() });
  const scene = { inside: done(inside), outside: done(outside) };
  inside = newLayer();
  outside = newLayer();
  layer = inside;
  return scene;
}

/* ----------------------------------------------------------------------------
 * What can be written
 * ------------------------------------------------------------------------- */

/** Map to renderer: the renderer's x runs the other way, so that its camera's
 *  right is a person's right on the plan. */
export const gl = ([x, y, z]: V3): V3 => [-x, y, z];

export function line(a: V3, b: V3, color: Ink, anim: Anim = STILL, weight = 1) {
  const f = layer.lines;
  f.room(LINE_FLOATS);
  const d = f.data;
  let i = f.length;
  d[i++] = -a[0]; d[i++] = a[1]; d[i++] = a[2];
  d[i++] = -b[0]; d[i++] = b[1]; d[i++] = b[2];
  d[i++] = color[0]; d[i++] = color[1]; d[i++] = color[2]; d[i++] = color[3];
  d[i++] = anim[0]; d[i++] = anim[1]; d[i++] = anim[2]; d[i++] = anim[3];
  d[i++] = 0; d[i++] = 0; d[i++] = 0; d[i++] = 0;
  d[i++] = weight;
  f.length = i;
}

export function polyline(path: readonly V3[], color: Ink, closed = false, weight = 1) {
  const count = closed ? path.length : path.length - 1;
  for (let i = 0; i < count; i++) line(path[i], path[(i + 1) % path.length], color, STILL, weight);
}

/** A line along a path that moves as one run: the flow or the traffic
 *  passes from one piece into the next. */
export function run(path: readonly V3[], color: Ink, kind: number, speed: number, offset = 0, weight = 1) {
  let at = offset;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    line(a, b, color, [kind, at, at + length, speed], weight);
    at += length;
  }
}

/** A line that turns to face the camera, drawn round `centre`: `a` and `b`
 *  are across (to the camera's right) and up from it. A tree's crown. */
export function billboardLine(centre: V3, a: V2, b: V2, color: Ink, weight = 1) {
  const f = layer.lines;
  f.room(LINE_FLOATS);
  const d = f.data;
  let i = f.length;
  d[i++] = a[0]; d[i++] = a[1]; d[i++] = 0;
  d[i++] = b[0]; d[i++] = b[1]; d[i++] = 0;
  d[i++] = color[0]; d[i++] = color[1]; d[i++] = color[2]; d[i++] = color[3];
  d[i++] = 0; d[i++] = 0; d[i++] = 0; d[i++] = 0;
  d[i++] = -centre[0]; d[i++] = centre[1]; d[i++] = centre[2]; d[i++] = 1;
  d[i++] = weight;
  f.length = i;
}

/** Depth only: a surface that hides what is behind it and paints nothing. */
export function quad(a: V3, b: V3, c: V3, d: V3) {
  const f = layer.occluders;
  f.room(OCCLUDER_FLOATS * 6);
  const data = f.data;
  let i = f.length;
  for (const p of [a, b, c, a, c, d]) {
    data[i] = -p[0];
    data[i + 1] = p[1];
    data[i + 2] = p[2];
    data[i + 3] = 0;
    data[i + 4] = 0;
    data[i + 5] = 0;
    data[i + 6] = 0;
    i += OCCLUDER_FLOATS;
  }
  f.length = i;
}

/** A flat disc facing the camera round `centre`, hiding what is behind it. */
export function billboardDisc(centre: V3, radius: number, lift: number, sides = 8) {
  const f = layer.occluders;
  f.room(OCCLUDER_FLOATS * 3 * sides);
  const d = f.data;
  let i = f.length;
  const vertex = (x: number, y: number) => {
    d[i++] = x; d[i++] = y; d[i++] = 0;
    d[i++] = -centre[0]; d[i++] = centre[1]; d[i++] = centre[2]; d[i++] = 1;
  };
  for (let k = 0; k < sides; k++) {
    const a = (k / sides) * Math.PI * 2;
    const b = ((k + 1) / sides) * Math.PI * 2;
    vertex(0, lift);
    vertex(Math.cos(a) * radius, lift + Math.sin(a) * radius);
    vertex(Math.cos(b) * radius, lift + Math.sin(b) * radius);
  }
  f.length = i;
}

export function point(p: V3, color: Ink, size: number, blink: Blink = STEADY) {
  layer.points.put(-p[0], p[1], p[2], ...color, ...blink, size);
}

/**
 * A texture on a flat quad: `corners` top-left, top-right, bottom-right,
 * bottom-left as the viewer sees it; `region` is where the atlas painted it.
 */
export function panel(region: string, corners: readonly [V3, V3, V3, V3], reveal: Reveal = SHOWN) {
  const { u0, u1, v0, v1 } = uv(region);
  const at: [V3, number, number, number, number][] = [
    [corners[0], u0, v0, 0, 0],
    [corners[1], u1, v0, 1, 0],
    [corners[2], u1, v1, 1, 1],
    [corners[3], u0, v1, 0, 1],
  ];
  for (const index of [0, 1, 2, 0, 2, 3]) {
    const [p, u, v, lx, ly] = at[index];
    layer.panels.put(-p[0], p[1], p[2], u, v, lx, ly, ...reveal);
  }
}

/* ----------------------------------------------------------------------------
 * Surfaces
 * ------------------------------------------------------------------------- */

/** A vertical surface to draw on: `u` runs to the right of someone facing it,
 *  `v` up from the floor, and what is drawn stands a little off it, on the
 *  viewer's side, so the surface's own occluder never hides it. */
export type Surface = { at: (u: number, v: number) => V3; origin: V2; normal: V2; lift: number };

export function surface(origin: V2, normal: V2, lift = 0.012): Surface {
  const right: V2 = [-normal[1], normal[0]];
  return {
    origin,
    normal,
    lift,
    at: (u, v) => [origin[0] + right[0] * u + normal[0] * lift, v, origin[1] + right[1] * u + normal[1] * lift],
  };
}

/** The same surface, `by` further off it. */
export const lifted = (s: Surface, by: number) => surface(s.origin, s.normal, s.lift + by);

export function rectOn(s: Surface, u0: number, v0: number, u1: number, v1: number, color: Ink, weight = 1) {
  polyline([s.at(u0, v0), s.at(u1, v0), s.at(u1, v1), s.at(u0, v1)], color, true, weight);
}

export function panelOn(s: Surface, region: string, u0: number, v0: number, u1: number, v1: number, reveal?: Reveal) {
  panel(region, [s.at(u0, v1), s.at(u1, v1), s.at(u1, v0), s.at(u0, v0)], reveal);
}

/** A rectangle that hides what is behind it, on a surface. */
export function blockOn(s: Surface, u0: number, v0: number, u1: number, v1: number) {
  quad(s.at(u0, v0), s.at(u1, v0), s.at(u1, v1), s.at(u0, v1));
}

/** The lockup, as its traced outlines: the isotipo celeste, the word white.
 *  `u0, v0` is its lower left corner, `height` the ink's. `word: false` is
 *  the isotipo alone; `faint` sets it further back, for a large wall graphic
 *  or a decal on glass; `depth` stands it off the wall as cut letters, their
 *  backs drawn faint behind. */
export function logoOn(s: Surface, u0: number, v0: number, height: number, { word = true, faint = false, depth = 0 } = {}) {
  const draw = (on: Surface, set: readonly (readonly number[])[], color: Ink) => {
    for (const flat of set) {
      const path: V3[] = [];
      for (let i = 0; i < flat.length; i += 2) {
        path.push(on.at(u0 + flat[i] * height, v0 + (1 - flat[i + 1]) * height));
      }
      polyline(path, color, true);
    }
  };
  const front = depth ? lifted(s, depth) : s;
  draw(front, LOGO_ISOTIPO, faint ? ink(CELESTE, 0.3) : INK.logoMark);
  if (word) draw(front, LOGO_WORD, INK.logo);
  if (depth) {
    draw(s, LOGO_ISOTIPO, ink(CELESTE, 0.14));
    if (word) draw(s, LOGO_WORD, ink(WHITE, 0.1));
  }
}

/* ----------------------------------------------------------------------------
 * Solids
 * ------------------------------------------------------------------------- */

/** Where a piece's own coordinates land: `u` to its right, `w` ahead of it —
 *  the way it faces — and `y` up. */
export type Place = (u: number, y: number, w: number) => V3;

/** A piece stood at (x, z) on a plan, facing `angle` — 0 towards +z, a
 *  quarter turn towards +x. `P` is the plan's own place. */
export function piece(P: Place, x: number, z: number, angle = 0): Place {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return (u, y, w) => P(x + u * c + w * s, y, z - u * s + w * c);
}

/** A box's edges, and — when `occlude` — its faces as depth. */
export function box(c: Place, u0: number, u1: number, y0: number, y1: number, w0: number, w1: number, color: Ink, occlude = false, weight = 1) {
  for (const y of [y0, y1]) polyline([c(u0, y, w0), c(u1, y, w0), c(u1, y, w1), c(u0, y, w1)], color, true, weight);
  for (const [u, w] of [[u0, w0], [u1, w0], [u1, w1], [u0, w1]]) line(c(u, y0, w), c(u, y1, w), color, STILL, weight);
  if (occlude) solid(c, u0, u1, y0, y1, w0, w1);
}

/** A box as depth alone: its sides and top. Nothing in the walk is ever
 *  seen from below. */
export function solid(c: Place, u0: number, u1: number, y0: number, y1: number, w0: number, w1: number) {
  const a = c(u0, y0, w0);
  const b = c(u1, y0, w0);
  const e = c(u1, y0, w1);
  const d = c(u0, y0, w1);
  const a1 = c(u0, y1, w0);
  const b1 = c(u1, y1, w0);
  const e1 = c(u1, y1, w1);
  const d1 = c(u0, y1, w1);
  quad(a, b, b1, a1);
  quad(d, e, e1, d1);
  quad(a, d, d1, a1);
  quad(b, e, e1, b1);
  quad(a1, b1, e1, d1);
}

/** A horizontal ring of `sides` points round (u, w) at height `y`. */
export function ring(c: Place, u: number, y: number, w: number, radius: number, sides = 12, radiusW = radius): V3[] {
  return Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * Math.PI * 2;
    return c(u + Math.cos(a) * radius, y, w + Math.sin(a) * radiusW);
  });
}

/** A standing cylinder: its two rims, a few of its sides, and its body as
 *  depth when `occlude`. */
export function cylinder(c: Place, u: number, w: number, radius: number, y0: number, y1: number, color: Ink, { sides = 12, edges = 4, occlude = false, top = radius, rimColor = color } = {}) {
  const foot = ring(c, u, y0, w, radius, sides);
  const head = ring(c, u, y1, w, top, sides);
  polyline(foot, rimColor, true);
  polyline(head, rimColor, true);
  const every = Math.max(1, Math.round(sides / Math.max(1, edges)));
  if (edges) for (let i = 0; i < sides; i += every) line(foot[i], head[i], color);
  if (!occlude) return;
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    quad(foot[i], foot[j], head[j], head[i]);
  }
  for (let i = 1; i < sides - 1; i++) {
    quad(head[0], head[i], head[i + 1], head[i + 1]);
  }
}

/** A flat rectangle's outline at height `y`. */
export function flat(c: Place, u0: number, u1: number, w0: number, w1: number, y: number, color: Ink) {
  polyline([c(u0, y, w0), c(u1, y, w0), c(u1, y, w1), c(u0, y, w1)], color, true);
}

/** A rectangle with its corners rounded by `r`, flat at height `y`. */
export function roundFlat(c: Place, u0: number, u1: number, w0: number, w1: number, y: number, r: number, color: Ink, steps = 3) {
  const path: V3[] = [];
  const corners: [number, number, number][] = [
    [u1 - r, w0 + r, -Math.PI / 2],
    [u1 - r, w1 - r, 0],
    [u0 + r, w1 - r, Math.PI / 2],
    [u0 + r, w0 + r, Math.PI],
  ];
  for (const [cu, cw, start] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = start + (i / steps) * (Math.PI / 2);
      path.push(c(cu + Math.cos(a) * r, y, cw + Math.sin(a) * r));
    }
  }
  polyline(path, color, true);
}

/** A curve through `count + 1` points of `f(t)`, t from 0 to 1. */
export function curve(f: (t: number) => V3, count: number, color: Ink, closed = false) {
  polyline(Array.from({ length: count + 1 }, (_, i) => f(i / count)), color, closed);
}

/* ----------------------------------------------------------------------------
 * Chance, fixed
 * ------------------------------------------------------------------------- */

/** A number in [0, 1) for every integer: the same one every time, so the
 *  scene is drawn identically on every load. */
export function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

/** A run of fixed chances from one seed. */
export function chance(seed: number) {
  let n = seed * 7919;
  return () => hash(n++);
}
