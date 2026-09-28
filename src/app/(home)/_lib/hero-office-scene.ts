import { uv } from "./hero-office-atlas";
import { LOGO_ISOTIPO, LOGO_WORD } from "./hero-office-logo";

/*
 * The home hero's walk through the office: four rooms round a solid core,
 * and the camera's round of them.
 *
 * The rooms share a shape — long, walked up the middle, left through a wide
 * doorway at the far end into the next — and nothing else. Development, with
 * the logo over a long desk of laptops and the agents' monitors across from
 * it; the server room, racks down both walls; the lounge, a sofa and
 * armchairs under the isotipo, the coffee counter; the meeting room, its
 * table, the cost on a screen and the architecture on a whiteboard. Three of
 * them carry one of Novit's lines on the far wall — the manual's own.
 *
 * The camera walks steadily and only glances: the head turns a little
 * towards what a room holds and comes back, and the corners are eased into
 * well before they come. No people.
 *
 * It is support for the headline beside it, not a scene of its own: drawn as
 * lines, the board's material, a step back in strength, with the words and
 * charts as one painted texture (`hero-office-atlas.ts`) set back further
 * still. Solid walls are also written as depth-only surfaces, so they hide
 * what is behind them without painting anything — the band's gradient shows
 * through everywhere.
 *
 * Plans are in map coordinates — X east, Z north, y up, metres — with
 * "right" as a person means it; `gl()` turns them into the renderer's.
 */

/* ----------------------------------------------------------------------------
 * Inks and motion
 * ------------------------------------------------------------------------- */

type Ink = readonly [number, number, number, number];
const WHITE = [1, 1, 1] as const;
const CELESTE = [0.239, 0.69, 0.894] as const;
const ink = (rgb: readonly number[], alpha: number): Ink => [rgb[0], rgb[1], rgb[2], alpha];

const INK = {
  structure: ink(WHITE, 0.3),
  detail: ink(WHITE, 0.12),
  furniture: ink(WHITE, 0.34),
  frame: ink(WHITE, 0.42),
  accent: ink(CELESTE, 0.8),
  logo: ink(WHITE, 0.4),
  logoMark: ink(CELESTE, 0.48),
} as const;

/** How a line moves, done in the shader: 0 still, 1 pulses along it at
 *  `param` metres a second from `from` to `to`. */
type Anim = readonly [kind: number, from: number, to: number, param: number];
const STILL: Anim = [0, 0, 0, 0];

/* ----------------------------------------------------------------------------
 * The buffers
 * ------------------------------------------------------------------------- */

/** Per line: a (3) b (3) colour (4) motion (4) billboard centre and flag (4). */
export const LINE_FLOATS = 18;
/** Per occluder vertex: position (3) billboard centre and flag (4). */
export const OCCLUDER_FLOATS = 7;
/** Per point: position (3) colour (4) blink (4) size (1). */
export const POINT_FLOATS = 12;
/** Per panel vertex: position (3) texture (2) place on the panel (2) reveal (4). */
export const PANEL_FLOATS = 11;

type V3 = readonly [number, number, number];
type V2 = readonly [number, number];

const lines: number[] = [];
const occluders: number[] = [];
const points: number[] = [];
const panels: number[] = [];

/** Map to renderer: the renderer's x runs the other way, so that its camera's
 *  right is a person's right on the plan. */
const gl = ([x, y, z]: V3): V3 => [-x, y, z];

function line(a: V3, b: V3, color: Ink, anim: Anim = STILL) {
  lines.push(...gl(a), ...gl(b), ...color, ...anim, 0, 0, 0, 0);
}

function polyline(path: readonly V3[], color: Ink, closed = false) {
  const count = closed ? path.length : path.length - 1;
  for (let i = 0; i < count; i++) line(path[i], path[(i + 1) % path.length], color);
}

function quad(a: V3, b: V3, c: V3, d: V3) {
  for (const p of [a, b, c, a, c, d]) occluders.push(...gl(p), 0, 0, 0, 0);
}

function point(p: V3, color: Ink, size: number, blink: readonly [number, number, number, number]) {
  points.push(...gl(p), ...color, ...blink, size);
}

/**
 * A texture on a flat quad: `corners` top-left, top-right, bottom-right,
 * bottom-left as the viewer sees it; `region` is where the atlas painted it.
 * `reveal` — [kind, start, duration, rows] — draws it in when the camera
 * gets to it: 1 left to right, 2 row by row, 0 not at all.
 */
function panel(region: string, corners: readonly [V3, V3, V3, V3], reveal: readonly [number, number, number, number] = [0, 0, 0, 0]) {
  const { u0, u1, v0, v1 } = uv(region);
  const at: [V3, number, number, number, number][] = [
    [corners[0], u0, v0, 0, 0],
    [corners[1], u1, v0, 1, 0],
    [corners[2], u1, v1, 1, 1],
    [corners[3], u0, v1, 0, 1],
  ];
  for (const index of [0, 1, 2, 0, 2, 3]) {
    const [p, u, v, lx, ly] = at[index];
    panels.push(...gl(p), u, v, lx, ly, ...reveal);
  }
}

/* ----------------------------------------------------------------------------
 * Surfaces
 * ------------------------------------------------------------------------- */

/** A vertical surface to draw on: `u` runs to the right of someone facing it,
 *  `v` up from the floor, and what is drawn stands a little off it, on the
 *  viewer's side, so the surface's own occluder never hides it. */
type Surface = { at: (u: number, v: number) => V3 };

function surface(origin: V2, normal: V2, lift = 0.012): Surface {
  const right: V2 = [-normal[1], normal[0]];
  return {
    at: (u, v) => [origin[0] + right[0] * u + normal[0] * lift, v, origin[1] + right[1] * u + normal[1] * lift],
  };
}

function rectOn(s: Surface, u0: number, v0: number, u1: number, v1: number, color: Ink) {
  polyline([s.at(u0, v0), s.at(u1, v0), s.at(u1, v1), s.at(u0, v1)], color, true);
}

function panelOn(s: Surface, region: string, u0: number, v0: number, u1: number, v1: number, reveal?: readonly [number, number, number, number]) {
  panel(region, [s.at(u0, v1), s.at(u1, v1), s.at(u1, v0), s.at(u0, v0)], reveal);
}

/** The lockup, as its traced outlines: the isotipo celeste, the word white.
 *  `u0, v0` is its lower left corner, `height` the ink's. `word: false` is
 *  the isotipo alone; `faint` sets it further back, for a large wall graphic
 *  or a decal on glass. */
function logoOn(s: Surface, u0: number, v0: number, height: number, { word = true, faint = false } = {}) {
  const draw = (set: readonly (readonly number[])[], color: Ink) => {
    for (const flat of set) {
      const path: V3[] = [];
      for (let i = 0; i < flat.length; i += 2) {
        path.push(s.at(u0 + flat[i] * height, v0 + (1 - flat[i + 1]) * height));
      }
      polyline(path, color, true);
    }
  };
  draw(LOGO_ISOTIPO, faint ? ink(CELESTE, 0.3) : INK.logoMark);
  if (word) draw(LOGO_WORD, INK.logo);
}

/* ----------------------------------------------------------------------------
 * The building's parts
 * ------------------------------------------------------------------------- */

const CEILING = 3;

type Opening = { from: number; to: number; top: number };

/** A wall on the plan from `a` to `b`: foot, head, ends, the frame of each
 *  opening, and — when solid — the surface that hides what is behind it, cut
 *  round the openings. `band` keeps only the part above that height solid:
 *  glass below it. */
function wall(a: V2, b: V2, { openings = [] as Opening[], band = 0, solid = true } = {}) {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const along = (d: number, y: number): V3 => [a[0] + ((b[0] - a[0]) * d) / length, y, a[1] + ((b[1] - a[1]) * d) / length];
  line(along(0, 0), along(length, 0), INK.structure);
  line(along(0, CEILING), along(length, CEILING), INK.structure);
  line(along(0, 0), along(0, CEILING), INK.structure);
  line(along(length, 0), along(length, CEILING), INK.structure);
  for (const { from, to, top } of openings) {
    polyline([along(from, 0), along(from, top), along(to, top), along(to, 0)], INK.frame);
    polyline([along(from - 0.06, 0), along(from - 0.06, top + 0.06), along(to + 0.06, top + 0.06), along(to + 0.06, 0)], INK.detail);
  }
  if (band) {
    line(along(0, band), along(length, band), INK.structure);
    line(along(0, 0.03), along(length, 0.03), INK.detail);
    const count = Math.round(length / 1.6);
    for (let i = 1; i < count; i++) line(along((i * length) / count, 0), along((i * length) / count, band), INK.detail);
    quad(along(0, band), along(length, band), along(length, CEILING), along(0, CEILING));
    return;
  }
  if (!solid) return;
  const cuts = [...openings].sort((p, q) => p.from - q.from);
  let at = 0;
  for (const { from, to, top } of cuts) {
    if (from > at) quad(along(at, 0), along(from, 0), along(from, CEILING), along(at, CEILING));
    quad(along(from, top), along(to, top), along(to, CEILING), along(from, CEILING));
    at = to;
  }
  if (at < length) quad(along(at, 0), along(length, 0), along(length, CEILING), along(at, CEILING));
}

function box(corners: (u: number, y: number, w: number) => V3, u0: number, u1: number, y0: number, y1: number, w0: number, w1: number, color: Ink, occlude = false) {
  const c = corners;
  for (const y of [y0, y1]) polyline([c(u0, y, w0), c(u1, y, w0), c(u1, y, w1), c(u0, y, w1)], color, true);
  for (const [u, w] of [[u0, w0], [u1, w0], [u1, w1], [u0, w1]]) line(c(u, y0, w), c(u, y1, w), color);
  if (!occlude) return;
  quad(c(u0, y0, w0), c(u1, y0, w0), c(u1, y1, w0), c(u0, y1, w0));
  quad(c(u0, y0, w1), c(u1, y0, w1), c(u1, y1, w1), c(u0, y1, w1));
  quad(c(u0, y0, w0), c(u0, y0, w1), c(u0, y1, w1), c(u0, y1, w0));
  quad(c(u1, y0, w0), c(u1, y0, w1), c(u1, y1, w1), c(u1, y1, w0));
  quad(c(u0, y1, w0), c(u1, y1, w0), c(u1, y1, w1), c(u0, y1, w1));
}

/* ----------------------------------------------------------------------------
 * The rooms
 * ------------------------------------------------------------------------- */

/**
 * Four long rooms round a solid core, each opening onto the next through a
 * wide doorway at its far end. They share their shape — laid out once, in
 * the first room's own place on the plan, the west room, 6 m wide from z 6
 * to 18, walked northwards up its middle, and turned a quarter clockwise
 * round the building's middle for each room further round — and nothing
 * else: each is its own kind of room, furnished as one.
 */
const CENTRE: V2 = [9, 9];
const WIDTH = 6;
/** The first room, on the plan. */
const ROOM = { x0: 0, x1: 6, z0: 6, z1: 18 };
/** The doorway into the next room, in the right wall: from, to, and head. */
const DOORWAY = { from: 13, to: 17, head: 2.5 };

function frameOf(k: number) {
  const turn = (u: number, w: number): V2 => {
    let a = u;
    let b = w;
    for (let i = 0; i < k; i++) [a, b] = [b, -a];
    return [a, b];
  };
  const at = (x: number, z: number): V2 => {
    const [a, b] = turn(x - CENTRE[0], z - CENTRE[1]);
    return [CENTRE[0] + a, CENTRE[1] + b];
  };
  return {
    at,
    p: (x: number, y: number, z: number): V3 => {
      const [px, pz] = at(x, z);
      return [px, y, pz];
    },
    dir: turn,
    /** A surface on the wall through (x, z), facing (nx, nz), in this room. */
    surface: (x: number, z: number, nx: number, nz: number, lift?: number) => surface(at(x, z), turn(nx, nz), lift),
  };
}
type Frame = ReturnType<typeof frameOf>;

type Look = { at: number; width: number; slow: number; look: V2; turn: number };
type Reveal = readonly [number, number, number, number];

/**
 * The four rooms, going round. Each has what the camera glances at — a
 * spot on the plan, how far into the room, and only part of the way: the
 * head turns a little and comes back, never swings — and what it holds.
 * `at(s)` is when the camera gets `s` metres into that room, for the screens
 * to draw in on.
 */
const ROOMS: { looks: Look[]; build: (F: Frame, at: (s: number) => number) => void }[] = [
  {
    // Development: the logo over the long desk and its laptops, the agents'
    // monitors across from them.
    looks: [
      { at: 1.3, width: 2.5, slow: 0.74, look: [6, 10.8], turn: 0.46 },
      { at: 3.6, width: 2.5, slow: 0.74, look: [0, 13.8], turn: 0.4 },
    ],
    build: (F, at) => {
      ceilingPanels(F);
      const left = F.surface(ROOM.x0, ROOM.z0, 1, 0);
      const height = 0.34;
      logoOn(left, 14.0 - ROOM.z0 - (height * 4.529) / 2, 1.82, height);
      box(F.p, 0.25, 1.05, 0.72, 0.76, 11.1, 15.5, INK.furniture);
      for (const [x, z] of [[0.35, 11.2], [0.95, 11.2], [0.35, 15.4], [0.95, 15.4]]) line(F.p(x, 0, z), F.p(x, 0.72, z), INK.detail);
      [11.9, 13.3, 14.7].forEach((z, i) => {
        laptop(F, 0.72, z, [1, 0, 2][i], at(2.4) + i * 0.35);
        chair(F, 1.45, z, 1);
      });
      tallPlant(F, 0.65, 17.35);
      const right = F.surface(ROOM.x1, 12, -1, 0);
      monitors(F, right, 12 - 12.75, 12 - 9.9, at(0.3));
      tv(right, "dev-tv", 12 - 9.5, 12 - 7.3, [1, at(0.9), 2.6, 8]);
      slogan(F, "dev", 1.72);
    },
  },
  {
    // The server room: racks down both walls, their lights, the trays, and
    // what is deployed on the far wall. The isotipo is on its glass doors.
    looks: [{ at: 3.2, width: 2.6, slow: 0.8, look: [0.8, 12.5], turn: 0.16 }],
    build: (F, at) => serverRoom(F, at),
  },
  {
    // The lounge: a sofa and two armchairs round a low table, the isotipo
    // large on the wall over them, the coffee counter and a television.
    looks: [
      { at: 1.4, width: 2.4, slow: 0.76, look: [6, 11.3], turn: 0.42 },
      { at: 3.5, width: 2.5, slow: 0.74, look: [0.8, 12.6], turn: 0.38 },
    ],
    build: (F, at) => lounge(F, at),
  },
  {
    // The meeting room: the table under the architecture on the whiteboard,
    // the cost on the screen across from it.
    looks: [
      { at: 1.3, width: 2.4, slow: 0.74, look: [6, 11.3], turn: 0.46 },
      { at: 3.5, width: 2.5, slow: 0.74, look: [0, 12.4], turn: 0.42 },
    ],
    build: (F, at) => meetingRoom(F, at),
  },
];

/** What every room has: its walls, and the doorway to the next one with its
 *  returns and the head over it. */
function shell(F: Frame) {
  const { x0, x1, z0, z1 } = ROOM;
  wall(F.at(x0, z0), F.at(x0, z1));
  wall(F.at(x0, z1), F.at(x1, z1));
  wall(F.at(x1, z1), F.at(x1, DOORWAY.to));
  wall(F.at(x1, DOORWAY.from), F.at(x1, z0));
  polyline([F.p(x1, 0, DOORWAY.to), F.p(x1, DOORWAY.head, DOORWAY.to), F.p(x1, DOORWAY.head, DOORWAY.from), F.p(x1, 0, DOORWAY.from)], INK.frame);
  line(F.p(x1, CEILING, DOORWAY.to), F.p(x1, CEILING, DOORWAY.from), INK.structure);
  quad(F.p(x1, DOORWAY.head, DOORWAY.to), F.p(x1, DOORWAY.head, DOORWAY.from), F.p(x1, CEILING, DOORWAY.from), F.p(x1, CEILING, DOORWAY.to));
}

/** A line on the far wall, centred, `v` its foot. */
function slogan(F: Frame, room: string, v: number) {
  const ahead = F.surface(ROOM.x0, ROOM.z1, 0, -1);
  const width = 5.0;
  panelOn(ahead, `slogan-${room}`, WIDTH / 2 - width / 2, v, WIDTH / 2 + width / 2, v + width * (120 / 1600));
}

function ceilingPanels(F: Frame) {
  for (const cz of [8, 11, 14, 17]) {
    for (const cx of [1.8, 4.2]) {
      polyline([F.p(cx - 0.6, CEILING - 0.005, cz - 0.3), F.p(cx + 0.6, CEILING - 0.005, cz - 0.3), F.p(cx + 0.6, CEILING - 0.005, cz + 0.3), F.p(cx - 0.6, CEILING - 0.005, cz + 0.3)], INK.detail, true);
    }
  }
}

/* The development room's pieces. */

/** A laptop on a table at (x, z), open towards the room's middle, its
 *  screen one of the atlas's. */
function laptop(F: Frame, x: number, z: number, screen: number, start: number, top = 0.765) {
  polyline([F.p(x - 0.13, top, z - 0.18), F.p(x + 0.12, top, z - 0.18), F.p(x + 0.12, top, z + 0.18), F.p(x - 0.13, top, z + 0.18)], INK.furniture, true);
  const lean = 0.06;
  const rise = 0.22;
  const c: [V3, V3, V3, V3] = [
    F.p(x - 0.13 - lean, top + rise, z - 0.18),
    F.p(x - 0.13 - lean, top + rise, z + 0.18),
    F.p(x - 0.13, top + 0.005, z + 0.18),
    F.p(x - 0.13, top + 0.005, z - 0.18),
  ];
  polyline(c, INK.frame, true);
  // The screen, a hair off the lid so the lid's occluder never covers it.
  const [dx, dz] = F.dir(0.004, 0);
  const toward = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k + dx, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k + dz];
  panel(`laptop-${screen}`, [toward(c[0], c[2], 0.04), toward(c[1], c[3], 0.04), toward(c[2], c[0], 0.04), toward(c[3], c[1], 0.04)], [2, start, 1.8, 5]);
  quad(c[0], c[1], c[2], c[3]);
}

/** A desk chair, its back to `side` (+1 east, -1 west). */
function chair(F: Frame, x: number, z: number, side: 1 | -1) {
  polyline([F.p(x - 0.22, 0.46, z - 0.22), F.p(x + 0.22, 0.46, z - 0.22), F.p(x + 0.22, 0.46, z + 0.22), F.p(x - 0.22, 0.46, z + 0.22)], INK.detail, true);
  const b = x + side * 0.22;
  polyline([F.p(b, 0.5, z - 0.2), F.p(b, 0.92, z - 0.2), F.p(b, 0.92, z + 0.2), F.p(b, 0.5, z + 0.2)], INK.detail);
  line(F.p(x, 0.06, z), F.p(x, 0.44, z), INK.detail);
  for (const [dx, dz] of [[-0.24, 0], [0.24, 0], [0, -0.24], [0, 0.24]]) line(F.p(x, 0.06, z), F.p(x + dx, 0.02, z + dz), INK.detail);
}

/** Three monitors over a console on the right wall: the agents at work. */
function monitors(F: Frame, s: Surface, u0: number, u1: number, start: number) {
  const each = (u1 - u0 - 0.12) / 3;
  const tall = each * (252 / 448);
  [0, 1, 2].forEach((i) => {
    const a = u0 + i * (each + 0.06);
    rectOn(s, a - 0.03, 1.3 - 0.03, a + each + 0.03, 1.3 + tall + 0.03, INK.frame);
    panelOn(s, `monitor-${i}`, a, 1.3, a + each, 1.3 + tall, [2, start + i * 0.4, 2, 6]);
  });
  const low = F.surface(ROOM.x1, 12, -1, 0, 0.4);
  polyline([low.at(u0, 0.74), low.at(u1, 0.74), low.at(u1, 0.78), low.at(u0, 0.78)], INK.furniture, true);
}

/** A television on a wall, its bezel, and what it shows. */
function tv(s: Surface, region: string, u0: number, u1: number, reveal: Reveal, aspect = 252 / 448, top = 2.3) {
  const tall = (u1 - u0) * aspect;
  const v0 = top - tall;
  rectOn(s, u0 - 0.04, v0 - 0.04, u1 + 0.04, top + 0.04, INK.frame);
  rectOn(s, u0 - 0.015, v0 - 0.015, u1 + 0.015, top + 0.015, INK.detail);
  panelOn(s, region, u0, v0, u1, top, reveal);
}

/** A tall plant: an octagonal pot, and long leaves arching out of it. */
function tallPlant(F: Frame, x: number, z: number) {
  pot(F, x, z, 0.18, 0.46);
  for (let n = 0; n < 11; n++) {
    const angle = n * 2.2;
    const reach = 0.36 + (n % 3) * 0.13;
    const rise = 0.66 + (n % 4) * 0.16;
    polyline(Array.from({ length: 7 }, (_, i): V3 => {
      const t = i / 6;
      return F.p(x + Math.cos(angle) * reach * t, 0.46 + rise * Math.sin(t * Math.PI * 0.85), z + Math.sin(angle) * reach * t);
    }), ink(CELESTE, 0.45));
  }
}

/** A round bush: a low pot and a crown of small loops. */
function bushPlant(F: Frame, x: number, z: number) {
  pot(F, x, z, 0.24, 0.34);
  for (let n = 0; n < 9; n++) {
    const angle = (n / 9) * Math.PI * 2;
    const r = 0.28 + (n % 2) * 0.08;
    const cx = x + Math.cos(angle) * 0.18;
    const cz = z + Math.sin(angle) * 0.18;
    const cy = 0.62 + (n % 3) * 0.12;
    polyline(Array.from({ length: 10 }, (_, i): V3 => F.p(cx + Math.cos((i / 10) * Math.PI * 2) * r * 0.5, cy + Math.sin((i / 10) * Math.PI * 2) * r * 0.4, cz)), ink(CELESTE, 0.4), true);
  }
}

/** A small succulent in a bowl, for a table top at `y`. */
function succulent(F: Frame, x: number, z: number, y: number) {
  const ring = (h: number, r: number) => Array.from({ length: 8 }, (_, i): V3 => F.p(x + r * Math.cos((i / 8) * Math.PI * 2), y + h, z + r * Math.sin((i / 8) * Math.PI * 2)));
  polyline(ring(0, 0.07), INK.furniture, true);
  polyline(ring(0.08, 0.1), INK.furniture, true);
  for (let n = 0; n < 7; n++) {
    const angle = (n / 7) * Math.PI * 2;
    line(F.p(x, y + 0.08, z), F.p(x + Math.cos(angle) * 0.1, y + 0.2, z + Math.sin(angle) * 0.1), ink(CELESTE, 0.45));
  }
}

function pot(F: Frame, x: number, z: number, radius: number, height: number) {
  const ring = (y: number, r: number) => Array.from({ length: 8 }, (_, i): V3 => F.p(x + r * Math.cos((i / 8) * Math.PI * 2), y, z + r * Math.sin((i / 8) * Math.PI * 2)));
  const foot = ring(0, radius * 0.8);
  const lip = ring(height, radius);
  polyline(foot, INK.furniture, true);
  polyline(lip, INK.furniture, true);
  foot.forEach((p, i) => i % 2 === 0 && line(p, lip[i], INK.detail));
}

/* The server room. */

function serverRoom(F: Frame, at: (s: number) => number) {
  // Light down the aisle, in two strips.
  for (const x of [2.2, 3.8]) line(F.p(x, CEILING - 0.01, 6.8), F.p(x, CEILING - 0.01, 17.2), INK.detail);
  const row = (x0: number, x1: number, z0: number, z1: number, face: number) => {
    const count = Math.floor((z1 - z0) / 0.62);
    for (let i = 0; i < count; i++) {
      const a = z0 + i * 0.62;
      const b = a + 0.58;
      box(F.p, x0, x1, 0, 2.1, a, b, INK.furniture, true);
      for (let y = 0.3; y < 2.05; y += 0.2) line(F.p(face, y, a + 0.04), F.p(face, y, b - 0.04), INK.detail);
      for (let n = 0; n < 5; n++) {
        const seed = i * 13 + n + Math.round(face * 100);
        point(F.p(face, 0.42 + n * 0.34 + hash(seed + 3) * 0.08, a + 0.1 + hash(seed) * 0.38), INK.accent, 3.2, [1, 0.25 + hash(seed + 5) * 0.8, hash(seed + 9), 0.35 + hash(seed + 11) * 0.5]);
      }
    }
    // The tray over the row, and the runs of light down it.
    const tray = (x0 + x1) / 2;
    line(F.p(tray - 0.2, 2.45, z0), F.p(tray - 0.2, 2.45, z1), INK.detail);
    line(F.p(tray + 0.2, 2.45, z0), F.p(tray + 0.2, 2.45, z1), INK.detail);
    for (let z = z0; z <= z1; z += 0.6) line(F.p(tray - 0.2, 2.45, z), F.p(tray + 0.2, 2.45, z), INK.detail);
    line(F.p(tray, 2.45, z0), F.p(tray, 2.45, z1), ink(CELESTE, 0.6), [1, 0, z1 - z0, 1.6]);
  };
  row(0.25, 1.05, 6.8, 17.4, 1.06);
  row(4.95, 5.75, 6.8, 12.8, 4.94);
  // The raised floor, down the aisle.
  for (let x = 1.2; x <= 4.81; x += 0.6) line(F.p(x, 0.005, 6.3), F.p(x, 0.005, 17.7), ink(WHITE, 0.08));
  for (let z = 6.3; z <= 17.71; z += 0.6) line(F.p(1.15, 0.005, z), F.p(4.85, 0.005, z), ink(WHITE, 0.08));
  // What is deployed, on the far wall.
  const ahead = F.surface(ROOM.x0, ROOM.z1, 0, -1);
  tv(ahead, "status", 2.0, 4.0, [2, at(1.5), 2.2, 5], 252 / 448, 2.35);
  // The glass doors it is entered by, slid open, the isotipo on one.
  for (const [a, b] of [[1.0, 1.95], [4.05, 5.0]]) {
    polyline([F.p(a, 0, 6.1), F.p(a, 2.45, 6.1), F.p(b, 2.45, 6.1), F.p(b, 0, 6.1)], INK.frame, true);
  }
  const door = F.surface(4.05, 6.1, 0, -1, 0.01);
  logoOn(door, 0.3, 1.34, 0.26, { word: false, faint: true });
}

/* The lounge. */

function lounge(F: Frame, at: (s: number) => number) {
  // Pendant lamps over the seating, on their cords.
  for (const z of [11.6, 13.4]) {
    polyline(Array.from({ length: 16 }, (_, i): V3 => F.p(1.6 + 0.24 * Math.cos((i / 16) * Math.PI * 2), 2.3, z + 0.24 * Math.sin((i / 16) * Math.PI * 2))), INK.furniture, true);
    polyline(Array.from({ length: 16 }, (_, i): V3 => F.p(1.6 + 0.12 * Math.cos((i / 16) * Math.PI * 2), 2.46, z + 0.12 * Math.sin((i / 16) * Math.PI * 2))), INK.detail, true);
    line(F.p(1.6, 2.46, z), F.p(1.6, CEILING, z), INK.detail);
  }
  // The isotipo, large and faint on the wall over the sofa.
  const left = F.surface(ROOM.x0, ROOM.z0, 1, 0);
  const height = 0.78;
  logoOn(left, 12.5 - ROOM.z0 - (height * 1.19) / 2, 1.3, height, { word: false, faint: true });
  // The sofa along the wall: seat, back, arms and the seams of its cushions.
  box(F.p, 0.3, 1.2, 0, 0.42, 10.4, 14.6, INK.furniture, true);
  box(F.p, 0.2, 0.42, 0.42, 0.88, 10.4, 14.6, INK.furniture, true);
  for (const z of [10.4, 14.6]) box(F.p, 0.2, 1.2, 0.42, 0.62, z - 0.14, z, INK.furniture);
  for (const z of [11.8, 13.2]) line(F.p(1.2, 0.42, z), F.p(0.42, 0.42, z), INK.detail);
  // The rug, the round table, the armchairs either end of it.
  polyline([F.p(0.35, 0.004, 10.1), F.p(2.7, 0.004, 10.1), F.p(2.7, 0.004, 14.9), F.p(0.35, 0.004, 14.9)], INK.detail, true);
  const ring = (y: number, r: number) => Array.from({ length: 20 }, (_, i): V3 => F.p(1.95 + r * Math.cos((i / 20) * Math.PI * 2), y, 12.5 + r * Math.sin((i / 20) * Math.PI * 2)));
  polyline(ring(0.4, 0.42), INK.furniture, true);
  polyline(ring(0.36, 0.42), INK.detail, true);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    line(F.p(1.95 + 0.3 * Math.cos(a), 0.36, 12.5 + 0.3 * Math.sin(a)), F.p(1.95 + 0.32 * Math.cos(a), 0, 12.5 + 0.32 * Math.sin(a)), INK.detail);
  }
  succulent(F, 1.95, 12.5, 0.4);
  armchair(F, 2.05, 10.15, 1);
  armchair(F, 2.05, 14.85, -1);
  // A floor lamp at the sofa's end.
  line(F.p(0.6, 0, 15.25), F.p(0.6, 1.5, 15.25), INK.detail);
  polyline(Array.from({ length: 12 }, (_, i): V3 => F.p(0.6 + 0.2 * Math.cos((i / 12) * Math.PI * 2), 1.48, 15.25 + 0.2 * Math.sin((i / 12) * Math.PI * 2))), INK.furniture, true);
  polyline(Array.from({ length: 12 }, (_, i): V3 => F.p(0.6 + 0.12 * Math.cos((i / 12) * Math.PI * 2), 1.7, 15.25 + 0.12 * Math.sin((i / 12) * Math.PI * 2))), INK.furniture, true);
  // The coffee counter by the door in, its machine and two cups, a shelf
  // over it; and further along, the television.
  box(F.p, 5.25, 5.95, 0, 0.92, 6.6, 9.6, INK.furniture, true);
  box(F.p, 5.45, 5.85, 0.92, 1.3, 7.2, 7.6, INK.furniture, true);
  for (const z of [8.1, 8.35]) {
    polyline(Array.from({ length: 8 }, (_, i): V3 => F.p(5.55 + 0.05 * Math.cos((i / 8) * Math.PI * 2), 1.02, z + 0.05 * Math.sin((i / 8) * Math.PI * 2))), INK.detail, true);
    polyline(Array.from({ length: 8 }, (_, i): V3 => F.p(5.55 + 0.05 * Math.cos((i / 8) * Math.PI * 2), 0.92, z + 0.05 * Math.sin((i / 8) * Math.PI * 2))), INK.detail, true);
  }
  line(F.p(5.7, 1.75, 6.7), F.p(5.7, 1.75, 9.5), INK.furniture);
  const right = F.surface(ROOM.x1, 12, -1, 0);
  tv(right, "lounge-tv", 12 - 12.6, 12 - 10.2, [1, at(0.6), 2.6, 8]);
  // Under the far wall's line, a low bookshelf.
  box(F.p, 0.8, 5.2, 0, 1.1, 17.62, 17.98, INK.furniture, true);
  for (const y of [0.37, 0.74]) line(F.p(0.8, y, 17.62), F.p(5.2, y, 17.62), INK.detail);
  for (let n = 0; n < 26; n++) {
    const x = 0.95 + n * 0.16 + hash(n) * 0.05;
    const shelf = [0.02, 0.39, 0.76][n % 3];
    line(F.p(x, shelf, 17.61), F.p(x, shelf + 0.2 + hash(n + 7) * 0.1, 17.61), INK.detail);
  }
  slogan(F, "lounge", 1.72);
  bushPlant(F, 5.35, 17.35);
  tallPlant(F, 0.6, 6.6);
}

/** An armchair facing along the room: +1 north, -1 south. */
function armchair(F: Frame, x: number, z: number, facing: 1 | -1) {
  const back = z - facing * 0.36;
  box(F.p, x - 0.42, x + 0.42, 0, 0.4, Math.min(z - facing * 0.4, z + facing * 0.34), Math.max(z - facing * 0.4, z + facing * 0.34), INK.furniture, true);
  box(F.p, x - 0.42, x + 0.42, 0.4, 0.84, Math.min(back, back - facing * 0.12), Math.max(back, back - facing * 0.12), INK.furniture, true);
  for (const side of [-1, 1]) {
    const ax = x + side * 0.36;
    box(F.p, Math.min(ax, ax + side * 0.08), Math.max(ax, ax + side * 0.08), 0.4, 0.6, Math.min(z - facing * 0.4, z + facing * 0.3), Math.max(z - facing * 0.4, z + facing * 0.3), INK.furniture);
  }
}

/* The meeting room. */

function meetingRoom(F: Frame, at: (s: number) => number) {
  // A long pendant over the table.
  polyline([F.p(1.25, 2.4, 10.6), F.p(1.55, 2.4, 10.6), F.p(1.55, 2.4, 14.4), F.p(1.25, 2.4, 14.4)], INK.furniture, true);
  for (const z of [10.8, 14.2]) line(F.p(1.4, 2.4, z), F.p(1.4, CEILING, z), INK.detail);
  // The table and its chairs, pushed in; a laptop and a plant on it.
  box(F.p, 0.8, 2.0, 0.72, 0.76, 10.0, 15.0, INK.furniture);
  for (const [x, z] of [[0.9, 10.1], [1.9, 10.1], [0.9, 14.9], [1.9, 14.9]]) line(F.p(x, 0, z), F.p(x, 0.72, z), INK.detail);
  for (const z of [10.6, 11.9, 13.1, 14.4]) {
    chair(F, 0.5, z, -1);
    chair(F, 2.3, z, 1);
  }
  laptop(F, 1.55, 11.9, 3, at(2.6));
  succulent(F, 1.4, 13.7, 0.76);
  // The whiteboard over the table, its frame and marker tray.
  const left = F.surface(ROOM.x0, ROOM.z0, 1, 0);
  const u0 = 11.05 - ROOM.z0;
  const u1 = 13.75 - ROOM.z0;
  const v1 = 2.4;
  const v0 = v1 - (u1 - u0) * (384 / 768);
  rectOn(left, u0 - 0.05, v0 - 0.05, u1 + 0.05, v1 + 0.05, INK.frame);
  const tray = F.surface(ROOM.x0, ROOM.z0, 1, 0, 0.06);
  polyline([tray.at(u0 + 0.1, v0 - 0.08), tray.at(u1 - 0.1, v0 - 0.08)], INK.furniture);
  panelOn(left, "meeting-board", u0, v0, u1, v1, [1, at(2.4), 3, 8]);
  // The cost, on the screen across from it.
  const right = F.surface(ROOM.x1, 12, -1, 0);
  tv(right, "meeting-screen", 12 - 12.7, 12 - 9.9, [1, at(0.4), 2.8, 8], 384 / 768, 2.35);
  slogan(F, "meeting", 1.72);
  tallPlant(F, 0.6, 17.35);
}

/* ----------------------------------------------------------------------------
 * The walk
 * ------------------------------------------------------------------------- */

/** Up the middle of each room, then a quarter turn through its doorway into
 *  the next: 6 m straight, and an arc of 3 m radius. */
const STRAIGHT = 6;
const TURN = 3;
const PER_ROOM = STRAIGHT + (Math.PI / 2) * TURN;
const LENGTH = PER_ROOM * 4;
const STEP = 0.02;
const SAMPLES = Math.round(LENGTH / STEP);

/** Where the walk is `s` metres into a room, in the first room's frame. */
function localPlace(s: number): { x: number; z: number; heading: number } {
  const mid = WIDTH / 2;
  if (s <= STRAIGHT) return { x: mid, z: ROOM.z0 + s, heading: 0 };
  const angle = (s - STRAIGHT) / TURN;
  return { x: mid + TURN - TURN * Math.cos(angle), z: ROOM.z0 + STRAIGHT + TURN * Math.sin(angle), heading: angle };
}

function placeAt(s: number) {
  const wrapped = ((s % LENGTH) + LENGTH) % LENGTH;
  const room = Math.floor(wrapped / PER_ROOM) % 4;
  const local = wrapped - room * PER_ROOM;
  const place = localPlace(local);
  const [x, z] = frameOf(room).at(place.x, place.z);
  return { x, z, heading: place.heading + (room * Math.PI) / 2, room, local };
}

const SPEED = 0.85;

const bump = (distance: number, width: number) => {
  const k = Math.min(1, Math.abs(distance) / width);
  return 0.5 + 0.5 * Math.cos(Math.PI * k);
};

function speedAt(s: number) {
  const { room, local } = placeAt(s);
  let speed = SPEED;
  for (const { at, width, slow } of ROOMS[room].looks) {
    speed *= 1 - (1 - slow) * bump(local - at, width);
  }
  return speed;
}

/** Seconds to reach each point of the walk. */
const TIMES: number[] = [];
{
  let t = 0;
  for (let i = 0; i <= SAMPLES; i++) {
    TIMES.push(t);
    t += STEP / speedAt(i * STEP);
  }
}
/** One round of the four rooms, s. */
export const LOOP = TIMES[SAMPLES];
const timeAt = (s: number) => TIMES[Math.min(SAMPLES, Math.max(0, Math.round(s / STEP)))];

ROOMS.forEach(({ build }, k) => {
  const F = frameOf(k);
  shell(F);
  build(F, (s) => timeAt(k * PER_ROOM + s));
});

export type Camera = { eye: [number, number, number]; target: [number, number, number] };

/** Where the camera is and where it looks, `t` s into the walk. */
export function cameraAt(t: number): Camera {
  const time = ((t % LOOP) + LOOP) % LOOP;
  let lo = 0;
  let hi = SAMPLES - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (TIMES[mid] <= time) lo = mid;
    else hi = mid - 1;
  }
  const s = (lo + (time - TIMES[lo]) / (TIMES[lo + 1] - TIMES[lo])) * STEP;
  const { x, z, room, local } = placeAt(s);
  // The heading, averaged over the next few metres, so the camera eases into
  // a turn well before it and out of it well after: no sudden swing.
  let hx = 0;
  let hz = 0;
  for (let j = 0; j <= 16; j++) {
    const ahead = placeAt(s + j * 0.16).heading;
    const weight = 1 - j / 20;
    hx += Math.sin(ahead) * weight;
    hz += Math.cos(ahead) * weight;
  }
  let heading = Math.atan2(hx, hz);
  const F = frameOf(room);
  for (const { at, width, look, turn } of ROOMS[room].looks) {
    const weight = bump(local - at, width) * turn;
    if (weight <= 0) continue;
    const [lx, lz] = F.at(look[0], look[1]);
    const toward = Math.atan2(lx - x, lz - z);
    heading += Math.atan2(Math.sin(toward - heading), Math.cos(toward - heading)) * weight;
  }
  const eye: V3 = [x, 1.6, z];
  const target: V3 = [x + Math.sin(heading), 1.57, z + Math.cos(heading)];
  const [ex, ey, ez] = gl(eye);
  const [tx, ty, tz] = gl(target);
  return { eye: [ex, ey, ez], target: [tx, ty, tz] };
}

/** The still frame: in the development room, the logo, the laptops and the
 *  monitors in view, everything drawn in. */
export const STILL_TIME = timeAt(3.2);
export const STILL_REVEAL = timeAt(4.5) + 4;

/* ----------------------------------------------------------------------------
 * Out
 * ------------------------------------------------------------------------- */

export const SCENE = {
  lines: new Float32Array(lines),
  occluders: new Float32Array(occluders),
  points: new Float32Array(points),
  panels: new Float32Array(panels),
};

function hash(n: number) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}
