import { OBELISCO, cityPieces } from "./hero-office-city";
import {
  CELESTE,
  INK,
  WHITE,
  box,
  curve,
  cylinder,
  gl,
  hash,
  ink,
  lifted,
  line,
  logoOn,
  panel,
  panelOn,
  piece,
  point,
  polyline,
  quad,
  rectOn,
  ring,
  surface,
  takeScene,
  type Place,
  type LayerData,
  type Reveal,
  type Surface,
  type V2,
  type V3,
} from "./hero-office-draw";
import {
  agentPuck,
  arcLamp,
  armchair,
  barStool,
  bushPlant,
  clock,
  desk,
  deskLamp,
  ficus,
  framed,
  fridge,
  globe,
  hangingPlant,
  headphones,
  keyboard,
  kitchen,
  laptop,
  linearLight,
  mateSet,
  metegol,
  monitor,
  monstera,
  mouse,
  mug,
  notebook,
  officeChair,
  pendant,
  roundTable,
  rug,
  shelving,
  snakePlant,
  sofa,
  succulent,
  tallPlant,
} from "./hero-office-furniture";

/*
 * The home hero's walk through the office: a floor of a tower on 9 de Julio,
 * four rooms round a solid core, and the camera's round of them.
 *
 * The rooms share a shape — long, walked up the middle, left through a wide
 * doorway at the far end into the next — and nothing else. Development: rows
 * of desks, their screens and the agents' monitors across from them, the
 * logo in cut letters on a slatted wall. The server room: a contained cold
 * aisle between two rows of racks, the busier on the right, the trays of
 * cable overhead and the office's name at the end. The lounge: sofas under the isotipo, the kitchen,
 * a metegol, and a corner of glass with a bar along it, over the avenue to
 * the Obelisco. The meeting room: the Academia's classroom behind glass on
 * one side, the architecture and the cost on the other, and the table at the
 * end. Three of them carry one of Novit's lines on the far wall.
 *
 * The camera walks at an easy pace, a little slower round the corners, and
 * only glances: the head turns a little towards what a room holds — as the
 * room opens up, before its doorway — and comes back, and the corners are
 * eased into well before they come. No people.
 *
 * It is support for the headline beside it, not a scene of its own: drawn as
 * lines, the board's material, a step back in strength, with the words and
 * charts as one painted texture (`hero-office-atlas.ts`) set back further
 * still, and the city (`hero-office-city.ts`) further again. Solid walls are
 * also written as depth-only surfaces, so they hide what is behind them
 * without painting anything — the band's gradient shows through everywhere.
 *
 * Plans are in map coordinates — X east, Z north, y up, metres — with
 * "right" as a person means it.
 */

/* ----------------------------------------------------------------------------
 * The building
 * ------------------------------------------------------------------------- */

const CEILING = 3.2;

/**
 * Four long rooms round a solid core, each opening onto the next through a
 * wide doorway at its far end. They share their shape — laid out once, in
 * the first room's own place on the plan, the west room, 8 m wide from z 8
 * to 24, walked northwards up its middle, and turned a quarter clockwise
 * round the building's middle for each room further round — and nothing
 * else.
 */
const CENTRE: V2 = [12, 12];
const WIDTH = 8;
/** The first room, on the plan. */
const ROOM = { x0: 0, x1: 8, z0: 8, z1: 24 };
/** The doorway into the next room, in the right wall: from, to, and head. */
const DOORWAY = { from: 18, to: 22, head: 2.6 };

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
  const p: Place = (x, y, z) => {
    const [px, pz] = at(x, z);
    return [px, y, pz];
  };
  return {
    at,
    p,
    dir: turn,
    /** A surface on the wall through (x, z), facing (nx, nz), in this room. */
    surface: (x: number, z: number, nx: number, nz: number, lift?: number) => surface(at(x, z), turn(nx, nz), lift),
    /** A piece stood at (x, z) in this room, facing `angle`. */
    piece: (x: number, z: number, angle = 0) => piece(p, x, z, angle),
  };
}
type Frame = ReturnType<typeof frameOf>;

type Opening = { from: number; to: number; top: number };
/** A window in a wall: along it from `from` to `to`, `sill` to `head` high,
 *  with its mullions; `blinds` is how far down its blinds come. */
type Glazing = { from: number; to: number; sill: number; head: number; mullions?: number; blinds?: number };

/**
 * A wall on the plan from `a` to `b`: foot, head, ends and skirting, the
 * frame of each doorway and window — mullions, sill, blinds — and, unless
 * it is glass, the surface that hides what is behind it, cut round them.
 * `inward` is the way into the room.
 */
function wall(a: V2, b: V2, inward: V2, { openings = [] as Opening[], windows = [] as Glazing[], solid: isSolid = true } = {}) {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const along = (d: number, y: number, into = 0): V3 => [a[0] + ((b[0] - a[0]) * d) / length + inward[0] * into, y, a[1] + ((b[1] - a[1]) * d) / length + inward[1] * into];
  line(along(0, 0), along(length, 0), INK.structure);
  line(along(0, CEILING), along(length, CEILING), INK.structure);
  line(along(0, 0), along(0, CEILING), INK.structure);
  line(along(length, 0), along(length, CEILING), INK.structure);
  for (const { from, to, top } of openings) {
    polyline([along(from, 0), along(from, top), along(to, top), along(to, 0)], INK.frame);
    polyline([along(from - 0.06, 0), along(from - 0.06, top + 0.06), along(to + 0.06, top + 0.06), along(to + 0.06, 0)], INK.detail);
  }
  for (const { from, to, sill, head, mullions = 1, blinds } of windows) {
    polyline([along(from, sill), along(to, sill), along(to, head), along(from, head)], INK.frame, true);
    polyline([along(from + 0.05, sill + 0.05), along(to - 0.05, sill + 0.05), along(to - 0.05, head - 0.05), along(from + 0.05, head - 0.05)], INK.glass, true);
    for (let i = 1; i < mullions; i++) {
      const d = from + ((to - from) * i) / mullions;
      line(along(d, sill), along(d, head), INK.frame);
    }
    if (sill > 0.1) {
      line(along(from - 0.05, sill - 0.02, 0.18), along(to + 0.05, sill - 0.02, 0.18), INK.furniture);
      line(along(from - 0.05, sill - 0.02, 0.02), along(from - 0.05, sill - 0.02, 0.18), INK.detail);
      line(along(to + 0.05, sill - 0.02, 0.02), along(to + 0.05, sill - 0.02, 0.18), INK.detail);
    }
    if (blinds !== undefined) {
      // Slats, each hiding its strip of the view, and the bottom rail.
      for (let y = head - 0.1; y > blinds; y -= 0.075) {
        line(along(from + 0.04, y, 0.08), along(to - 0.04, y, 0.08), INK.faint);
        quad(along(from + 0.04, y - 0.032, 0.08), along(to - 0.04, y - 0.032, 0.08), along(to - 0.04, y, 0.08), along(from + 0.04, y, 0.08));
      }
      line(along(from + 0.04, blinds, 0.08), along(to - 0.04, blinds, 0.08), INK.detail);
      polyline([along(from + 0.04, head - 0.02, 0.1), along(to - 0.04, head - 0.02, 0.1)], INK.detail);
      line(along(from + (to - from) * 0.25, head - 0.1, 0.08), along(from + (to - from) * 0.25, blinds, 0.08), INK.faint);
    }
  }
  if (!isSolid) return;
  line(along(0, 0.09, 0.012), along(length, 0.09, 0.012), INK.faint);
  const holes = [...openings.map((o) => ({ from: o.from, to: o.to, bottom: 0, top: o.top })), ...windows.map((w) => ({ from: w.from, to: w.to, bottom: w.sill, top: w.head }))].sort((p, q) => p.from - q.from);
  let at = 0;
  for (const { from, to, bottom, top } of holes) {
    if (from > at) quad(along(at, 0), along(from, 0), along(from, CEILING), along(at, CEILING));
    if (bottom > 0) quad(along(from, 0), along(to, 0), along(to, bottom), along(from, bottom));
    quad(along(from, top), along(to, top), along(to, CEILING), along(from, CEILING));
    at = to;
  }
  if (at < length) quad(along(at, 0), along(length, 0), along(length, CEILING), along(at, CEILING));
}

/** A column stood against a wall, or free: its edges and its body. */
function column(F: Frame, x0: number, x1: number, z0: number, z1: number) {
  box(F.p, x0, x1, 0, CEILING, z0, z1, INK.structure, true);
}

/** How a room meets the outside: its left wall and its far wall. */
type Facade = { left: Glazing[]; front: Glazing[] };

/** What every room has: its walls, the doorway to the next one with the head
 *  over it, and its floor and ceiling as depth, so the street below and the
 *  towers above are only ever seen through a window. */
function shell(F: Frame, facade: Facade) {
  const { x0, x1, z0, z1 } = ROOM;
  const toLocal = (a: number, b: number) => F.dir(a, b);
  wall(F.at(x0, z0), F.at(x0, z1), toLocal(1, 0), { windows: facade.left });
  wall(F.at(x0, z1), F.at(x1, z1), toLocal(0, -1), { windows: facade.front });
  wall(F.at(x1, z1), F.at(x1, DOORWAY.to), toLocal(-1, 0));
  wall(F.at(x1, DOORWAY.from), F.at(x1, z0), toLocal(-1, 0));
  polyline([F.p(x1, 0, DOORWAY.to), F.p(x1, DOORWAY.head, DOORWAY.to), F.p(x1, DOORWAY.head, DOORWAY.from), F.p(x1, 0, DOORWAY.from)], INK.frame);
  line(F.p(x1, CEILING, DOORWAY.to), F.p(x1, CEILING, DOORWAY.from), INK.structure);
  quad(F.p(x1, DOORWAY.head, DOORWAY.to), F.p(x1, DOORWAY.head, DOORWAY.from), F.p(x1, CEILING, DOORWAY.from), F.p(x1, CEILING, DOORWAY.to));
  quad(F.p(x0, 0, z0), F.p(x1, 0, z0), F.p(x1, 0, z1), F.p(x0, 0, z1));
  quad(F.p(x0, CEILING, z0), F.p(x1, CEILING, z0), F.p(x1, CEILING, z1), F.p(x0, CEILING, z1));
}

/** A line on the far wall, centred, `v` its foot. */
function slogan(F: Frame, room: string, v: number, width = 5.4) {
  const ahead = F.surface(ROOM.x0, ROOM.z1, 0, -1);
  panelOn(ahead, `slogan-${room}`, WIDTH / 2 - width / 2, v, WIDTH / 2 + width / 2, v + width * (120 / 1600));
}

/** The services under an open ceiling: a round duct along the room, its
 *  joints and hangers. */
function duct(F: Frame, x: number, z0: number, z1: number, y: number, radius: number) {
  for (const a of [0.35, Math.PI / 2, Math.PI - 0.35]) {
    line(F.p(x + Math.cos(a) * radius, y - Math.sin(a) * radius + radius * 0.2, z0), F.p(x + Math.cos(a) * radius, y - Math.sin(a) * radius + radius * 0.2, z1), a === Math.PI / 2 ? INK.detail : INK.faint);
  }
  for (let z = z0; z <= z1 + 0.01; z += 1.5) {
    curve((t) => {
      const a = Math.PI * t;
      return F.p(x + Math.cos(a) * radius, y - Math.sin(a) * radius + radius * 0.2, z);
    }, 8, INK.faint);
    line(F.p(x, y + radius * 0.2, z), F.p(x, CEILING, z), INK.faint);
  }
}

/** Sprinkler heads and smoke detectors across a ceiling. */
function ceilingFixtures(F: Frame, x0: number, x1: number, z0: number, z1: number) {
  for (let x = x0; x <= x1 + 0.01; x += 2.4) {
    for (let z = z0; z <= z1 + 0.01; z += 3) {
      line(F.p(x, CEILING, z), F.p(x, CEILING - 0.02, z), INK.faint);
      polyline(ring(F.p, x, CEILING - 0.03, z, 0.04, 6), INK.faint, true);
    }
  }
}

/* ----------------------------------------------------------------------------
 * The rooms
 * ------------------------------------------------------------------------- */

type Look = { at: number; width: number; slow: number; look: V3; turn: number };

/** The Obelisco in the lounge's own plan — the lounge is the first room
 *  turned half round the middle — at half its height. */
const OBELISCO_FROM_LOUNGE: V3 = [2 * CENTRE[0] - OBELISCO[0], -2, 2 * CENTRE[1] - OBELISCO[1]];

/**
 * The four rooms, going round. Each has what the camera glances at — a spot
 * in the room, how far into it, and only part of the way: the head turns a
 * little and comes back, never swings — how it meets the outside, and what
 * it holds. `at(s)` is when the camera gets `s` metres into that room, for
 * the screens to draw in on.
 */
const ROOMS: { looks: Look[]; facade: Facade; build: (F: Frame, at: (s: number) => number) => void }[] = [
  {
    // Development: the agents' monitors, then the logo.
    looks: [
      { at: 1.0, width: 2.4, slow: 0.72, look: [8, 1.55, 16.2], turn: 0.4 },
      { at: 4.8, width: 2.2, slow: 0.72, look: [0, 1.9, 20.3], turn: 0.38 },
    ],
    facade: { left: [], front: [] },
    build: (F, at) => development(F, at),
  },
  {
    // The server room: a look along the racks.
    looks: [{ at: 3.4, width: 2.8, slow: 0.8, look: [2.7, 1.3, 15.8], turn: 0.14 }],
    facade: { left: [], front: [] },
    build: (F, at) => serverRoom(F, at),
  },
  {
    // The lounge: the kitchen and the chart, then out to the Obelisco.
    looks: [
      { at: 1.2, width: 2.4, slow: 0.74, look: [8, 1.6, 16.6], turn: 0.38 },
      { at: 5.5, width: 2.5, slow: 0.58, look: OBELISCO_FROM_LOUNGE, turn: 0.34 },
    ],
    facade: {
      left: [{ from: 8.4, to: 16, sill: 0.02, head: 2.95, mullions: 5 }],
      // Higher at the ends, where the Obelisco is seen, lower in the middle,
      // under the bulkhead the line is set on.
      front: [
        { from: 0, to: 1.6, sill: 0.02, head: 2.95 },
        { from: 1.6, to: 6.4, sill: 0.02, head: 2.72, mullions: 3 },
        { from: 6.4, to: 8, sill: 0.02, head: 2.95 },
      ],
    },
    build: (F, at) => lounge(F, at),
  },
  {
    // The meeting room: the architecture on its board; the classroom is in
    // view without turning.
    looks: [{ at: 1.0, width: 2.4, slow: 0.72, look: [8, 1.7, 16.0], turn: 0.4 }],
    facade: {
      left: [0, 1, 2, 3].map((i) => ({ from: 0.4 + i * 4, to: 3.6 + i * 4, sill: 0.85, head: 2.72, mullions: 2, blinds: 1.95 + (i % 2) * 0.3 })),
      front: [],
    },
    build: (F, at) => meetingRoom(F, at),
  },
];

/* Development. ------------------------------------------------------------ */

function development(F: Frame, at: (s: number) => number) {
  // The ceiling left open: two ducts down the room, sprinklers, and a long
  // light over each row of desks.
  duct(F, 2.0, 8.3, 23.7, 2.92, 0.22);
  duct(F, 6.2, 8.3, 23.7, 2.92, 0.22);
  ceilingFixtures(F, 1.2, 6.0, 9.5, 21.5);

  // The carpet the desks stand on.
  const carpet = { x0: 0.3, x1: 3.7, z0: 9.6, z1: 19.4 };
  polyline([F.p(carpet.x0, 0.004, carpet.z0), F.p(carpet.x1, 0.004, carpet.z0), F.p(carpet.x1, 0.004, carpet.z1), F.p(carpet.x0, 0.004, carpet.z1)], INK.detail, true);
  for (let x = carpet.x0 + 0.6; x < carpet.x1; x += 0.6) line(F.p(x, 0.004, carpet.z0), F.p(x, 0.004, carpet.z1), INK.faint);
  for (let z = carpet.z0 + 0.6; z < carpet.z1; z += 0.6) line(F.p(carpet.x0, 0.004, z), F.p(carpet.x1, 0.004, z), INK.faint);

  // Three rows of desks across the room, everyone facing up it: two places
  // a row, each with its screens, and what people leave on a desk.
  const screens = ["monitor-1", "laptop-0", "laptop-1", "monitor-2", "laptop-2", "laptop-3"];
  [11.3, 14.5, 17.7].forEach((z, row) => {
    const d = F.piece(1.95, z);
    desk(d, 3.0, 0.8);
    linearLight(F.piece(1.95, z - 0.1, Math.PI / 2), 0, -1.2, 1.2, 2.45, CEILING);
    // A screen between the two places, and the power pole to the ceiling.
    box(d, -0.012, 0.012, 0.74, 1.12, -0.05, 0.4, INK.detail);
    line(d(1.42, 0.74, 0.34), d(1.42, CEILING, 0.34), INK.faint);
    for (const side of [-1, 1]) {
      const u = side * 0.74;
      const seed = row * 2 + (side + 1) / 2;
      const start = at(row * 1.6 + 0.8) + (side + 1) * 0.3;
      if (seed % 2 === 0) {
        monitor(d, u, 0.22, 0.62, 0.74, screens[seed], [2, start, 1.8, 6]);
        keyboard(d, u, -0.1, 0.74);
        mouse(d, u + 0.34, -0.1, 0.74);
      } else {
        laptop(d, u - 0.1, -0.02, 0.74, screens[seed], [2, start, 1.8, 5]);
        mouse(d, u + 0.2, -0.05, 0.74);
      }
      agentPuck(d, u + side * 0.52, 0.22, 0.74, seed + 11);
      if (seed === 1) mateSet(d, u + 0.38, 0.14, 0.74);
      if (seed === 2 || seed === 5) mug(d, u - 0.42, -0.05, 0.74);
      if (seed === 0 || seed === 3) deskLamp(d, u - side * 0.5, 0.26, 0.74);
      if (seed === 4) headphones(d, u - 0.4, 0.05, 0.74);
      if (seed === 3) notebook(d, u + 0.44, -0.08, 0.74);
      if (seed === 5) succulent(d, u + 0.44, 0.24, 0.74);
      officeChair(F.piece(1.95 + u + (hash(seed + 3) - 0.5) * 0.12, z - 0.72, (hash(seed + 7) - 0.5) * 0.5));
    }
  });

  // The left wall: slats of wood behind the logo, in cut letters.
  const left = F.surface(ROOM.x0, ROOM.z0, 1, 0);
  const slats = lifted(left, 0.02);
  const s0 = 16.9 - ROOM.z0;
  const s1 = 21.95 - ROOM.z0;
  for (let u = s0; u <= s1 + 0.001; u += 0.11) line(slats.at(u, 0.12), slats.at(u, CEILING - 0.12), INK.faint);
  line(slats.at(s0, 0.12), slats.at(s1, 0.12), INK.detail);
  line(slats.at(s0, CEILING - 0.12), slats.at(s1, CEILING - 0.12), INK.detail);
  const height = 0.58;
  logoOn(lifted(left, 0.03), 20.3 - ROOM.z0 - (height * 4.529) / 2, 1.6, height, { depth: 0.04 });
  // Nearer the door, a framed print and the clock.
  framed(left, 10.2 - ROOM.z0, 1.25, 11.5 - ROOM.z0, 2.55, "attention");
  clock(left, 13.6 - ROOM.z0, 2.3, 0.2);

  // Across the room: the agents at work on the wall over their console, two
  // chairs at it; before them a high table, and the sprint's board on its
  // stand, turned to whoever comes in.
  const right = F.surface(ROOM.x1, ROOM.z1, -1, 0);
  const u = (z: number) => ROOM.z1 - z;
  box(F.p, 7.3, 7.95, 0.72, 0.76, 14.4, 17.9, INK.furniture, true);
  for (const z of [14.5, 17.8]) line(F.p(7.35, 0, z), F.p(7.35, 0.72, z), INK.detail);
  agentPuck(F.piece(7.6, 15.0), 0, 0, 0.76, 31);
  keyboard(F.piece(7.55, 16.3, Math.PI / 2), 0, 0, 0.76);
  mug(F.p, 7.62, 17.3, 0.76);
  monitorsOn(right, u(17.75), u(14.55), 1.28, at(-0.8));
  officeChair(F.piece(6.85, 15.5, Math.PI / 2 + 0.25));
  officeChair(F.piece(6.9, 16.95, Math.PI / 2 - 0.2));
  highTable(F.piece(5.85, 13.9));
  kanbanStand(F.piece(6.0, 11.9, -2.73), [1, at(-0.6), 2.4, 8]);

  // The far wall: the line, a low cabinet of books under it, a glass booth
  // for calls in one corner, a plant and the team's productivity in the
  // other, past the doorway.
  slogan(F, "dev", 1.95);
  const cabinet = F.piece(4.35, ROOM.z1 - 0.44, Math.PI);
  shelving(cabinet, -2.0, 2.0, 0.82, 0.42, 2, 21, { bays: 4, fill: 0.9, top: false });
  succulent(cabinet, -1.4, -0.2, 0.82);
  mug(cabinet, 1.2, -0.2, 0.82);
  booth(F, 0.35, 2.0, 22.15, 23.9);
  tallPlant(F.p, 7.45, 23.45, 1);
  tv(right, "dev-tv", u(23.85), u(22.2), [1, at(STRAIGHT + 1.0), 2.6, 8], 252 / 448, 2.4);
  ficus(F.p, 0.6, 8.9, { seed: 8 });
  snakePlant(F.p, 7.45, 9.0);
}

/** The sprint's board on its stand: the board, its frame and marker tray,
 *  the legs on their castors. It faces +w. */
function kanbanStand(c: Place, reveal: Reveal) {
  const hu = 0.8;
  const y0 = 0.85;
  const y1 = 1.85;
  polyline([c(-hu, y0, 0), c(hu, y0, 0), c(hu, y1, 0), c(-hu, y1, 0)], INK.frame, true);
  quad(c(-hu, y0, 0), c(hu, y0, 0), c(hu, y1, 0), c(-hu, y1, 0));
  line(c(-hu + 0.1, y0 - 0.03, 0.05), c(hu - 0.1, y0 - 0.03, 0.05), INK.furniture);
  for (const u of [-hu - 0.04, hu + 0.04]) {
    line(c(u, 0.08, 0), c(u, y1 + 0.05, 0), INK.detail);
    line(c(u, 0.08, -0.3), c(u, 0.08, 0.3), INK.detail);
    for (const w of [-0.3, 0.3]) line(c(u, 0.08, w), c(u, 0.01, w), INK.detail);
  }
  // Facing +w, the viewer's right is -u.
  panel("kanban", [c(hu - 0.03, y1 - 0.03, 0.012), c(-hu + 0.03, y1 - 0.03, 0.012), c(-hu + 0.03, y0 + 0.03, 0.012), c(hu - 0.03, y0 + 0.03, 0.012)], reveal);
}

/** A high round table on its pedestal, two stools at it. */
function highTable(c: Place) {
  polyline(ring(c, 0, 1.05, 0, 0.4, 18), INK.furniture, true);
  polyline(ring(c, 0, 1.02, 0, 0.4, 18), INK.detail, true);
  line(c(0, 0.02, 0), c(0, 1.02, 0), INK.detail);
  polyline(ring(c, 0, 0.02, 0, 0.26, 12), INK.detail, true);
  const face = ring(c, 0, 1.05, 0, 0.4, 12);
  for (let i = 1; i < 11; i++) quad(face[0], face[i], face[i + 1], face[i + 1]);
  barStool(piece(c, -0.62, 0.1, 0.4), 0.74);
  barStool(piece(c, 0.5, -0.45, -0.6), 0.74);
  laptop(piece(c, 0, 0, 0.9), 0, 0.05, 1.05);
}

/** A glass booth for a call: its frame and door, a stool and a shelf, a
 *  light. */
function booth(F: Frame, x0: number, x1: number, z0: number, z1: number) {
  const top = 2.3;
  box(F.p, x0, x1, 0, top, z0, z1, INK.glass);
  box(F.p, x0, x1, top, top + 0.08, z0, z1, INK.furniture);
  polyline([F.p(x0 + 0.15, 0, z0), F.p(x0 + 0.15, 2.1, z0), F.p(x1 - 0.55, 2.1, z0), F.p(x1 - 0.55, 0, z0)], INK.frame);
  line(F.p(x1 - 0.65, 0.95, z0 - 0.02), F.p(x1 - 0.65, 1.2, z0 - 0.02), INK.frame);
  box(F.p, x0 + 0.1, x1 - 0.1, 0.98, 1.02, z1 - 0.38, z1 - 0.05, INK.furniture);
  cylinder(F.p, (x0 + x1) / 2, (z0 + z1) / 2 + 0.1, 0.17, 0, 0.62, INK.detail, { sides: 12, edges: 4 });
  polyline(ring(F.p, (x0 + x1) / 2, top - 0.02, (z0 + z1) / 2, 0.18, 12), INK.detail, true);
  // A frosted band round it at the height of a face.
  for (const y of [1.3, 1.6]) polyline([F.p(x0, y, z0), F.p(x1, y, z0), F.p(x1, y, z1), F.p(x0, y, z1)], INK.faint, true);
}

/** A board on a wall, framed, with its marker tray. */
function framedBoard(s: Surface, u0: number, v0: number, u1: number, v1: number, region: string, reveal: Reveal) {
  rectOn(s, u0 - 0.05, v0 - 0.05, u1 + 0.05, v1 + 0.05, INK.frame);
  const tray = lifted(s, 0.05);
  line(tray.at(u0 + 0.1, v0 - 0.08), tray.at(u1 - 0.1, v0 - 0.08), INK.furniture);
  panelOn(s, region, u0, v0, u1, v1, reveal);
}

/** Three monitors on a wall over a console: the agents at work. */
function monitorsOn(s: Surface, u0: number, u1: number, v: number, start: number) {
  const each = (u1 - u0 - 0.12) / 3;
  const tall = each * (252 / 448);
  [0, 1, 2].forEach((i) => {
    const a = u0 + i * (each + 0.06);
    rectOn(s, a - 0.03, v - 0.03, a + each + 0.03, v + tall + 0.03, INK.frame);
    rectOn(lifted(s, 0.03), a - 0.03, v - 0.03, a + each + 0.03, v + tall + 0.03, INK.detail);
    panelOn(lifted(s, 0.035), `monitor-${i}`, a, v, a + each, v + tall, [2, start + i * 0.4, 2, 6]);
  });
}

/** A television on a wall, its bezel, and what it shows. */
function tv(s: Surface, region: string, u0: number, u1: number, reveal: Reveal, aspect = 252 / 448, top = 2.3) {
  const tall = (u1 - u0) * aspect;
  const v0 = top - tall;
  rectOn(s, u0 - 0.04, v0 - 0.04, u1 + 0.04, top + 0.04, INK.frame);
  rectOn(s, u0 - 0.015, v0 - 0.015, u1 + 0.015, top + 0.015, INK.detail);
  panelOn(s, region, u0, v0, u1, top, reveal);
}

/* The server room. -------------------------------------------------------- */

function serverRoom(F: Frame, at: (s: number) => number) {
  // The raised floor, tiled, and the perforated tiles down the cold aisle.
  for (let x = 0.2; x <= 7.81; x += 0.6) line(F.p(x, 0.005, 8.6), F.p(x, 0.005, 23.8), ink(WHITE, 0.07));
  for (let z = 8.6; z <= 23.81; z += 0.6) line(F.p(0.2, 0.005, z), F.p(7.8, 0.005, z), ink(WHITE, 0.07));
  for (let z = 9.8; z < 16.6; z += 1.2) {
    for (const x of [3.2, 4.4]) {
      for (let k = 1; k < 5; k++) line(F.p(x + 0.1, 0.006, z + k * 0.12), F.p(x + 0.5, 0.006, z + k * 0.12), INK.faint);
    }
  }

  // Glass across the way in, its doors slid back, the isotipo on one.
  const glassZ = 8.7;
  for (const [a, b] of [[0.2, 2.6], [5.4, 7.8]]) {
    polyline([F.p(a, 0, glassZ), F.p(a, 2.7, glassZ), F.p(b, 2.7, glassZ), F.p(b, 0, glassZ)], INK.frame, true);
    line(F.p((a + b) / 2, 0, glassZ), F.p((a + b) / 2, 2.7, glassZ), INK.glass);
  }
  line(F.p(0.2, 2.7, glassZ), F.p(7.8, 2.7, glassZ), INK.frame);
  line(F.p(0.2, CEILING, glassZ), F.p(7.8, CEILING, glassZ), INK.detail);
  const door = F.surface(5.4, glassZ, 0, -1, 0.01);
  logoOn(door, 0.9 - 0.36, 1.3, 0.3, { word: false, faint: true });

  // The racks: a long row on the left, a busier one facing it.
  rackRow(F, 1.6, 2.7, 9.6, 22, 2.7, "general");
  rackRow(F, 5.3, 6.4, 9.6, 12, 5.3, "busy");

  // The cold aisle between them, contained: a glass roof on its frame, and
  // doors at the far end, open, the office's name over them.
  const roof = 2.25;
  const z0 = 9.6;
  const z1 = 9.6 + 12 * 0.6;
  for (const x of [2.7, 5.3]) line(F.p(x, roof, z0), F.p(x, roof, z1), INK.frame);
  for (let z = z0; z <= z1 + 0.01; z += 1.2) line(F.p(2.7, roof, z), F.p(5.3, roof, z), INK.glass);
  polyline([F.p(2.7, roof, z1), F.p(2.7, 0, z1)], INK.detail);
  polyline([F.p(2.7, 1.95, z1), F.p(3.3, 1.95, z1), F.p(3.3, 0, z1)], INK.glass);
  polyline([F.p(5.3, 1.95, z1), F.p(4.7, 1.95, z1), F.p(4.7, 0, z1)], INK.glass);
  const sign = F.surface(4.0, z1 - 0.02, 0, -1);
  const signWide = 1.6;
  rectOn(sign, -signWide / 2 - 0.05, 1.98, signWide / 2 + 0.05, 2.24, INK.frame);
  panelOn(sign, "office-sign", -signWide / 2, 2.005, signWide / 2, 2.005 + signWide * (112 / 832), [1, at(1.2), 2, 1]);

  // Over the racks, the cable trays, their runs of light, and cables down
  // into each rack; the lights along the aisle.
  for (const [x, a, b] of [[2.15, 9.2, 23.6], [5.85, 9.2, 17.2]] as const) {
    for (const dx of [-0.25, 0.25]) line(F.p(x + dx, 2.62, a), F.p(x + dx, 2.62, b), INK.detail);
    for (let z = a; z <= b; z += 0.5) line(F.p(x - 0.25, 2.62, z), F.p(x + 0.25, 2.62, z), INK.faint);
    line(F.p(x, 2.62, a), F.p(x, 2.62, b), ink(CELESTE, 0.62), [1, 0, b - a, 1.8]);
    for (let z = a + 0.3; z < b - 0.3; z += 2.4) line(F.p(x, 2.62, z), F.p(x, CEILING, z), INK.faint);
  }
  line(F.p(1.2, 2.82, 9.2), F.p(1.2, 2.82, 23.6), ink(CELESTE, 0.5), [1, 0, 14.4, 1.2]);
  for (const x of [3.4, 4.6]) line(F.p(x, CEILING - 0.01, 9.2), F.p(x, CEILING - 0.01, 23.4), INK.detail);
  ceilingFixtures(F, 1.0, 7.0, 9.6, 22.6);

  // At the far end, the cooling, and what is deployed on the wall.
  crac(F.piece(6.2, ROOM.z1 - 0.85, Math.PI), 1.6);
  crac(F.piece(ROOM.x1 - 0.85, 23.0, -Math.PI / 2), 1.6);
  const ahead = F.surface(ROOM.x0, ROOM.z1, 0, -1);
  tv(ahead, "status", 2.7, 4.9, [2, at(1.5), 2.2, 5], 252 / 448, 2.45);
  const noc = F.piece(3.8, 23.0);
  desk(noc, 1.6, 0.6);
  monitor(noc, -0.35, 0.12, 0.48, 0.74);
  monitor(noc, 0.35, 0.12, 0.48, 0.74);
  keyboard(noc, 0, -0.1, 0.74);
}

/** A row of racks from `z0`, `count` of them, their fronts on `face`. */
function rackRow(F: Frame, x0: number, x1: number, z0: number, count: number, face: number, kind: "general" | "busy") {
  const out = face === x1 ? 1 : -1;
  for (let i = 0; i < count; i++) {
    const a = z0 + i * 0.6;
    const b = a + 0.6;
    box(F.p, x0, x1, 0, 2.15, a + 0.01, b - 0.01, INK.furniture, true);
    const f = face + out * 0.012;
    // The door's frame, and the servers behind its mesh.
    polyline([F.p(f, 0.1, a + 0.05), F.p(f, 2.05, a + 0.05), F.p(f, 2.05, b - 0.05), F.p(f, 0.1, b - 0.05)], INK.detail, true);
    line(F.p(f, 0.9, b - 0.09), F.p(f, 1.25, b - 0.09), INK.furniture);
    const unit = kind === "busy" ? 0.18 : 0.09;
    const seed = i * 17 + (kind === "busy" ? 500 : 0);
    for (let y = 0.2; y < 1.95; y += unit) {
      if (hash(seed + Math.round(y * 100)) < 0.18) continue;
      line(F.p(f, y, a + 0.08), F.p(f, y, b - 0.12), INK.faint);
    }
    // Its lights, blinking on their own clocks: the busy row's the more.
    const lights = kind === "busy" ? 7 : 4;
    for (let n = 0; n < lights; n++) {
      const s = seed + n * 7;
      const y = 0.26 + ((n + 0.5) / lights) * 1.66 + (hash(s + 3) - 0.5) * 0.08;
      const rate = kind === "busy" ? 0.9 + hash(s + 5) * 1.6 : 0.3 + hash(s + 5) * 0.7;
      point(F.p(f + out * 0.004, y, a + 0.12 + hash(s) * 0.3), INK.accent, 3, [1, rate, hash(s + 9), 0.35 + hash(s + 11) * 0.45]);
    }
    // Its label at the top, and the cables that drop into it from the tray.
    line(F.p(f, 2.1, a + 0.15), F.p(f, 2.1, b - 0.15), INK.detail);
    const tray = (x0 + x1) / 2;
    const back = out > 0 ? x0 + 0.25 : x1 - 0.25;
    curve((t) => F.p(tray + (back - tray) * t, 2.62 - 0.47 * t - 0.07 * Math.sin(Math.PI * t), a + 0.3), 5, INK.faint);
  }
}

/** A cooling unit, `width` wide, its front to +w: the grille and its
 *  display. */
function crac(c: Place, width: number) {
  const hu = width / 2;
  box(c, -hu, hu, 0, 2.05, -0.85, 0, INK.furniture, true);
  for (let y = 0.25; y < 1.5; y += 0.09) line(c(-hu + 0.1, y, 0.004), c(hu - 0.1, y, 0.004), INK.faint);
  polyline([c(-hu + 0.12, 1.65, 0.004), c(-hu + 0.42, 1.65, 0.004), c(-hu + 0.42, 1.85, 0.004), c(-hu + 0.12, 1.85, 0.004)], INK.detail, true);
  point(c(hu - 0.2, 1.78, 0.01), INK.accent, 2.5, [1, 0.2, 0.3, 0.8]);
}

/* The lounge. ------------------------------------------------------------- */

function lounge(F: Frame, at: (s: number) => number) {
  // The corner of glass: its head under a bulkhead the line is set on. The
  // corner is left with no column, so the view round it is never cut.
  slogan(F, "lounge", 2.76, 4.6);
  column(F, 0, 0.5, 16, 16.5);
  // A wooden floor, its boards running down the room.
  for (let x = 0.3; x < WIDTH; x += 0.3) line(F.p(x, 0.003, ROOM.z0), F.p(x, 0.003, ROOM.z1), INK.faint);

  // By the door, a tall bookcase. Then the sofa under the isotipo, its rug,
  // low table and an armchair, a lamp reaching over; felt baffles hung
  // above them, and a pendant.
  shelving(F.piece(0.42, 10.1, Math.PI / 2), -1.3, 1.3, 2.1, 0.4, 5, 31, { bays: 2 });
  const left = F.surface(ROOM.x0, ROOM.z0, 1, 0);
  const height = 0.82;
  logoOn(left, 13.6 - ROOM.z0 - (height * 1.19) / 2, 1.3, height, { word: false, faint: true });
  rug(F.p, 0.9, 3.4, 11.9, 15.3);
  sofa(F.piece(0.78, 13.6, Math.PI / 2), 3.0, { seats: 3 });
  const table = F.piece(2.0, 13.6);
  roundTable(table, 0.45);
  succulent(table, 0.12, 0.05, 0.4);
  notebook(table, -0.18, -0.1, 0.4, 0.6);
  mug(table, 0.2, -0.22, 0.4);
  armchair(F.piece(2.95, 12.4, -Math.PI / 2 - 0.35));
  arcLamp(F.piece(0.6, 11.7, 0.64));
  for (let z = 11.7; z <= 15.3; z += 0.6) {
    polyline([F.p(0.5, 2.62, z), F.p(3.4, 2.62, z), F.p(3.4, 3.02, z), F.p(0.5, 3.02, z)], INK.faint, true);
    for (const x of [0.8, 3.1]) line(F.p(x, 3.02, z), F.p(x, CEILING, z), INK.faint);
  }
  pendant(F.p, 2.0, 13.6, 2.05, CEILING, 0.26);

  // By the glass, low seats round a low table on a rug: nothing up to the
  // height of the view.
  rug(F.p, 0.7, 3.5, 17.3, 21.3);
  for (const [x, z, r] of [[1.25, 18.3, 0.3], [2.75, 18.1, 0.28], [1.6, 20.3, 0.3], [3.0, 20.0, 0.26]]) pouf(F.piece(x, z), r);
  const low = F.piece(2.1, 19.2);
  roundTable(low, 0.36, 0.34);
  succulent(low, 0, 0, 0.34);
  monstera(F.p, 0.75, 16.95, { seed: 3, leaves: 8 });
  // Over them, a raft of wooden slats hung from the ceiling, above the view.
  for (let x = 0.7; x <= 3.5 + 0.001; x += 0.14) line(F.p(x, 2.86, 17.3), F.p(x, 2.86, 21.3), INK.faint);
  polyline([F.p(0.7, 2.86, 17.3), F.p(3.5, 2.86, 17.3), F.p(3.5, 2.86, 21.3), F.p(0.7, 2.86, 21.3)], INK.detail, true);
  for (const [x, z] of [[0.8, 17.4], [3.4, 17.4], [0.8, 21.2], [3.4, 21.2]]) line(F.p(x, 2.86, z), F.p(x, CEILING, z), INK.faint);
  monstera(F.p, 6.5, 21.7, { seed: 13, leaves: 9 });

  // Along the other wall: the fridge, the kitchen, the chart on the
  // television; the metegol before them, a plant hung over it.
  fridge(F.piece(ROOM.x1 - 0.68, 11.95, -Math.PI / 2));
  kitchen(F.piece(ROOM.x1 - 0.62, 12.4, -Math.PI / 2), 3.2);
  const right = F.surface(ROOM.x1, ROOM.z1, -1, 0);
  const u = (z: number) => ROOM.z1 - z;
  tv(right, "lounge-tv", u(17.9), u(15.8), [1, at(-0.6), 2.6, 8], 252 / 448, 2.3);
  box(F.p, 7.55, 7.98, 0, 0.45, 15.7, 18.0, INK.furniture, true);
  metegol(F.piece(5.9, 11.2));
  hangingPlant(F.p, 6.9, 9.4, 2.25, CEILING, 7);
  tallPlant(F.p, 7.45, 8.9, 3);
  bushPlant(F.p, 5.2, 8.9);

  // Along the glass, a bar and its stools, facing out; a laptop and a mate
  // left on it. Globes over it, kept clear of the view.
  const bar = F.piece(3.6, ROOM.z1 - 0.52);
  box(bar, -2.9, 2.9, 1.02, 1.06, -0.24, 0.24, INK.furniture, true);
  for (const du of [-2.7, -0.9, 0.9, 2.7]) {
    line(bar(du, 0, 0), bar(du, 1.02, 0), INK.detail);
    line(bar(du - 0.2, 0.003, 0), bar(du + 0.2, 0.003, 0), INK.detail);
  }
  [-2.4, -1.2, 0, 1.2, 2.4].forEach((du, i) => barStool(F.piece(3.6 + du + (hash(i + 60) - 0.5) * 0.1, ROOM.z1 - 1.05 - hash(i + 61) * 0.12), 0.74));
  laptop(bar, 1.5, -0.02, 1.06, "laptop-3", [2, at(5.5), 1.8, 5]);
  mateSet(bar, -1.6, 0.02, 1.06);
  mug(bar, 2.4, 0.05, 1.06);
  for (const x of [4.6, 5.9]) globe(F.p, x, ROOM.z1 - 0.55, 2.2, CEILING);
  // Past the doorway, a print of the transformer, and a plant under it.
  framed(right, u(23.2), 1.2, u(22.25), 2.5, "transformer");
  snakePlant(F.p, 7.5, 23.55, { seed: 9 });
}

/** A pouf: a low round seat, its top rounded. */
function pouf(c: Place, radius: number) {
  cylinder(c, 0, 0, radius, 0, 0.36, INK.furniture, { sides: 14, edges: 4, occlude: true });
  polyline(ring(c, 0, 0.4, 0, radius * 0.82, 14), INK.detail, true);
}

/* The meeting room. ------------------------------------------------------- */

function meetingRoom(F: Frame, at: (s: number) => number) {
  // The columns between the windows.
  for (const z of [8, 12, 16, 20, 24]) column(F, 0, 0.36, Math.max(ROOM.z0, z - 0.2), Math.min(ROOM.z1, z + 0.2));

  // The Academia's classroom, behind glass on the left: rows of seats with
  // their writing arms, a lectern, the projector and its slide.
  const edge = 3.0;
  const end = 16;
  for (let z = 8.4; z <= end + 0.01; z += 1.52) line(F.p(edge, 0, z), F.p(edge, CEILING, z), INK.frame);
  line(F.p(edge, 0, 8), F.p(edge, 0, end), INK.frame);
  line(F.p(edge, 2.72, 8), F.p(edge, 2.72, end), INK.frame);
  for (const y of [1.02, 1.38]) line(F.p(edge + 0.01, y, 8.2), F.p(edge + 0.01, y, end), INK.glass);
  polyline([F.p(edge, 0, 9.2), F.p(edge, 2.2, 9.2), F.p(edge, 2.2, 10.2), F.p(edge, 0, 10.2)], INK.frame);
  line(F.p(edge + 0.04, 0.95, 10.05), F.p(edge + 0.04, 1.25, 10.05), INK.furniture);
  // Its name on a blade sign over the door, turned to whoever comes in.
  const blade = F.surface(edge, 9.7, 0, -1, 0.012);
  const bladeTop = 2.52;
  const bladeWide = 1.1;
  rectOn(blade, 0.04, bladeTop - 0.03 - bladeWide / 10 - 0.03, bladeWide + 0.1, bladeTop, INK.frame);
  panelOn(blade, "academia-glass", 0.07, bladeTop - 0.03 - bladeWide / 10, 0.07 + bladeWide, bladeTop - 0.03, [1, at(-1.6), 1.4, 1]);
  line(F.p(edge + 0.3, bladeTop, 9.7), F.p(edge + 0.3, 2.72, 9.7), INK.detail);
  line(F.p(edge + 0.9, bladeTop, 9.7), F.p(edge + 0.9, 2.72, 9.7), INK.detail);
  quad(blade.at(0.04, bladeTop - bladeWide / 10 - 0.06), blade.at(bladeWide + 0.1, bladeTop - bladeWide / 10 - 0.06), blade.at(bladeWide + 0.1, bladeTop), blade.at(0.04, bladeTop));
  // The wall at its front, the screen on it.
  wall(F.at(0.36, end), F.at(edge, end), F.dir(0, -1));
  const screen = F.surface(0.36, end, 0, -1);
  const sw = 2.2;
  const sh = sw * (432 / 768);
  rectOn(screen, 0.2, 0.95, 0.2 + sw, 0.95 + sh, INK.frame);
  panelOn(screen, "academia", 0.23, 0.98, 0.17 + sw, 0.92 + sh, [2, at(-0.4), 2.2, 6]);
  for (const z of [10.8, 12.2, 13.6]) {
    for (const x of [0.95, 2.15]) classChair(F.piece(x, z));
  }
  lectern(F.piece(2.5, 15.1, Math.PI + 0.4));
  succulent(F.piece(2.5, 15.1, Math.PI + 0.4), 0, 0.05, 1.12);
  box(F.p, 1.4, 1.75, 2.72, 2.84, 12.1, 12.45, INK.detail);
  line(F.p(1.57, 2.84, 12.27), F.p(1.57, CEILING, 12.27), INK.faint);
  for (let x = 0.36 + 0.6; x < edge; x += 0.6) line(F.p(x, 2.95, 8.1), F.p(x, 2.95, end), INK.faint);
  for (let z = 8.6; z < end; z += 0.6) line(F.p(0.36, 2.95, z), F.p(edge, 2.95, z), INK.faint);

  // Across the corridor: the architecture on the whiteboard, lights down
  // the corridor; past the doorway, the cost on a screen.
  const right = F.surface(ROOM.x1, ROOM.z1, -1, 0);
  const u = (z: number) => ROOM.z1 - z;
  framedBoard(right, u(17.6), 0.95, u(14.4), 0.95 + 3.2 * (384 / 768), "meeting-board", [1, at(-0.9), 3, 8]);
  tv(right, "meeting-screen", u(23.85), u(22.2), [1, at(STRAIGHT + 0.6), 2.4, 8], 384 / 768, 2.3);
  for (let z = 9; z < 16; z += 2.4) linearLight(F.piece(5.6, z), 0, -0.7, 0.7, 2.85, CEILING);
  // A credenza under the board, and what a meeting needs on it; a bench and
  // a coat stand by the door in.
  const credenza = F.piece(ROOM.x1 - 0.45, 16.0, -Math.PI / 2);
  box(credenza, -1.6, 1.6, 0.12, 0.72, -0.45, 0, INK.furniture, true);
  for (const du of [-0.8, 0, 0.8]) line(credenza(du, 0.16, 0.002), credenza(du, 0.68, 0.002), INK.detail);
  for (const [du, dw] of [[-1.5, -0.1], [1.5, -0.1], [-1.5, -0.35], [1.5, -0.35]]) line(credenza(du, 0, dw), credenza(du, 0.12, dw), INK.detail);
  cylinder(credenza, -1.1, -0.22, 0.06, 0.72, 1.02, INK.detail, { sides: 10, edges: 2, rimColor: INK.furniture });
  for (let i = 0; i < 4; i++) mug(credenza, -0.8 + i * 0.13, -0.2, 0.72);
  cylinder(credenza, 0.6, -0.22, 0.05, 0.72, 0.95, INK.detail, { sides: 10, edges: 2 });
  succulent(credenza, 1.2, -0.22, 0.72);
  box(F.p, 7.5, 7.95, 0.3, 0.45, 9.3, 11.3, INK.furniture, true);
  for (const z of [9.4, 11.2]) line(F.p(7.72, 0, z), F.p(7.72, 0.3, z), INK.detail);
  coatStand(F.p, 7.45, 12.4);
  snakePlant(F.p, 7.5, 13.3, { height: 0.45, radius: 0.2, seed: 12 });
  tallPlant(F.p, 7.4, 8.7, 4);

  // The table at the end, its chairs, a laptop and a plant on it, the long
  // light over it.
  const t = F.piece(2.2, 19.9);
  box(t, -0.62, 0.62, 0.72, 0.76, -2.1, 2.1, INK.furniture, true);
  for (const w of [-1.6, 1.6]) {
    line(t(0, 0, w), t(0, 0.72, w), INK.detail);
    line(t(-0.4, 0.002, w), t(0.4, 0.002, w), INK.detail);
  }
  for (const w of [-1.4, -0.45, 0.5, 1.45]) {
    officeChair(F.piece(2.2 - 0.95, 19.9 + w + (hash(Math.round(w * 10)) - 0.5) * 0.15, Math.PI / 2 + (hash(Math.round(w * 10) + 1) - 0.5) * 0.4));
    officeChair(F.piece(2.2 + 0.95, 19.9 + w + (hash(Math.round(w * 10) + 2) - 0.5) * 0.15, -Math.PI / 2 + (hash(Math.round(w * 10) + 3) - 0.5) * 0.4));
  }
  laptop(F.piece(2.2, 19.9, -Math.PI / 2), 0.9, -0.28, 0.76, "laptop-0", [2, at(6.2), 1.8, 5]);
  succulent(t, 0, 0.4, 0.76);
  mug(t, -0.3, -0.9, 0.76);
  notebook(t, 0.25, -1.2, 0.76, -0.4);
  linearLight(t, 0, -1.6, 1.6, 2.35, CEILING);
  // Over the table, a raft of felt tiles for the room's acoustics.
  for (let i = 0; i <= 3; i++) line(F.p(0.9 + i * 0.8, 2.78, 17.7), F.p(0.9 + i * 0.8, 2.78, 22.1), INK.faint);
  for (let k = 0; k <= 5; k++) line(F.p(0.9, 2.78, 17.7 + k * 0.88), F.p(3.3, 2.78, 17.7 + k * 0.88), INK.faint);
  for (const [x, z] of [[1.0, 17.8], [3.2, 17.8], [1.0, 22.0], [3.2, 22.0]]) line(F.p(x, 2.78, z), F.p(x, CEILING, z), INK.faint);

  // The far wall: the line, a low cabinet, a plant either end.
  slogan(F, "meeting", 1.95);
  const cabinet = F.piece(3.8, ROOM.z1 - 0.44, Math.PI);
  shelving(cabinet, -1.2, 1.2, 0.72, 0.42, 2, 44, { bays: 2, fill: 0.85, top: false });
  tallPlant(F.p, 0.8, 23.4, 2);
  monstera(F.p, 6.2, 23.2, { seed: 11, leaves: 8 });
}

/** A coat stand: its pole, the hooks at the top, a coat on one, the feet. */
function coatStand(P: Place, x: number, z: number) {
  line(P(x, 0.02, z), P(x, 1.8, z), INK.detail);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    line(P(x, 0.02, z), P(x + Math.cos(a) * 0.25, 0, z + Math.sin(a) * 0.25), INK.detail);
    line(P(x, 1.72, z), P(x + Math.cos(a) * 0.14, 1.8, z + Math.sin(a) * 0.14), INK.detail);
  }
  polyline([P(x + 0.1, 1.76, z), P(x + 0.26, 1.4, z + 0.05), P(x + 0.3, 0.95, z + 0.08), P(x + 0.02, 0.95, z + 0.1), P(x - 0.02, 1.45, z + 0.04), P(x + 0.1, 1.76, z)], INK.detail);
}

/** A seat for a class: shell, legs, and the writing arm on its right. */
function classChair(c: Place) {
  polyline([c(-0.22, 0.45, -0.2), c(0.22, 0.45, -0.2), c(0.22, 0.45, 0.2), c(-0.22, 0.45, 0.2)], INK.detail, true);
  polyline([c(-0.21, 0.5, -0.22), c(-0.21, 0.86, -0.27), c(0.21, 0.86, -0.27), c(0.21, 0.5, -0.22)], INK.detail);
  for (const [u, w] of [[-0.19, -0.17], [0.19, -0.17], [-0.19, 0.17], [0.19, 0.17]]) line(c(u, 0, w), c(u, 0.45, w), INK.faint);
  polyline([c(0.22, 0.68, -0.05), c(0.4, 0.7, 0.05), c(0.38, 0.7, 0.3), c(0.12, 0.7, 0.3)], INK.detail, true);
  quad(c(-0.21, 0.5, -0.22), c(0.21, 0.5, -0.22), c(0.21, 0.86, -0.27), c(-0.21, 0.86, -0.27));
}

/** A lectern facing +w. */
function lectern(c: Place) {
  polyline([c(-0.3, 0, -0.2), c(0.3, 0, -0.2), c(0.3, 0, 0.2), c(-0.3, 0, 0.2)], INK.detail, true);
  polyline([c(-0.3, 1.12, -0.25), c(0.3, 1.12, -0.25), c(0.3, 1.02, 0.2), c(-0.3, 1.02, 0.2)], INK.furniture, true);
  for (const u of [-0.25, 0.25]) line(c(u, 0, 0), c(u, 1.04, 0.05), INK.detail);
  quad(c(-0.3, 1.12, -0.25), c(0.3, 1.12, -0.25), c(0.3, 1.02, 0.2), c(-0.3, 1.02, 0.2));
}

/* ----------------------------------------------------------------------------
 * The walk
 * ------------------------------------------------------------------------- */

/** Up the middle of each room, then a quarter turn through its doorway into
 *  the next: 8 m straight, and an arc of 4 m radius. */
const STRAIGHT = ROOM.z1 - ROOM.z0 - WIDTH;
const TURN = WIDTH / 2;
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

/** The pace, m/s: an unhurried walk. */
const SPEED = 1.45;

const bump = (distance: number, width: number) => {
  const k = Math.min(1, Math.abs(distance) / width);
  return 0.5 + 0.5 * Math.cos(Math.PI * k);
};

/** The glances that bear on a point `local` metres into `room`: its own,
 *  and the next room's, which may begin before its doorway — the head turns
 *  to what is on a wall as the room opens up, not once it is alongside. */
function glances(room: number, local: number) {
  const next = (room + 1) % 4;
  return [
    ...ROOMS[room].looks.map((look) => ({ ...look, room, distance: local - look.at })),
    ...ROOMS[next].looks.map((look) => ({ ...look, room: next, distance: local - PER_ROOM - look.at })),
  ];
}

/** How far round a corner the walk is at `local`: 1 halfway round the arc,
 *  easing to 0 well before and after it. */
function cornerAt(local: number) {
  const middle = STRAIGHT + (Math.PI / 4) * TURN;
  const d = ((((local - middle + PER_ROOM / 2) % PER_ROOM) + PER_ROOM) % PER_ROOM) - PER_ROOM / 2;
  return bump(d, 4.4);
}

function speedAt(s: number) {
  const { room, local } = placeAt(s);
  // A little slower round the corners, as anyone walks them.
  let speed = SPEED * (1 - 0.2 * cornerAt(local));
  for (const { distance, width, slow } of glances(room, local)) {
    speed *= 1 - (1 - slow) * bump(distance, width);
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

/** The rooms the walk passes, drawn — built when the drawing starts, not
 *  when the page loads. */
export function buildRooms(): LayerData {
  ROOMS.forEach(({ build, facade }, k) => {
    const F = frameOf(k);
    shell(F, facade);
    // A room's screens may start before its doorway, with the glance.
    build(F, (s) => timeAt((((k * PER_ROOM + s) % LENGTH) + LENGTH) % LENGTH));
  });
  return takeScene().inside;
}

/** The city out of their windows, in pieces to build a few at a time once
 *  the walk is under way — it is the larger part of the drawing, and the
 *  walk is a room and a half from its first window — and then handed over
 *  whole. */
export const viewPieces = cityPieces;
export const takeView = (): LayerData => takeScene().outside;

export type Camera = { eye: [number, number, number]; target: [number, number, number] };

function sAt(t: number) {
  const time = ((t % LOOP) + LOOP) % LOOP;
  let lo = 0;
  let hi = SAMPLES - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (TIMES[mid] <= time) lo = mid;
    else hi = mid - 1;
  }
  return (lo + (time - TIMES[lo]) / (TIMES[lo + 1] - TIMES[lo])) * STEP;
}

/** Where the camera is and where it looks, `t` s into the walk. */
export function cameraAt(t: number): Camera {
  const s = sAt(t);
  const { x, z, room, local } = placeAt(s);
  // The heading, averaged over the next few metres, so the camera eases into
  // a turn well before it and out of it well after: no sudden swing.
  let hx = 0;
  let hz = 0;
  for (let j = 0; j <= 16; j++) {
    const ahead = placeAt(s + j * 0.17).heading;
    const weight = 1 - j / 20;
    hx += Math.sin(ahead) * weight;
    hz += Math.cos(ahead) * weight;
  }
  let heading = Math.atan2(hx, hz);
  let lift = 1.57;
  for (const { distance, width, look, turn, room: of } of glances(room, local)) {
    const weight = bump(distance, width) * turn;
    if (weight <= 0) continue;
    const [lx, lz] = frameOf(of).at(look[0], look[2]);
    const toward = Math.atan2(lx - x, lz - z);
    heading += Math.atan2(Math.sin(toward - heading), Math.cos(toward - heading)) * weight;
    const away = Math.hypot(lx - x, lz - z);
    lift += ((look[1] - 1.6) / Math.max(away, 1) + 0.03) * weight;
  }
  const eye: V3 = [x, 1.6, z];
  const target: V3 = [x + Math.sin(heading), lift, z + Math.cos(heading)];
  const [ex, ey, ez] = gl(eye);
  const [tx, ty, tz] = gl(target);
  return { eye: [ex, ey, ez], target: [tx, ty, tz] };
}

/** Whether the city can be in view `t` s into the walk: from the far end
 *  of the server room, where the lounge's glass first shows through the
 *  doorway, to the end of the meeting room. */
export function outsideAt(t: number) {
  const { room, local } = placeAt(sAt(t));
  return room === 2 || room === 3 || (room === 1 && local > STRAIGHT * 0.6);
}

/** The still frame: the lounge, the avenue and the Obelisco through the
 *  glass, everything drawn in. */
export const STILL_TIME = timeAt(2 * PER_ROOM + 5.5);
export const STILL_REVEAL = STILL_TIME + 6;

