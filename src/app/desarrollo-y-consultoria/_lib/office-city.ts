import {
  CELESTE,
  WHITE,
  billboardDisc,
  billboardLine,
  chance,
  hash,
  ink,
  line,
  outdoors,
  point,
  polyline,
  quad,
  run,
  solid,
  type Ink,
  type Place,
  type V2,
  type V3,
} from "./office-draw";

/*
 * The city out of the windows: downtown Buenos Aires from the thirteenth floor
 * of a tower on 9 de Julio, looking down the avenue to the Obelisco.
 *
 * The avenue is the real one's cross-section — laterals, planted medians,
 * the main roadways and the Metrobus in the middle, 140 m between building
 * lines — and the Obelisco is to size, 67.5 m on a base seven wide, with
 * its four windows under the point, in the Plaza de la República where
 * Corrientes crosses. Round it, blocks of 120 m of buildings of every
 * height, the way the centre is: water tanks and machine rooms on the
 * roofs, a dome on a corner here and there, hoardings over the plaza, and
 * far off to the east the towers by the river.
 *
 * It is seen through glass, and set back further still than the rooms: thin
 * lines, a haze of its own, and the detail thinning out with distance. What
 * moves is the traffic — lights down the lanes — and the aircraft lights on
 * the towers. The office's own block is left out: nothing of it can be seen
 * from inside.
 *
 * The tower is 24 m square with its south-east corner on the plan's origin
 * — X 0–24, Z 0–24 — and the avenue runs north–south east of it.
 */

/** Street level under the floor the camera walks. */
export const STREET = -42.2;

const P: Place = (x, y, z) => [x, y, z];

const CITY = {
  edge: ink(WHITE, 0.2),
  floors: ink(WHITE, 0.075),
  windows: ink(WHITE, 0.05),
  roof: ink(WHITE, 0.13),
  kerb: ink(WHITE, 0.15),
  marking: ink(WHITE, 0.07),
  tree: ink(CELESTE, 0.24),
  trunk: ink(WHITE, 0.09),
  lamp: ink(WHITE, 0.55),
  obelisco: ink(WHITE, 0.64),
  obeliscoDetail: ink(WHITE, 0.3),
  plaza: ink(WHITE, 0.18),
  away: ink(CELESTE, 0.85),
  toward: ink(WHITE, 0.72),
  beacon: ink(CELESTE, 0.9),
} as const;

/** 9 de Julio: its building lines either side and its middle. */
const AVENUE = { west: 30, east: 170, middle: 100 };
/** The Obelisco, in the middle of 9 de Julio where Corrientes crosses, two
 *  blocks down from the office. */
export const OBELISCO: V2 = [100, -216];
/** The Plaza de la República round it, an oval along the avenue. */
const PLAZA = { rx: 22, rz: 60 };

/** Where the office looks out from, for how much detail a block gets. */
const VIEW: V2 = [20, 0];

/** The streets across the avenue, a block of 100 m apart; Corrientes is the
 *  wide one. */
const CROSS = Array.from({ length: 22 }, (_, i) => -16 + 100 * (i - 14));
const crossWidth = (z: number) => (z === OBELISCO[1] ? 30 : 14);
/** The streets along it, either side. */
const WEST_STREETS = [-63, -163, -263, -363];
const EAST_STREETS = [263, 363, 463, 563, 663, 763, 863];
const NORTH = 720;
const SOUTH = -1460;

/** The city in pieces, each small enough to build between two frames of
 *  the walk: the avenue and the Obelisco, the streets, the blocks a row at a
 *  time, and the towers far off. */
export function cityPieces(): (() => void)[] {
  const pieces = [
    () => {
      plaza();
      obelisco();
    },
    avenue,
    ...TREE_ROWS.map(([x, step]) => () => treeRow(x, step)),
    streets,
    ...blockRows(),
    skyline,
  ];
  return pieces.map((piece) => () => outdoors(piece));
}

/* ----------------------------------------------------------------------------
 * 9 de Julio
 * ------------------------------------------------------------------------- */

/** How far the roadways bow out round the plaza, at `z`. */
function clearance(z: number) {
  const t = (z - OBELISCO[1]) / (PLAZA.rz + 30);
  if (Math.abs(t) >= 1) return 0;
  const k = Math.cos((t * Math.PI) / 2);
  return (PLAZA.rx + 4) * k * k;
}

/** A line along the avenue at `x0`, bowed out round the plaza if it is one
 *  of the inner ones, from `z0` to `z1`. */
function along(x0: number, z0: number, z1: number, y = STREET): V3[] {
  const shift = (z: number) => {
    const c = clearance(z);
    if (x0 > 52 && x0 < AVENUE.middle) return x0 - (c * (x0 - 52)) / 48;
    if (x0 > AVENUE.middle && x0 < 148) return x0 + (c * (148 - x0)) / 48;
    return x0;
  };
  const near = OBELISCO[1];
  const cuts = [z0, near + 110, near + 90, near + 70, near + 50, near + 30, near + 10, near - 10, near - 30, near - 50, near - 70, near - 90, near - 110, z1]
    .filter((z) => (z0 > z1 ? z <= z0 && z >= z1 : z >= z0 && z <= z1));
  const sorted = [...new Set(cuts)].sort((a, b) => (z0 > z1 ? b - a : a - b));
  return sorted.map((z) => [shift(z), y, z]);
}

function avenue() {
  // Kerbs and the edges of the medians and of the Metrobus' island. The
  // medians and the island stop at every crossing street.
  for (const x of [34, 166, 44, 52, 148, 156]) {
    polyline(along(x, NORTH, SOUTH), x === 34 || x === 166 ? CITY.kerb : CITY.marking);
  }
  // The Metrobus' lanes and island end either side of the plaza; the buses
  // go round it with the rest.
  const gap = PLAZA.rz + 26;
  for (const x of [88, 93, 107, 112]) {
    line([x, STREET, NORTH], [x, STREET, OBELISCO[1] + gap], CITY.marking);
    line([x, STREET, OBELISCO[1] - gap], [x, STREET, SOUTH], CITY.marking);
  }

  // The lanes' traffic: south on the west half, north on the east, and the
  // buses down the middle.
  const lanes: [number, 1 | -1][] = [
    [37, -1], [41, -1],
    [55, -1], [60.5, -1], [66, -1], [71.5, -1], [77, -1], [82.5, -1],
    [90.5, -1], [109.5, 1],
    [117.5, 1], [123, 1], [128.5, 1], [134, 1], [139.5, 1], [145, 1],
    [159, 1], [163, 1],
  ];
  lanes.forEach(([x, heading], i) => {
    const path = heading < 0 ? along(x, NORTH, SOUTH, STREET + 0.6) : along(x, SOUTH, NORTH, STREET + 0.6);
    run(path, heading < 0 ? CITY.away : CITY.toward, 2 + ((i * 0.137) % 0.9), 9 + hash(i + 40) * 6, hash(i + 70) * 200, 1.7);
  });

  // Street lamps down the medians.
  for (const x of [48, 152]) {
    for (let z = NORTH - 20; z > SOUTH; z -= 34) {
      if (crossing(z)) continue;
      lamp([x, z]);
    }
  }

  // The Metrobus' stations: a long shelter on the island.
  for (const [z0, z1] of [[-36, -92], [-340, -396]]) {
    const y = STREET + 3.2;
    polyline([[95, y, z0], [105, y, z0], [105, y, z1], [95, y, z1]], CITY.roof, true);
    for (let z = z0; z >= z1; z -= 6) {
      line([96, STREET, z], [96, y, z], CITY.marking);
      line([104, STREET, z], [104, y, z], CITY.marking);
    }
    solid(P, 95, 105, y - 0.3, y, z1, z0);
  }
}

/** Is `z` in one of the streets that cross the avenue? */
const crossing = (z: number) => CROSS.some((s) => Math.abs(z - s) < crossWidth(s) / 2 + 3);

/** The avenue's rows of trees — down the medians and along both pavements
 *  — and how far apart they stand. */
const TREE_ROWS = [[48, 12], [152, 12], [32, 15], [168, 15]] as const;

/** A row of trees along the avenue; none in the crossings or on the plaza. */
function treeRow(x: number, step: number) {
  for (let z = NORTH - 4; z > SOUTH; z -= step) {
    if (crossing(z) || Math.abs(z - OBELISCO[1]) < PLAZA.rz + 8) continue;
    tree([x + (hash(Math.round(z * 3 + x)) - 0.5) * 1.5, z], hash(Math.round(z + x * 7)));
  }
}

/** A tree seen far off: its trunk and a round crown that faces the eye. */
function tree([x, z]: V2, seed: number) {
  const top = STREET + 3.6 + seed * 1.6;
  const radius = 2.6 + seed * 1.6;
  line([x, STREET, z], [x, top, z], CITY.trunk);
  const centre: V3 = [x, top + radius * 0.8, z];
  const sides = 8;
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 + seed;
    const b = ((i + 1) / sides) * Math.PI * 2 + seed;
    const wobble = (k: number) => 1 + 0.12 * Math.sin(k * 3 + seed * 9);
    billboardLine(centre, [Math.cos(a) * radius * wobble(a), Math.sin(a) * radius * 0.85 * wobble(a)], [Math.cos(b) * radius * wobble(b), Math.sin(b) * radius * 0.85 * wobble(b)], CITY.tree);
  }
  billboardDisc(centre, radius * 0.9, 0, 8);
}

/** A double street lamp on its mast. */
function lamp([x, z]: V2) {
  const top = STREET + 10.5;
  line([x, STREET, z], [x, top, z], CITY.marking);
  line([x - 2.6, top, z], [x + 2.6, top, z], CITY.marking);
  point([x - 2.6, top - 0.2, z], CITY.lamp, 1.4);
  point([x + 2.6, top - 0.2, z], CITY.lamp, 1.4);
}

/* ----------------------------------------------------------------------------
 * The Plaza de la República and the Obelisco
 * ------------------------------------------------------------------------- */

function plaza() {
  const [ox, oz] = OBELISCO;
  const oval = (rx: number, rz: number, count = 48): V3[] =>
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      return [ox + Math.cos(a) * rx, STREET, oz + Math.sin(a) * rz];
    });
  polyline(oval(PLAZA.rx, PLAZA.rz), CITY.plaza, true);
  polyline(oval(PLAZA.rx - 3, PLAZA.rz - 3), CITY.marking, true);
  polyline(oval(13, 13, 32), CITY.marking, true);
  // Paths out to the oval's ends and sides.
  line([ox, STREET, oz + 13], [ox, STREET, oz + PLAZA.rz - 3], CITY.marking);
  line([ox, STREET, oz - 13], [ox, STREET, oz - PLAZA.rz + 3], CITY.marking);
  line([ox - 13, STREET, oz], [ox - PLAZA.rx + 3, STREET, oz], CITY.marking);
  line([ox + 13, STREET, oz], [ox + PLAZA.rx - 3, STREET, oz], CITY.marking);
  // Lamps round it.
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.3;
    lamp([ox + Math.cos(a) * (PLAZA.rx - 1.5), oz + Math.sin(a) * (PLAZA.rz - 1.5)]);
  }
}

/**
 * The Obelisco: 67.5 m, on a square foot seven metres a side narrowing to
 * four under the point; a window on each face just below it, the door at
 * its foot, and the lines cut into its faces at eye height. It stands on a
 * low stepped base in the middle of the plaza.
 */
function obelisco() {
  const [ox, oz] = OBELISCO;
  const base = STREET + 0.7;
  for (const [half, h0, h1] of [[7.5, 0, 0.35], [6, 0.35, 0.7]]) {
    const y0 = STREET + h0;
    const y1 = STREET + h1;
    polyline([[ox - half, y1, oz - half], [ox + half, y1, oz - half], [ox + half, y1, oz + half], [ox - half, y1, oz + half]], CITY.obeliscoDetail, true);
    polyline([[ox - half, y0, oz - half], [ox + half, y0, oz - half], [ox + half, y0, oz + half], [ox - half, y0, oz + half]], CITY.marking, true);
    solid(P, ox - half, ox + half, y0, y1, oz - half, oz + half);
  }
  const SHAFT = 63.4;
  const APEX = 67.5;
  const halfAt = (h: number) => 3.5 + (2.0 - 3.5) * (h / SHAFT);
  const square = (h: number): V3[] => {
    const s = halfAt(h);
    return [[ox - s, base + h, oz - s], [ox + s, base + h, oz - s], [ox + s, base + h, oz + s], [ox - s, base + h, oz + s]];
  };
  const foot = square(0);
  const head = square(SHAFT);
  const apex: V3 = [ox, base + APEX - 0.7, oz];
  polyline(foot, CITY.obelisco, true, 1.45);
  polyline(head, CITY.obelisco, true, 1.45);
  for (let i = 0; i < 4; i++) {
    line(foot[i], head[i], CITY.obelisco, undefined, 1.45);
    line(head[i], apex, CITY.obelisco, undefined, 1.45);
    const j = (i + 1) % 4;
    quad(foot[i], foot[j], head[j], head[i]);
    quad(head[i], head[j], apex, apex);
  }
  // The four faces: which way each looks, and a place on it — `u` across
  // from its middle, `h` up from the foot.
  const faces: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  faces.forEach(([nx, nz], k) => {
    const on = (u: number, h: number): V3 => {
      const s = halfAt(h) + 0.04;
      return [ox + nx * s - nz * u, base + h, oz + nz * s + nx * u];
    };
    // The window under the point.
    polyline([on(-0.45, 58.6), on(0.45, 58.6), on(0.45, 60.3), on(-0.45, 60.3)], CITY.obeliscoDetail, true);
    // The lines cut into it, at the height they are read from.
    [[-1.8, 1.8, 4.6], [-2.2, 2.2, 4.0], [-2.0, 2.0, 3.4], [-1.4, 1.4, 2.8]].forEach(([u0, u1, h]) => line(on(u0, h), on(u1, h), CITY.marking));
    // The door, on the face towards the west.
    if (k === 3) polyline([on(-0.7, 0), on(-0.7, 2.6), on(0.7, 2.6), on(0.7, 0)], CITY.obeliscoDetail);
  });
}

/* ----------------------------------------------------------------------------
 * The streets
 * ------------------------------------------------------------------------- */

function streets() {
  // The crossing streets, over the whole plan and across the avenue; each
  // one-way, the direction changing from one to the next.
  CROSS.forEach((z, i) => {
    const half = crossWidth(z) / 2 - 3;
    for (const [x0, x1] of [[-760, AVENUE.west], [AVENUE.east, 1000]]) {
      line([x0, STREET, z - half], [x1, STREET, z - half], CITY.kerb);
      line([x0, STREET, z + half], [x1, STREET, z + half], CITY.kerb);
    }
    if (Math.abs(z - VIEW[1]) > 900) return;
    const lanes = z === OBELISCO[1] ? [-7, -3.5, 3.5, 7] : [-2, 2];
    lanes.forEach((offset, k) => {
      const east = z === OBELISCO[1] ? offset > 0 : i % 2 === 0;
      const pieces: [number, number][] = z === OBELISCO[1] ? [[-760, OBELISCO[0] - PLAZA.rx - 2], [OBELISCO[0] + PLAZA.rx + 2, 1000]] : [[-760, 1000]];
      for (const [x0, x1] of pieces) {
        const path: V3[] = east ? [[x0, STREET + 0.6, z + offset], [x1, STREET + 0.6, z + offset]] : [[x1, STREET + 0.6, z + offset], [x0, STREET + 0.6, z + offset]];
        run(path, east ? CITY.toward : CITY.away, 2 + ((i * 0.31 + k * 0.17) % 0.9), 7 + hash(i * 5 + k) * 5, hash(i * 9 + k) * 300, 1.7);
      }
    });
  });
  // The streets along the avenue, either side.
  [...WEST_STREETS, ...EAST_STREETS].forEach((x, i) => {
    line([x - 4, STREET, NORTH], [x - 4, STREET, SOUTH], CITY.kerb);
    line([x + 4, STREET, NORTH], [x + 4, STREET, SOUTH], CITY.kerb);
    if (Math.abs(x - VIEW[0]) > 700) return;
    const north = i % 2 === 0;
    const path: V3[] = north ? [[x, STREET + 0.6, SOUTH], [x, STREET + 0.6, NORTH]] : [[x, STREET + 0.6, NORTH], [x, STREET + 0.6, SOUTH]];
    run(path, north ? CITY.toward : CITY.away, 2 + ((i * 0.23) % 0.9), 7 + hash(i + 90) * 5, hash(i + 95) * 300, 1.7);
  });
}

/* ----------------------------------------------------------------------------
 * The blocks
 * ------------------------------------------------------------------------- */

function blockRows() {
  const rows: [number, number][] = [];
  for (let i = 0; i < CROSS.length - 1; i++) {
    rows.push([CROSS[i] + crossWidth(CROSS[i]) / 2, CROSS[i + 1] - crossWidth(CROSS[i + 1]) / 2]);
  }
  const west = [...WEST_STREETS].sort((a, b) => a - b);
  const columns: [number, number, "west" | "east" | ""][] = [];
  for (let i = 0; i < west.length; i++) columns.push([west[i] + 7, i + 1 < west.length ? west[i + 1] - 7 : AVENUE.west, i + 1 < west.length ? "" : "west"]);
  columns.push([AVENUE.east, EAST_STREETS[0] - 7, "east"]);
  for (let i = 0; i < EAST_STREETS.length - 1; i++) columns.push([EAST_STREETS[i] + 7, EAST_STREETS[i + 1] - 7, ""]);

  return rows.map(([z0, z1], row) => () => {
    columns.forEach(([x0, x1, side], column) => {
      const seed = 2 + row * columns.length + column;
      // The office's own block: none of it is in view.
      if (x0 <= 12 && x1 >= 12 && z0 <= 12 && z1 >= 12) return;
      const cx = (x0 + x1) / 2;
      const cz = (z0 + z1) / 2;
      const distance = Math.hypot(cx - VIEW[0], cz - VIEW[1]);
      if (distance > 1350) return;
      // Behind the office, to the north and west, nothing is ever seen.
      if (cz > 110 && cx < AVENUE.west) return;
      block(x0, x1, z0, z1, side, distance, seed);
    });
  });
}

/** A block of the centre: buildings round its edge, an open middle. */
function block(x0: number, x1: number, z0: number, z1: number, side: string, distance: number, seed: number) {
  const r = chance(seed);
  const detail = distance < 320 ? 2 : distance < 700 ? 1 : 0;
  const onPlaza = Math.abs((z0 + z1) / 2 - OBELISCO[1]) < 160 && side !== "";
  const height = (onAvenue: boolean) => {
    const k = r();
    if (k < 0.18) return 9 + r() * 6;
    if (k < 0.24) return 70 + r() * 45;
    return (onAvenue ? 28 : 16) + r() * (onAvenue ? 38 : 30);
  };
  if (detail === 0) {
    // Far off, a block is read as its masses: four of them.
    const mx = (x0 + x1) / 2 + (r() - 0.5) * 20;
    const mz = (z0 + z1) / 2 + (r() - 0.5) * 20;
    for (const [a0, a1, b0, b1] of [[x0, mx, z0, mz], [mx, x1, z0, mz], [x0, mx, mz, z1], [mx, x1, mz, z1]]) {
      building(a0 + 1, a1 - 1, b0 + 1, b1 - 1, height(false), 0, r);
    }
    return;
  }
  const depth = 18 + r() * 10;
  // The lots along each side, corner to corner: north and south take the
  // corners, east and west what is left between.
  const lots = (a: number, b: number, place: (s0: number, s1: number) => [number, number, number, number], avenueSide: boolean) => {
    let s = a;
    while (s < b - 4) {
      const e = Math.min(b, s + 8 + r() * 14);
      const width = b - e < 6 ? b - s : e - s;
      const [bx0, bx1, bz0, bz1] = place(s, s + width);
      building(bx0, bx1, bz0, bz1, height(avenueSide), detail, r, avenueSide && onPlaza);
      s += width;
    }
  };
  lots(x0, x1, (s0, s1) => [s0, s1, z1 - depth, z1], onPlaza && z1 < OBELISCO[1] + 10);
  lots(x0, x1, (s0, s1) => [s0, s1, z0, z0 + depth], false);
  lots(z0 + depth, z1 - depth, (s0, s1) => [x0, x0 + depth, s0, s1], side === "east");
  lots(z0 + depth, z1 - depth, (s0, s1) => [x1 - depth, x1, s0, s1], side === "west");
}

/**
 * A building: its roof's outline and its corners — the foot is left out,
 * streets and trees cross it — and its body as depth, so the one behind is
 * hidden. Nearer, its floors on the faces that look towards the office;
 * nearer still, the rhythm of its windows and what stands on its roof.
 */
function building(x0: number, x1: number, z0: number, z1: number, height: number, detail: number, r: () => number, hoarding = false) {
  if (x1 - x0 < 3 || z1 - z0 < 3) return;
  // In front of the office's south windows everything stays below them, so
  // the view down the avenue is never shut.
  let h = height;
  if (z1 > -150 && z1 < 0 && x0 < 32 && x1 > -80) h = Math.min(h, 22 + r() * 8);
  const y0 = STREET;
  const setback = h > 34 && r() < 0.35 ? 2.5 : 0;
  const lower = setback ? h - 6.5 : h;
  mass(x0, x1, z0, z1, y0, y0 + lower, detail);
  if (setback) mass(x0 + setback, x1 - setback, z0 + setback, z1 - setback, y0 + lower, y0 + h, detail);
  const top = y0 + h;
  const inset = setback;
  if (detail < 1) return;
  // What stands on the roof: a water tank on its legs, the lift's machine
  // room, an aerial.
  const cx = (x0 + x1) / 2 + (r() - 0.5) * (x1 - x0 - 6 - inset * 2) * 0.5;
  const cz = (z0 + z1) / 2 + (r() - 0.5) * (z1 - z0 - 6 - inset * 2) * 0.5;
  const k = r();
  if (k < 0.35) {
    boxLines(cx - 1.5, cx + 1.5, top + 1.4, top + 3.6, cz - 1.1, cz + 1.1, CITY.roof, true);
    for (const [dx, dz] of [[-1.3, -0.9], [1.3, -0.9], [1.3, 0.9], [-1.3, 0.9]]) line([cx + dx, top, cz + dz], [cx + dx, top + 1.4, cz + dz], CITY.floors);
  } else if (k < 0.65 && h > 20) {
    boxLines(cx - 2, cx + 2, top, top + 3, cz - 2, cz + 2, CITY.roof, true);
  }
  if (r() < 0.12) line([cx + 2.5, top, cz], [cx + 2.5, top + 6 + r() * 6, cz], CITY.roof);
  // A dome on a corner, as the older buildings of the centre have.
  if (detail === 2 && h > 22 && h < 50 && r() < 0.14) cupola(x0 + 4, z1 - 4, top);
  // Round the plaza, a hoarding on the roof, turned up the avenue.
  if (hoarding && r() < 0.7) {
    const z = z1 - 3;
    const xc = (x0 + x1) / 2;
    const w = Math.min(8, (x1 - x0) / 2 - 0.5);
    const y0 = top + 2.5;
    const y1 = top + 2.5 + w * 0.9;
    polyline([[xc - w, y0, z], [xc + w, y0, z], [xc + w, y1, z], [xc - w, y1, z]], CITY.edge, true);
    polyline([[xc - w + 0.6, y0 + 0.6, z + 0.05], [xc + w - 0.6, y0 + 0.6, z + 0.05], [xc + w - 0.6, y1 - 0.6, z + 0.05], [xc - w + 0.6, y1 - 0.6, z + 0.05]], CITY.floors, true);
    for (const dx of [-w * 0.7, 0, w * 0.7]) line([xc + dx, top, z - 1], [xc + dx, y0, z], CITY.floors);
    quad([xc - w, y0, z], [xc + w, y0, z], [xc + w, y1, z], [xc - w, y1, z]);
  }
}

/** One box of a building, with its floors and windows on the faces that
 *  look towards the office. */
function mass(x0: number, x1: number, z0: number, z1: number, y0: number, y1: number, detail: number) {
  polyline([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], CITY.edge, true);
  for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) line([x, y0, z], [x, y1, z], CITY.edge);
  solid(P, x0, x1, y0, y1, z0, z1);
  if (detail < 1) return;
  // The faces, each as its two ends; a face is drawn on only when it looks
  // towards the office.
  const faces: [V2, V2, V2][] = [
    [[x0, z0], [x1, z0], [0, -1]],
    [[x1, z0], [x1, z1], [1, 0]],
    [[x1, z1], [x0, z1], [0, 1]],
    [[x0, z1], [x0, z0], [-1, 0]],
  ];
  const floor = 3.1;
  for (const [a, b, n] of faces) {
    const mx = (a[0] + b[0]) / 2;
    const mz = (a[1] + b[1]) / 2;
    if ((VIEW[0] - mx) * n[0] + (VIEW[1] - mz) * n[1] <= 0) continue;
    const every = detail === 2 ? floor : floor * 2;
    for (let y = y0 + 4.2; y < y1 - 1; y += every) line([a[0], y, a[1]], [b[0], y, b[1]], CITY.floors);
    if (detail < 2) continue;
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const bays = Math.max(1, Math.round(length / 3.2));
    for (let i = 1; i < bays; i++) {
      const t = i / bays;
      const x = a[0] + (b[0] - a[0]) * t;
      const z = a[1] + (b[1] - a[1]) * t;
      line([x, y0 + 4.2, z], [x, y1 - 1.2, z], CITY.windows);
    }
  }
}

function boxLines(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: Ink, occlude = false) {
  polyline([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], color, true);
  polyline([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], color, true);
  for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) line([x, y0, z], [x, y1, z], color);
  if (occlude) solid(P, x0, x1, y0, y1, z0, z1);
}

/** A corner dome: its drum, the dome in three rings and the lantern. */
function cupola(x: number, z: number, top: number) {
  const ringAt = (y: number, radius: number): V3[] => Array.from({ length: 12 }, (_, i) => [x + Math.cos((i / 12) * Math.PI * 2) * radius, y, z + Math.sin((i / 12) * Math.PI * 2) * radius]);
  const drum = [ringAt(top, 3), ringAt(top + 3.5, 3)];
  drum.forEach((rim) => polyline(rim, CITY.roof, true));
  for (let i = 0; i < 12; i += 3) line(drum[0][i], drum[1][i], CITY.floors);
  const dome = [ringAt(top + 3.5, 3), ringAt(top + 5.2, 2.5), ringAt(top + 6.3, 1.5), ringAt(top + 6.8, 0.6)];
  dome.slice(1).forEach((rim) => polyline(rim, CITY.roof, true));
  for (let i = 0; i < 12; i += 3) polyline(dome.map((rim) => rim[i]), CITY.floors);
  line([x, top + 6.8, z], [x, top + 9, z], CITY.roof);
  for (let i = 0; i < 12; i++) {
    const j = (i + 1) % 12;
    quad(drum[0][i], drum[0][j], drum[1][j], drum[1][i]);
    for (let k = 0; k < 3; k++) quad(dome[k][i], dome[k][j], dome[k + 1][j], dome[k + 1][i]);
  }
}

/** Far off to the east, the towers by the river, each with its aircraft
 *  light. */
function skyline() {
  const r = chance(77);
  for (let i = 0; i < 12; i++) {
    const x = 1050 + r() * 450;
    const z = -620 + r() * 900;
    const w = 14 + r() * 12;
    const d = 14 + r() * 12;
    const h = 100 + r() * 110;
    const y1 = STREET + h;
    polyline([[x - w, y1, z - d], [x + w, y1, z - d], [x + w, y1, z + d], [x - w, y1, z + d]], CITY.edge, true);
    for (const [dx, dz] of [[-w, -d], [w, -d], [w, d], [-w, d]]) line([x + dx, STREET, z + dz], [x + dx, y1, z + dz], CITY.edge);
    for (let y = STREET + 20; y < y1 - 4; y += 16) line([x - w, y, z - d], [x - w, y, z + d], CITY.windows);
    solid(P, x - w, x + w, STREET, y1, z - d, z + d);
    point([x, y1 + 1, z], CITY.beacon, 2, [1, 0.5 + r() * 0.3, r(), 0.18]);
  }
}
