import {
  CELESTE,
  INK,
  WHITE,
  box,
  chance,
  curve,
  cylinder,
  flat,
  hash,
  ink,
  line,
  panel,
  panelOn,
  point,
  polyline,
  quad,
  rectOn,
  ring,
  roundFlat,
  type Place,
  type Reveal,
  type Surface,
  type V3,
} from "./hero-office-draw";

/*
 * What the rooms are furnished with, each piece drawn in its own place: `u`
 * to its right, `w` the way it faces, `y` up, in metres, stood where the
 * room wants it by `piece()`. Real sizes throughout — a desk is 74 cm high,
 * a sofa's seat 40 — because the eye knows them, and a room drawn to them
 * reads as a room.
 *
 * Seats and screens hide what is behind them; the rest is line alone.
 */

const LEAF_SOFT = ink(CELESTE, 0.28);

/* ----------------------------------------------------------------------------
 * Work
 * ------------------------------------------------------------------------- */

/** A task chair, the sitter facing +w: five legs on casters, the lift, the
 *  seat, the back curved to the sitter on its spine, the arms. */
export function officeChair(c: Place) {
  const color = INK.detail;
  for (let i = 0; i < 5; i++) {
    const a = 0.3 + (i / 5) * Math.PI * 2;
    const tip = c(Math.cos(a) * 0.29, 0.07, Math.sin(a) * 0.29);
    line(c(0, 0.11, 0), tip, color);
    line(tip, c(Math.cos(a) * 0.31, 0.02, Math.sin(a) * 0.31), color);
  }
  line(c(0, 0.11, 0), c(0, 0.42, 0), color);
  roundFlat(c, -0.25, 0.25, -0.23, 0.25, 0.48, 0.08, INK.furniture);
  roundFlat(c, -0.24, 0.24, -0.22, 0.24, 0.43, 0.08, color);
  const back = (u: number, y: number): V3 => c(u, y, -0.3 + 0.06 * (u / 0.23) ** 2);
  const outline: V3[] = [];
  const r = 0.07;
  const corners: [number, number, number][] = [
    [0.23 - r, 1.05 - r, 0],
    [-0.23 + r, 1.05 - r, Math.PI / 2],
    [-0.23 + r, 0.6 + r, Math.PI],
    [0.23 - r, 0.6 + r, Math.PI * 1.5],
  ];
  for (const [cu, cy, start] of corners) {
    for (let i = 0; i <= 3; i++) {
      const a = start + (i / 3) * (Math.PI / 2);
      outline.push(back(cu + Math.cos(a) * r, cy + Math.sin(a) * r));
    }
  }
  polyline(outline, INK.furniture, true);
  line(c(0, 0.45, -0.18), c(0, 0.62, -0.29), color);
  for (const side of [-1, 1]) {
    line(c(side * 0.26, 0.47, -0.02), c(side * 0.26, 0.67, -0.02), color);
    line(c(side * 0.26, 0.67, -0.16), c(side * 0.26, 0.67, 0.14), color);
  }
  quad(c(-0.25, 0.48, -0.23), c(0.25, 0.48, -0.23), c(0.25, 0.48, 0.25), c(-0.25, 0.48, 0.25));
  quad(back(-0.23, 0.6), back(0, 0.6), back(0, 1.05), back(-0.23, 1.05));
  quad(back(0, 0.6), back(0.23, 0.6), back(0.23, 1.05), back(0, 1.05));
}

/** A desk, its user at -w facing +w: the top, a sled leg at each end, the
 *  modesty panel along the back and the cable tray under it. */
export function desk(c: Place, width: number, depth: number, top = 0.74) {
  const hu = width / 2;
  const hw = depth / 2;
  box(c, -hu, hu, top - 0.03, top, -hw, hw, INK.furniture, true);
  for (const u of [-hu + 0.05, hu - 0.05]) {
    polyline([c(u, top - 0.03, -hw + 0.06), c(u, 0, -hw + 0.06), c(u, 0, hw - 0.06), c(u, top - 0.03, hw - 0.06)], INK.detail);
  }
  box(c, -hu + 0.1, hu - 0.1, 0.36, top - 0.03, hw - 0.05, hw - 0.03, INK.detail);
  line(c(-hu + 0.15, top - 0.12, hw - 0.14), c(hu - 0.15, top - 0.12, hw - 0.14), INK.faint);
}

/** A monitor on a desk top at `top`, its screen towards -w, on its stand;
 *  what it shows is an atlas region. */
export function monitor(c: Place, u: number, w: number, width: number, top: number, region?: string, reveal?: Reveal) {
  const h = width * (252 / 448);
  const y0 = top + 0.13;
  const y1 = y0 + h;
  const u0 = u - width / 2;
  const u1 = u + width / 2;
  box(c, u0, u1, y0, y1, w, w + 0.025, INK.frame, true);
  flat(c, u - 0.11, u + 0.11, w - 0.02, w + 0.14, top + 0.006, INK.detail);
  line(c(u, top + 0.006, w + 0.1), c(u, y0 + h * 0.3, w + 0.05), INK.detail);
  if (!region) return;
  const s = 0.012;
  const f = w - 0.004;
  panel(region, [c(u0 + s, y1 - s, f), c(u1 - s, y1 - s, f), c(u1 - s, y0 + s, f), c(u0 + s, y0 + s, f)], reveal);
}

/** A laptop open on a desk top at `top`, its screen towards -w. */
export function laptop(c: Place, u: number, w: number, top: number, region?: string, reveal?: Reveal) {
  const y = top + 0.012;
  flat(c, u - 0.16, u + 0.16, w - 0.11, w + 0.11, y, INK.furniture);
  flat(c, u - 0.13, u + 0.13, w - 0.08, w + 0.05, y + 0.001, INK.faint);
  const hinge = w + 0.11;
  const lid: [V3, V3, V3, V3] = [c(u - 0.16, y + 0.21, hinge + 0.07), c(u + 0.16, y + 0.21, hinge + 0.07), c(u + 0.16, y, hinge), c(u - 0.16, y, hinge)];
  polyline(lid, INK.frame, true);
  quad(lid[0], lid[1], lid[2], lid[3]);
  if (!region) return;
  // A hair off the lid towards the user, so the lid's own depth never covers it.
  const at = (k: number, lift: number, dw: number): V3 => c(u + k * 0.145, y + 0.012 + lift * 0.186, hinge + 0.004 + lift * 0.062 - 0.006 + dw);
  panel(region, [at(-1, 1, 0), at(1, 1, 0), at(1, 0, 0), at(-1, 0, 0)], reveal);
}

export function keyboard(c: Place, u: number, w: number, top: number) {
  flat(c, u - 0.22, u + 0.22, w - 0.07, w + 0.07, top + 0.012, INK.detail);
  for (const k of [-0.025, 0.02]) line(c(u - 0.2, top + 0.013, w + k), c(u + 0.2, top + 0.013, w + k), INK.faint);
}

export function mouse(c: Place, u: number, w: number, top: number) {
  polyline(ring(c, u, top + 0.015, w, 0.03, 8, 0.05), INK.detail, true);
}

export function mug(c: Place, u: number, w: number, top: number) {
  cylinder(c, u, w, 0.04, top, top + 0.095, INK.detail, { sides: 10, edges: 2 });
  curve((t) => {
    const a = -Math.PI / 2 + t * Math.PI;
    return c(u + 0.04 + Math.cos(a) * 0.028, top + 0.05 + Math.sin(a) * 0.028, w);
  }, 6, INK.detail);
}

/** A mate with its bombilla, and the thermos beside it: the desk of anyone
 *  who works here. */
export function mateSet(c: Place, u: number, w: number, top: number) {
  const rims: [number, number][] = [[0.028, 0], [0.047, 0.035], [0.034, 0.085]];
  const rings = rims.map(([r, h]) => ring(c, u, top + h, w, r, 10));
  rings.forEach((rim) => polyline(rim, INK.furniture, true));
  for (let i = 0; i < 10; i += 3) polyline(rings.map((rim) => rim[i]), INK.detail);
  line(c(u + 0.008, top + 0.06, w), c(u + 0.04, top + 0.18, w - 0.02), INK.frame);
  cylinder(c, u + 0.16, w + 0.02, 0.043, top, top + 0.29, INK.detail, { sides: 10, edges: 2, rimColor: INK.furniture });
  cylinder(c, u + 0.16, w + 0.02, 0.036, top + 0.29, top + 0.34, INK.detail, { sides: 10, edges: 2 });
}

export function headphones(c: Place, u: number, w: number, top: number) {
  curve((t) => c(u + Math.cos(Math.PI * t) * 0.09, top + 0.02, w + Math.sin(Math.PI * t) * 0.1), 8, INK.detail);
  for (const s of [-1, 1]) polyline(ring(c, u + s * 0.09, top + 0.025, w - 0.01, 0.035, 8), INK.detail, true);
}

/** A desk lamp: its foot, two arms and a shade tipped over the desk. */
export function deskLamp(c: Place, u: number, w: number, top: number) {
  polyline(ring(c, u, top + 0.01, w, 0.07, 10), INK.detail, true);
  const elbow = c(u + 0.05, top + 0.36, w + 0.1);
  const head = c(u + 0.02, top + 0.5, w - 0.12);
  line(c(u, top + 0.01, w), elbow, INK.detail);
  line(elbow, head, INK.detail);
  const shade = ring(c, u + 0.02, top + 0.42, w - 0.18, 0.07, 10);
  polyline(shade, INK.furniture, true);
  for (let i = 0; i < 10; i += 5) line(head, shade[i], INK.detail);
}

/** A desk agent: a small puck whose light blinks while it works — the only
 *  sign that half the team here is software. */
export function agentPuck(c: Place, u: number, w: number, top: number, seed: number) {
  cylinder(c, u, w, 0.045, top, top + 0.022, INK.detail, { sides: 10, edges: 0 });
  point(c(u, top + 0.032, w), INK.accent, 2.4, [1, 0.3 + hash(seed) * 0.5, hash(seed + 1), 0.6]);
}

/** A notebook and a pen on a desk. */
export function notebook(c: Place, u: number, w: number, top: number, turn = 0.2) {
  const at = (du: number, dw: number): V3 => c(u + du * Math.cos(turn) - dw * Math.sin(turn), top + 0.008, w + du * Math.sin(turn) + dw * Math.cos(turn));
  polyline([at(-0.1, -0.14), at(0.1, -0.14), at(0.1, 0.14), at(-0.1, 0.14)], INK.detail, true);
  line(at(0.13, -0.1), at(0.15, 0.1), INK.detail);
}

/* ----------------------------------------------------------------------------
 * Plants
 * ------------------------------------------------------------------------- */

/** A pot, octagonal, standing at `y0`. */
export function pot(c: Place, u: number, w: number, radius: number, height: number, y0 = 0) {
  const foot = ring(c, u, y0, w, radius * 0.8, 8);
  const lip = ring(c, u, y0 + height, w, radius, 8);
  polyline(foot, INK.furniture, true);
  polyline(lip, INK.furniture, true);
  foot.forEach((p, i) => i % 2 === 0 && line(p, lip[i], INK.detail));
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8;
    quad(foot[i], foot[j], lip[j], lip[i]);
  }
}

/** A tall plant: long leaves arching out of an octagonal pot. */
export function tallPlant(c: Place, u: number, w: number, seed = 0) {
  pot(c, u, w, 0.18, 0.46);
  for (let n = 0; n < 11; n++) {
    const angle = n * 2.2 + seed;
    const reach = 0.36 + ((n + seed) % 3) * 0.13;
    const rise = 0.66 + ((n + seed) % 4) * 0.16;
    curve((t) => c(u + Math.cos(angle) * reach * t, 0.46 + rise * Math.sin(t * Math.PI * 0.85), w + Math.sin(angle) * reach * t), 6, INK.leaf);
  }
}

/** A round bush: a low pot and a crown of small loops. */
export function bushPlant(c: Place, u: number, w: number) {
  pot(c, u, w, 0.24, 0.34);
  for (let n = 0; n < 9; n++) {
    const angle = (n / 9) * Math.PI * 2;
    const r = 0.28 + (n % 2) * 0.08;
    const cu = u + Math.cos(angle) * 0.18;
    const cw = w + Math.sin(angle) * 0.18;
    const cy = 0.62 + (n % 3) * 0.12;
    polyline(Array.from({ length: 10 }, (_, i): V3 => c(cu + Math.cos((i / 10) * Math.PI * 2) * r * 0.5, cy + Math.sin((i / 10) * Math.PI * 2) * r * 0.4, cw)), INK.leaf, true);
  }
}

/** A small succulent in a bowl, for a table top at `y`. */
export function succulent(c: Place, u: number, w: number, y: number) {
  polyline(ring(c, u, y, w, 0.07, 8), INK.furniture, true);
  polyline(ring(c, u, y + 0.08, w, 0.1, 8), INK.furniture, true);
  for (let n = 0; n < 7; n++) {
    const angle = (n / 7) * Math.PI * 2;
    line(c(u, y + 0.08, w), c(u + Math.cos(angle) * 0.1, y + 0.2, w + Math.sin(angle) * 0.1), INK.leaf);
  }
}

/** A monstera: long stems out of a wide pot, each carrying a broad leaf that
 *  tips down at its end. */
export function monstera(c: Place, u: number, w: number, { height = 0.42, radius = 0.24, leaves = 10, seed = 1 } = {}) {
  pot(c, u, w, radius, height);
  const r = chance(seed);
  for (let n = 0; n < leaves; n++) {
    const a = n * 2.4 + r() * 0.6;
    const reach = 0.22 + r() * 0.34;
    const rise = 0.42 + r() * 0.78;
    const du = Math.cos(a);
    const dw = Math.sin(a);
    curve((t) => c(u + du * reach * t, height + rise * Math.sin((t * Math.PI) / 2), w + dw * reach * t), 5, INK.leaf);
    const length = 0.3 + r() * 0.18;
    const wide = length * 0.78;
    const tip = 0.35 + r() * 0.35;
    const at = (s: number, across: number): V3 =>
      c(u + du * (reach + s * length) - dw * across, height + rise - tip * s * length - 0.08 * Math.abs(across), w + dw * (reach + s * length) + du * across);
    const side = (sign: number) => Array.from({ length: 9 }, (_, i) => {
      const s = i / 8;
      return at(s, sign * Math.sin(Math.PI * s ** 0.75) * (wide / 2) * (s < 0.12 ? 0.6 : 1));
    });
    polyline([...side(1), ...side(-1).reverse()], INK.leaf, true);
    line(at(0, 0), at(0.92, 0), LEAF_SOFT);
    // The splits, a few short cuts in from the edge.
    for (const s of [0.35, 0.6]) {
      for (const sign of [-1, 1]) {
        const edge = Math.sin(Math.PI * s ** 0.75) * (wide / 2);
        line(at(s, sign * edge), at(s + 0.06, sign * edge * 0.45), LEAF_SOFT);
      }
    }
  }
}

/** A snake plant: upright blades, each narrowing to its tip. */
export function snakePlant(c: Place, u: number, w: number, { height = 0.32, radius = 0.15, seed = 2 } = {}) {
  pot(c, u, w, radius, height);
  const r = chance(seed);
  for (let n = 0; n < 9; n++) {
    const a = n * 2.3 + r() * 0.5;
    const off = 0.02 + r() * 0.07;
    const bu = u + Math.cos(a) * off;
    const bw = w + Math.sin(a) * off;
    const tall = 0.45 + r() * 0.5;
    const lean = 0.03 + r() * 0.1;
    const half = 0.028 + r() * 0.016;
    const xu = -Math.sin(a);
    const xw = Math.cos(a);
    const at = (s: number, k: number): V3 => c(bu + Math.cos(a) * lean * s * s + xu * half * k, height + tall * s, bw + Math.sin(a) * lean * s * s + xw * half * k);
    polyline([at(0, 1), at(0.5, 1.15), at(0.85, 0.7), at(1, 0), at(0.85, -0.7), at(0.5, -1.15), at(0, -1)], INK.leaf);
  }
}

/** A tree in a planter: a slim trunk and a crown of small strokes, the way
 *  a leafy crown is drawn by hand. */
export function ficus(c: Place, u: number, w: number, { height = 0.5, radius = 0.26, crown = 0.5, top = 2.2, seed = 3 } = {}) {
  pot(c, u, w, radius, height);
  const r = chance(seed);
  const centre = top - crown * 0.85;
  for (let i = 0; i < 3; i++) {
    const phase = i * 2.1;
    curve((t) => c(u + Math.sin(t * 2.2 + phase) * 0.045 * t, height + t * (centre - height), w + Math.cos(t * 1.7 + phase) * 0.045 * t), 5, INK.detail);
  }
  for (let n = 0; n < 90; n++) {
    const y = r() * 2 - 1;
    const a = r() * Math.PI * 2;
    const s = Math.sqrt(1 - y * y) * (0.75 + r() * 0.25);
    const p: V3 = [u + s * Math.cos(a) * crown, centre + y * crown * 0.8, w + s * Math.sin(a) * crown];
    const d = [r() - 0.5, r() - 0.3, r() - 0.5];
    const k = 0.07 / (Math.hypot(d[0], d[1], d[2]) || 1);
    line(c(p[0], p[1], p[2]), c(p[0] + d[0] * k, p[1] + d[1] * k, p[2] + d[2] * k), n % 3 ? INK.leaf : LEAF_SOFT);
  }
}

/** A planter hung from the ceiling on three cords, its vines trailing. */
export function hangingPlant(c: Place, u: number, w: number, y: number, ceiling: number, seed = 4) {
  const r = chance(seed);
  const rim = ring(c, u, y, w, 0.15, 8);
  polyline(rim, INK.furniture, true);
  polyline(ring(c, u, y - 0.12, w, 0.09, 8), INK.furniture, true);
  for (let i = 0; i < 8; i += 3) line(rim[i], c(u, y + 0.5, w), INK.faint);
  line(c(u, y + 0.5, w), c(u, ceiling, w), INK.faint);
  for (let n = 0; n < 7; n++) {
    const a = (n / 7) * Math.PI * 2 + r();
    const drop = 0.35 + r() * 0.6;
    const out = 0.16 + r() * 0.1;
    const vine = (t: number): V3 => c(u + Math.cos(a) * (0.13 + out * Math.sin(t * 2)), y - drop * t * t, w + Math.sin(a) * (0.13 + out * Math.sin(t * 2)));
    curve(vine, 6, INK.leaf);
    for (let k = 1; k <= 3; k++) {
      const p = vine(k / 3.4);
      line(p, [p[0] + (r() - 0.5) * 0.08, p[1] - 0.04, p[2] + (r() - 0.5) * 0.08], LEAF_SOFT);
    }
  }
}

/** A long planter box of grasses, along u from `u0` to `u1`, `w` deep. */
export function grassBox(c: Place, u0: number, u1: number, w0: number, w1: number, height: number, seed = 5) {
  box(c, u0, u1, 0, height, w0, w1, INK.furniture, true);
  const r = chance(seed);
  const count = Math.round((u1 - u0) * 26);
  for (let n = 0; n < count; n++) {
    const bu = u0 + 0.05 + r() * (u1 - u0 - 0.1);
    const bw = w0 + 0.04 + r() * (w1 - w0 - 0.08);
    const tall = 0.25 + r() * 0.35;
    const lean = (r() - 0.5) * 0.24;
    curve((t) => c(bu + lean * t * t, height + tall * t, bw + lean * 0.4 * t * t), 3, n % 2 ? INK.leaf : LEAF_SOFT);
  }
}

/* ----------------------------------------------------------------------------
 * Shelves
 * ------------------------------------------------------------------------- */

/** Books along a shelf from `u0` to `u1` at height `y`, spines on the plane
 *  `w`, up to `room` tall: runs of them standing, one leaning at the end of
 *  a run, a stack lying down, now and then a vase or a box. */
export function books(c: Place, u0: number, u1: number, y: number, w: number, room: number, seed: number) {
  const r = chance(seed);
  let u = u0 + r() * 0.06;
  while (u < u1 - 0.06) {
    const kind = r();
    if (kind < 0.12) {
      const size = 0.12 + r() * 0.08;
      if (u + size > u1) break;
      if (r() < 0.55) cylinder(c, u + size / 2, w - 0.07, 0.04, y, y + Math.min(room - 0.04, 0.1 + r() * 0.1), INK.detail, { sides: 8, edges: 2 });
      else box(c, u, u + size, y, y + 0.08, w - 0.14, w, INK.detail);
      u += size + 0.03;
      continue;
    }
    if (kind < 0.24) {
      const width = 0.17 + r() * 0.07;
      if (u + width > u1) break;
      let h = y;
      const count = 2 + Math.floor(r() * 3);
      for (let i = 0; i < count; i++) {
        const t = 0.028 + r() * 0.02;
        const e = width - r() * 0.04;
        polyline([c(u, h, w), c(u, h + t, w), c(u + e, h + t, w), c(u + e, h, w)], INK.detail);
        h += t;
      }
      u += width + 0.03;
      continue;
    }
    const count = 3 + Math.floor(r() * 8);
    for (let i = 0; i < count && u < u1 - 0.04; i++) {
      const t = 0.022 + r() * 0.03;
      const h = Math.min(room - 0.03, 0.16 + r() * 0.12);
      polyline([c(u, y, w), c(u, y + h, w), c(u + t, y + h, w), c(u + t, y, w)], INK.detail);
      u += t;
    }
    if (r() < 0.4 && u < u1 - 0.14) {
      const h = Math.min(room - 0.05, 0.22);
      const lean = 0.32;
      const t = 0.026;
      polyline([
        c(u, y, w),
        c(u + Math.sin(lean) * h, y + Math.cos(lean) * h, w),
        c(u + Math.sin(lean) * h + t * Math.cos(lean), y + Math.cos(lean) * h - t * Math.sin(lean), w),
        c(u + t / Math.cos(lean), y, w),
      ], INK.detail);
      u += Math.sin(lean) * h + 0.05;
    }
    u += 0.02 + r() * 0.07;
  }
}

/** Open shelving against a wall at -w, its front to +w: the carcass, its
 *  shelves and bays, and what is on them. */
export function shelving(c: Place, u0: number, u1: number, height: number, depth: number, shelves: number, seed: number, { bays = 1, fill = 0.85, top = true } = {}) {
  box(c, u0, u1, 0, height, -depth, 0, INK.furniture);
  const step = height / shelves;
  for (let i = 1; i < shelves; i++) line(c(u0, i * step, 0), c(u1, i * step, 0), INK.furniture);
  for (let b = 1; b < bays; b++) {
    const u = u0 + ((u1 - u0) * b) / bays;
    line(c(u, 0, 0), c(u, height, 0), INK.furniture);
  }
  const rows = top ? shelves : shelves - 1;
  for (let i = 0; i < rows; i++) {
    for (let b = 0; b < bays; b++) {
      if (hash(seed * 31 + i * 7 + b) > fill) continue;
      const a = u0 + ((u1 - u0) * b) / bays + 0.03;
      const e = u0 + ((u1 - u0) * (b + 1)) / bays - 0.03;
      books(c, a, e, i * step + 0.02, -0.03, i === shelves - 1 && top ? 0.3 : step - 0.04, seed * 13 + i * 5 + b);
    }
  }
}

/* ----------------------------------------------------------------------------
 * Lounge
 * ------------------------------------------------------------------------- */

/** A sofa facing +w, `width` along u: the base on short legs, the back and
 *  arms, the seat cushions and the back cushions leaning on it, a pillow. */
export function sofa(c: Place, width: number, { depth = 0.92, seats = 3, pillow = true } = {}) {
  const hu = width / 2;
  const w0 = -depth / 2;
  const w1 = depth / 2;
  box(c, -hu, hu, 0.1, 0.4, w0, w1, INK.furniture, true);
  for (const [u, w] of [[-hu + 0.06, w0 + 0.06], [hu - 0.06, w0 + 0.06], [-hu + 0.06, w1 - 0.06], [hu - 0.06, w1 - 0.06]]) line(c(u, 0, w), c(u, 0.1, w), INK.detail);
  box(c, -hu, hu, 0.4, 0.84, w0, w0 + 0.2, INK.furniture, true);
  box(c, -hu, -hu + 0.18, 0.4, 0.62, w0 + 0.2, w1, INK.furniture, true);
  box(c, hu - 0.18, hu, 0.4, 0.62, w0 + 0.2, w1, INK.furniture, true);
  const inner = -hu + 0.18;
  const each = (width - 0.36) / seats;
  for (let i = 0; i < seats; i++) {
    const a = inner + i * each + 0.012;
    const b = a + each - 0.024;
    roundFlat(c, a, b, w0 + 0.22, w1 - 0.02, 0.5, 0.05, INK.detail);
    polyline([c(a, 0.5, w0 + 0.25), c(b, 0.5, w0 + 0.25), c(b, 0.88, w0 + 0.15), c(a, 0.88, w0 + 0.15)], INK.detail, true);
  }
  if (!pillow) return;
  const p = hu - 0.34;
  polyline([c(p - 0.18, 0.52, w0 + 0.34), c(p + 0.16, 0.52, w0 + 0.32), c(p + 0.15, 0.82, w0 + 0.27), c(p - 0.17, 0.8, w0 + 0.29)], INK.furniture, true);
}

/** An armchair facing +w. */
export function armchair(c: Place) {
  box(c, -0.42, 0.42, 0.08, 0.4, -0.4, 0.34, INK.furniture, true);
  box(c, -0.42, 0.42, 0.4, 0.84, -0.4, -0.26, INK.furniture, true);
  for (const s of [-1, 1]) box(c, s > 0 ? 0.34 : -0.42, s > 0 ? 0.42 : -0.34, 0.4, 0.6, -0.26, 0.3, INK.furniture);
  roundFlat(c, -0.33, 0.33, -0.25, 0.32, 0.47, 0.05, INK.detail);
  for (const [u, w] of [[-0.36, -0.34], [0.36, -0.34], [-0.36, 0.28], [0.36, 0.28]]) line(c(u, 0, w), c(u, 0.08, w), INK.detail);
}

/** A low round table, its top at `top`, on three legs; something on it. */
export function roundTable(c: Place, radius: number, top = 0.4) {
  polyline(ring(c, 0, top, 0, radius, 20), INK.furniture, true);
  polyline(ring(c, 0, top - 0.04, 0, radius, 20), INK.detail, true);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    line(c(Math.cos(a) * radius * 0.7, top - 0.04, Math.sin(a) * radius * 0.7), c(Math.cos(a) * radius * 0.78, 0, Math.sin(a) * radius * 0.78), INK.detail);
  }
  const face = ring(c, 0, top, 0, radius, 12);
  for (let i = 1; i < 11; i++) quad(face[0], face[i], face[i + 1], face[i + 1]);
}

/** A rug: its edge, the border woven into it, and the fringe at the ends. */
export function rug(c: Place, u0: number, u1: number, w0: number, w1: number) {
  flat(c, u0, u1, w0, w1, 0.004, INK.detail);
  flat(c, u0 + 0.12, u1 - 0.12, w0 + 0.12, w1 - 0.12, 0.004, INK.faint);
  for (let u = u0 + 0.05; u < u1 - 0.02; u += 0.07) {
    line(c(u, 0.004, w0), c(u, 0.004, w0 - 0.05), INK.faint);
    line(c(u, 0.004, w1), c(u, 0.004, w1 + 0.05), INK.faint);
  }
}

/** A floor lamp that arcs: a heavy foot, the stem rising and reaching over,
 *  the dome hung at its end. It reaches towards +w. */
export function arcLamp(c: Place) {
  box(c, -0.16, 0.16, 0, 0.05, -0.16, 0.16, INK.furniture);
  curve((t) => {
    const a = t * Math.PI * 0.62;
    return c(0, 0.05 + Math.sin(a) * 1.95, 1.25 - Math.cos(a) * 1.25);
  }, 12, INK.detail);
  const end = 1.25 - Math.cos(Math.PI * 0.62) * 1.25;
  const topY = 0.05 + Math.sin(Math.PI * 0.62) * 1.95;
  line(c(0, topY, end), c(0, topY - 0.12, end + 0.02), INK.detail);
  dome(c, 0, topY - 0.34, end + 0.02, 0.22);
}

/** A dome shade, its rim at `y`. */
export function dome(c: Place, u: number, y: number, w: number, radius: number) {
  const rim = ring(c, u, y, w, radius, 16);
  const mid = ring(c, u, y + radius * 0.5, w, radius * 0.8, 16);
  const top = ring(c, u, y + radius * 0.85, w, radius * 0.35, 16);
  polyline(rim, INK.furniture, true);
  polyline(mid, INK.detail, true);
  polyline(top, INK.detail, true);
  for (let i = 0; i < 16; i += 4) polyline([rim[i], mid[i], top[i]], INK.detail);
}

/** A pendant: the dome on its cord from the ceiling. */
export function pendant(c: Place, u: number, w: number, y: number, ceiling: number, radius = 0.24) {
  dome(c, u, y, w, radius);
  line(c(u, y + radius * 0.85, w), c(u, ceiling, w), INK.faint);
  polyline(ring(c, u, ceiling - 0.005, w, 0.05, 8), INK.detail, true);
}

/** A glass globe on its cord: three circles, one of them its equator. */
export function globe(c: Place, u: number, w: number, y: number, ceiling: number, radius = 0.15) {
  polyline(ring(c, u, y, w, radius, 16), INK.detail, true);
  for (const turn of [0, Math.PI / 2]) {
    curve((t) => {
      const a = t * Math.PI * 2;
      return c(u + Math.cos(a) * radius * Math.cos(turn), y + Math.sin(a) * radius, w + Math.cos(a) * radius * Math.sin(turn));
    }, 16, INK.detail, true);
  }
  line(c(u, y + radius, w), c(u, ceiling, w), INK.faint);
}

/** A long light hung on two cables over a table or a row of desks, along w. */
export function linearLight(c: Place, u: number, w0: number, w1: number, y: number, ceiling: number) {
  box(c, u - 0.04, u + 0.04, y, y + 0.05, w0, w1, INK.furniture);
  line(c(u, y - 0.002, w0 + 0.05), c(u, y - 0.002, w1 - 0.05), ink(WHITE, 0.2));
  for (const w of [w0 + 0.15, w1 - 0.15]) line(c(u, y + 0.05, w), c(u, ceiling, w), INK.faint);
}

/** A bar stool: its round seat, four splayed legs and the foot ring. */
export function barStool(c: Place, seat = 0.74) {
  polyline(ring(c, 0, seat, 0, 0.18, 14), INK.furniture, true);
  polyline(ring(c, 0, seat - 0.04, 0, 0.17, 14), INK.detail, true);
  const foot = ring(c, 0, 0.28, 0, 0.19, 12);
  polyline(foot, INK.detail, true);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    line(c(Math.cos(a) * 0.13, seat - 0.04, Math.sin(a) * 0.13), c(Math.cos(a) * 0.23, 0, Math.sin(a) * 0.23), INK.detail);
  }
  const face = ring(c, 0, seat, 0, 0.18, 10);
  for (let i = 1; i < 9; i++) quad(face[0], face[i], face[i + 1], face[i + 1]);
}

/** A metegol — table football — long along w: the box on four legs, the
 *  pitch and its circle, the goals, and the eight rods across it with
 *  their handles and players. */
export function metegol(c: Place) {
  const hu = 0.38;
  const hw = 0.62;
  box(c, -hu, hu, 0.66, 0.92, -hw, hw, INK.furniture, true);
  for (const [u, w] of [[-hu + 0.06, -hw + 0.06], [hu - 0.06, -hw + 0.06], [-hu + 0.06, hw - 0.06], [hu - 0.06, hw - 0.06]]) {
    box(c, u - 0.035, u + 0.035, 0, 0.66, w - 0.035, w + 0.035, INK.detail);
  }
  flat(c, -hu + 0.03, hu - 0.03, -hw + 0.03, hw - 0.03, 0.74, INK.faint);
  line(c(-hu + 0.03, 0.74, 0), c(hu - 0.03, 0.74, 0), INK.faint);
  polyline(ring(c, 0, 0.74, 0, 0.09, 12), INK.faint, true);
  for (const s of [-1, 1]) polyline([c(-0.1, 0.74, s * hw), c(-0.1, 0.84, s * hw), c(0.1, 0.84, s * hw), c(0.1, 0.74, s * hw)], INK.detail);
  // Goal to goal: keeper, defence, the other side's attack, midfield, the
  // other midfield, attack, the other defence, the other keeper — each
  // side's four handles out of its own side of the box.
  const rods = [-0.53, -0.39, -0.24, -0.08, 0.08, 0.24, 0.39, 0.53];
  const players = [1, 2, 3, 5, 5, 3, 2, 1];
  const sides = [1, 1, -1, 1, -1, 1, -1, -1];
  rods.forEach((w, i) => {
    const side = sides[i];
    line(c(-hu - (side < 0 ? 0.3 : 0.05), 0.86, w), c(hu + (side > 0 ? 0.3 : 0.05), 0.86, w), INK.detail);
    const grip = side > 0 ? hu + 0.2 : -hu - 0.3;
    box(c, grip, grip + 0.1, 0.84, 0.88, w - 0.018, w + 0.018, INK.detail);
    const count = players[i];
    for (let p = 0; p < count; p++) {
      const u = count === 1 ? 0 : -hu + 0.09 + (p * (2 * hu - 0.18)) / (count - 1);
      line(c(u, 0.76, w), c(u, 0.88, w), INK.detail);
    }
  });
}

/* ----------------------------------------------------------------------------
 * Kitchen
 * ------------------------------------------------------------------------- */

/** A kitchenette along u from 0 to `length`, against a wall at -w: the base
 *  units and their doors, the worktop, a sink, the coffee machine and its
 *  cups, and two open shelves of jars over it. */
export function kitchen(c: Place, length: number, seed = 6) {
  const depth = 0.62;
  box(c, 0, length, 0.1, 0.88, -depth, 0, INK.furniture, true);
  line(c(0, 0.1, -0.05), c(length, 0.1, -0.05), INK.detail);
  const doors = Math.max(1, Math.round(length / 0.6));
  for (let i = 1; i < doors; i++) line(c((i * length) / doors, 0.12, 0.001), c((i * length) / doors, 0.86, 0.001), INK.detail);
  for (let i = 0; i < doors; i++) {
    const u = ((i + 0.5) * length) / doors + (i % 2 ? -0.22 : 0.22);
    line(c(u, 0.62, 0.012), c(u, 0.78, 0.012), INK.detail);
  }
  box(c, -0.02, length + 0.02, 0.88, 0.92, -depth, 0.025, INK.furniture, true);
  // The sink and its tap.
  const sink = length * 0.32;
  flat(c, sink - 0.25, sink + 0.25, -0.5, -0.12, 0.921, INK.detail);
  curve((t) => {
    const a = t * Math.PI;
    return c(sink, 0.92 + Math.sin(a) * 0.26, -0.55 + (1 - Math.cos(a)) * 0.11);
  }, 8, INK.detail);
  // The coffee machine, its two heads, and cups by it.
  const m = length * 0.7;
  box(c, m - 0.24, m + 0.24, 0.92, 1.34, -0.58, -0.16, INK.furniture, true);
  for (const du of [-0.1, 0.1]) {
    line(c(m + du, 1.14, -0.15), c(m + du, 1.08, -0.1), INK.detail);
    polyline(ring(c, m + du, 0.935, -0.1, 0.035, 8), INK.detail, true);
  }
  flat(c, m - 0.2, m + 0.2, -0.16, -0.02, 0.93, INK.faint);
  for (let i = 0; i < 3; i++) mug(c, m + 0.36 + i * 0.1, -0.36, 0.92);
  // Two open shelves over it, jars and cups on them.
  const r = chance(seed);
  for (const y of [1.5, 1.86]) {
    box(c, 0.1, length - 0.1, y - 0.03, y, -0.3, 0, INK.furniture);
    for (let u = 0.25; u < length - 0.25; u += 0.14 + r() * 0.12) {
      if (r() < 0.25) continue;
      if (r() < 0.5) cylinder(c, u, -0.15, 0.05, y, y + 0.12 + r() * 0.06, INK.detail, { sides: 8, edges: 2 });
      else mug(c, u, -0.15, y);
    }
  }
}

/** A fridge, tall, its doors split and their handles, facing +w. */
export function fridge(c: Place, width = 0.7) {
  const hu = width / 2;
  box(c, -hu, hu, 0, 1.92, -0.68, 0, INK.furniture, true);
  line(c(-hu, 1.25, 0.002), c(hu, 1.25, 0.002), INK.detail);
  for (const [y0, y1] of [[0.85, 1.15], [1.35, 1.6]]) line(c(-hu + 0.08, y0, 0.03), c(-hu + 0.08, y1, 0.03), INK.detail);
}

/* ----------------------------------------------------------------------------
 * On the walls
 * ------------------------------------------------------------------------- */

/** A framed print: the frame, the mount inside it, and the art — an atlas
 *  region — or nothing. */
export function framed(s: Surface, u0: number, v0: number, u1: number, v1: number, region?: string, reveal?: Reveal) {
  rectOn(s, u0, v0, u1, v1, INK.frame);
  const m = Math.min(u1 - u0, v1 - v0) * 0.08;
  rectOn(s, u0 + m, v0 + m, u1 - m, v1 - m, INK.detail);
  if (region) panelOn(s, region, u0 + m * 1.35, v0 + m * 1.35, u1 - m * 1.35, v1 - m * 1.35, reveal);
}

/** A wall clock, its hands at ten past ten. */
export function clock(s: Surface, u: number, v: number, radius: number) {
  polyline(Array.from({ length: 24 }, (_, i) => s.at(u + Math.cos((i / 24) * Math.PI * 2) * radius, v + Math.sin((i / 24) * Math.PI * 2) * radius)), INK.frame, true);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    line(s.at(u + Math.cos(a) * radius * 0.82, v + Math.sin(a) * radius * 0.82), s.at(u + Math.cos(a) * radius * 0.92, v + Math.sin(a) * radius * 0.92), INK.detail);
  }
  const hand = (a: number, length: number) => line(s.at(u, v), s.at(u + Math.sin(a) * radius * length, v + Math.cos(a) * radius * length), INK.furniture);
  hand(((10 + 10 / 60) / 12) * Math.PI * 2, 0.55);
  hand((10 / 60) * Math.PI * 2, 0.8);
}
