/*
 * What the rooms' walls, screens and laptops show, painted once with the 2D
 * canvas into one texture the renderer maps onto them.
 *
 * The layout is fixed and known before anything is painted, so the scene can
 * give each surface its place in the texture at build time. Everything is
 * painted on transparency — white and celeste ink only — so a screen is its
 * content and the band's gradient is still what is behind it.
 *
 * It is support, not the message: the words are set a step back from white
 * and the slogans a touch soft, so none of it competes with the headline.
 * The words are the brand's own — the slogans are lines of the manual
 * (`novit-design`, 1-marca.md) — and the charts carry no figures, because a
 * figure is only ever one from the official table.
 */

export const ATLAS_SIZE = 2048;

type Size = { name: string; w: number; h: number };

/** Every surface the atlas holds, by name, and its size in pixels. */
const SIZES: Size[] = [
  ...["dev", "lounge", "meeting"].map((room) => ({ name: `slogan-${room}`, w: 1600, h: 120 })),
  { name: "meeting-screen", w: 768, h: 384 },
  { name: "meeting-board", w: 768, h: 384 },
  ...[0, 1, 2].map((i) => ({ name: `monitor-${i}`, w: 448, h: 252 })),
  { name: "dev-tv", w: 448, h: 252 },
  { name: "lounge-tv", w: 448, h: 252 },
  { name: "status", w: 448, h: 252 },
  ...[0, 1, 2, 3].map((i) => ({ name: `laptop-${i}`, w: 256, h: 160 })),
];

export type Region = { x: number; y: number; w: number; h: number };

/** Shelf packing, tallest first: deterministic, so the scene and the painter
 *  always agree on where a surface is. */
export const REGIONS: Record<string, Region> = (() => {
  const regions: Record<string, Region> = {};
  const sorted = [...SIZES].sort((a, b) => b.h - a.h || b.w - a.w);
  const shelves: { y: number; h: number; x: number }[] = [];
  let top = 0;
  for (const { name, w, h } of sorted) {
    const shelf = shelves.find((s) => s.h >= h && s.x + w <= ATLAS_SIZE);
    if (shelf) {
      regions[name] = { x: shelf.x, y: shelf.y, w, h };
      shelf.x += w + 2;
    } else {
      if (top + h > ATLAS_SIZE) throw new Error("hero-office atlas: out of room");
      shelves.push({ y: top, h, x: w + 2 });
      regions[name] = { x: 0, y: top, w, h };
      top += h + 2;
    }
  }
  return regions;
})();

/** A region's texture coordinates, 0–1, flipped for GL's bottom-up rows. */
export function uv(name: string) {
  const r = REGIONS[name];
  return {
    u0: r.x / ATLAS_SIZE,
    u1: (r.x + r.w) / ATLAS_SIZE,
    v0: 1 - r.y / ATLAS_SIZE,
    v1: 1 - (r.y + r.h) / ATLAS_SIZE,
  };
}

/* ----------------------------------------------------------------------------
 * The words
 * ------------------------------------------------------------------------- */

/** The rooms that have a line on their far wall, and the line. */
export const SLOGANS: Record<"dev" | "lounge" | "meeting", string> = {
  dev: "Somos partners de transformación IA.",
  lounge: "Hacemos simple lo complejo.",
  meeting: "Software de calidad a una fracción del costo.",
};

/* ----------------------------------------------------------------------------
 * Painting
 * ------------------------------------------------------------------------- */

const INK = "rgba(255,255,255,0.8)";
const SOFT = "rgba(255,255,255,0.52)";
const FAINT = "rgba(255,255,255,0.12)";
const CELESTE = "rgba(61,176,228,0.9)";
const CELESTE_SOFT = "rgba(61,176,228,0.26)";

type Ctx = CanvasRenderingContext2D;

/** Paints every surface into `canvas`, in `family` (Lato, as the page loaded
 *  it). */
export function paintAtlas(canvas: HTMLCanvasElement, family: string) {
  canvas.width = ATLAS_SIZE;
  canvas.height = ATLAS_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);
  const font = (weight: number, size: number) => `${weight} ${size}px ${family}`;

  const inRegion = (name: string, paint: (w: number, h: number) => void) => {
    const r = REGIONS[name];
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    ctx.translate(r.x, r.y);
    paint(r.w, r.h);
    ctx.restore();
  };

  /* The slogans: one line of Lato Bold, a step back from white and a touch
     soft, as lettering on a wall across a room is. */
  for (const [room, value] of Object.entries(SLOGANS)) {
    inRegion(`slogan-${room}`, (w, h) => {
      let size = 92;
      ctx.font = font(700, size);
      while (ctx.measureText(value).width > w - 40 && size > 40) {
        size -= 2;
        ctx.font = font(700, size);
      }
      ctx.filter = "blur(1.2px)";
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(value, w / 2, h / 2 + 4);
      ctx.filter = "none";
    });
  }

  /* Development · the agents' monitors, and the team's productivity. */
  inRegion("monitor-0", (w) => {
    header(ctx, font, w, "Agentes en producción", true);
    const rows: [string, string][] = [
      ["Atención de clientes", "activo"],
      ["Conciliación bancaria", "activo"],
      ["Carga de facturas", "activo"],
      ["Seguimiento de pedidos", "en cola"],
    ];
    rows.forEach(([name, state], i) => {
      const y = 78 + i * 40;
      ctx.fillStyle = state === "activo" ? CELESTE : SOFT;
      ctx.beginPath();
      ctx.arc(26, y - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      text(ctx, font(400, 19), INK, name, 42, y);
      text(ctx, font(700, 15), state === "activo" ? CELESTE : SOFT, state, w - 20, y, "right");
      ctx.fillStyle = FAINT;
      ctx.fillRect(42, y + 10, w - 62, 3);
      ctx.fillStyle = CELESTE_SOFT;
      ctx.fillRect(42, y + 10, (w - 62) * [0.82, 0.64, 0.9, 0.3][i], 3);
    });
  });
  inRegion("monitor-1", (w, h) => {
    header(ctx, font, w, "Orquestador");
    const hub = { x: w / 2, y: 82 };
    const agents = [w * 0.2, w * 0.5, w * 0.8].map((x) => ({ x, y: 150 }));
    const tools = [w * 0.2, w * 0.5, w * 0.8].map((x) => ({ x, y: 212 }));
    ctx.strokeStyle = SOFT;
    ctx.lineWidth = 1.6;
    for (const a of agents) segment(ctx, hub.x, hub.y + 18, a.x, a.y - 16);
    agents.forEach((a, i) => segment(ctx, a.x, a.y + 16, tools[i].x, tools[i].y - 14));
    hexagon(ctx, hub.x, hub.y, 58, 22, CELESTE);
    text(ctx, font(700, 15), INK, "Orquestador", hub.x, hub.y + 5, "center");
    ["Conciliación", "Cobranzas", "Atención"].forEach((label, i) => {
      node(ctx, agents[i].x, agents[i].y, 110, 30, CELESTE);
      text(ctx, font(700, 14), INK, label, agents[i].x, agents[i].y + 5, "center");
    });
    ["ERP", "Banco", "CRM"].forEach((label, i) => {
      node(ctx, tools[i].x, tools[i].y, 76, 26, SOFT);
      text(ctx, font(400, 14), SOFT, label, tools[i].x, tools[i].y + 5, "center");
    });
    text(ctx, font(400, 13), SOFT, "Las excepciones van a revisión humana", w / 2, h - 10, "center");
  });
  inRegion("monitor-2", (w) => {
    header(ctx, font, w, "Registro del agente");
    const lines: [string, string, boolean][] = [
      ["plan", "conciliar los movimientos del día", false],
      ["herramienta", "banco.extracto", true],
      ["herramienta", "erp.facturas", true],
      ["cruce", "diferencias a revisión humana", false],
      ["listo", "conciliación cerrada", true],
    ];
    lines.forEach(([tag, body, done], i) => {
      const y = 74 + i * 34;
      text(ctx, font(700, 15), i === 4 ? CELESTE : SOFT, tag, 20, y);
      text(ctx, font(400, 16), INK, body, 140, y);
      if (done) tick(ctx, w - 30, y - 6, 1);
    });
  });
  inRegion("dev-tv", (w, h) => {
    barChart(ctx, font, w, h, "Productividad del equipo", "entregas por sprint", [0.28, 0.3, 0.34, 0.5, 0.62, 0.7, 0.8, 0.92], 3, "IA agéntica en el equipo");
  });

  /* The server room · what is deployed and how it runs. */
  inRegion("status", (w) => {
    header(ctx, font, w, "Deploy y monitoreo", true);
    [["API", "operativo"], ["Agentes", "operativo"], ["Base de datos", "operativo"], ["Último deploy", "sin incidentes"]].forEach(([name, state], i) => {
      const y = 82 + i * 36;
      ctx.fillStyle = CELESTE;
      ctx.beginPath();
      ctx.arc(26, y - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      text(ctx, font(400, 18), INK, name, 42, y);
      text(ctx, font(700, 14), CELESTE, state, w - 20, y, "right");
    });
    // A day of traffic, flat and even.
    const trace: [number, number][] = Array.from({ length: 24 }, (_, i) => [24 + (i * (w - 48)) / 23, 232 - 10 * Math.sin(i * 0.9) - 6 * Math.sin(i * 2.3)]);
    polyline(ctx, trace, CELESTE_SOFT, 2);
  });

  /* The lounge · the hours the AI gives back. */
  inRegion("lounge-tv", (w, h) => {
    barChart(ctx, font, w, h, "Horas en tareas repetitivas", "por mes", [0.9, 0.86, 0.7, 0.54, 0.42, 0.34], -1, "", ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]);
  });

  /* The meeting room · what a delivery costs, and the architecture. */
  inRegion("meeting-screen", (w, h) => {
    title(ctx, font, "Costo por entrega", 28, 44);
    legend(ctx, font, [["con IA agéntica", CELESTE, false], ["desarrollo tradicional", INK, true]], 28, 78);
    const chart = { x: 40, y: 104, w: w - 72, h: h - 164 };
    grid(ctx, chart, 4);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const step = chart.w / (months.length - 1);
    const at = (i: number, v: number): [number, number] => [chart.x + i * step, chart.y + chart.h * (1 - v)];
    ctx.setLineDash([8, 6]);
    polyline(ctx, months.map((_, i) => at(i, 0.8 + 0.02 * Math.sin(i))), SOFT, 2.2);
    ctx.setLineDash([]);
    const cost = [0.8, 0.79, 0.78, 0.7, 0.58, 0.5, 0.44, 0.4, 0.37, 0.35, 0.34, 0.33];
    const points = cost.map((v, i) => at(i, v));
    area(ctx, points, chart.y + chart.h);
    polyline(ctx, points, CELESTE, 3);
    months.forEach((m, i) => text(ctx, font(400, 13), SOFT, m, chart.x + i * step, chart.y + chart.h + 22, "center"));
    marker(ctx, font, chart.x + 3 * step, chart.y, chart.h, "IA en el ciclo");
  });
  inRegion("meeting-board", (w) => {
    title(ctx, font, "Arquitectura de la solución", 28, 44);
    const box = (label: string, x: number, y: number, bw: number, accent = false) => {
      node(ctx, x, y, bw, 30, accent ? CELESTE : SOFT);
      text(ctx, font(accent ? 700 : 400, 14), INK, label, x, y + 5, "center");
    };
    const cx = w * 0.43;
    const rows = { users: 88, apps: 136, api: 184, orch: 232, agents: 282, tools: 334 };
    ctx.strokeStyle = SOFT;
    ctx.lineWidth = 1.5;
    segment(ctx, cx, rows.users + 15, cx, rows.apps - 15);
    segment(ctx, cx - 90, rows.apps + 15, cx, rows.api - 15);
    segment(ctx, cx + 90, rows.apps + 15, cx, rows.api - 15);
    segment(ctx, cx, rows.api + 15, cx, rows.orch - 15);
    [-150, 0, 150].forEach((dx) => {
      segment(ctx, cx, rows.orch + 15, cx + dx, rows.agents - 15);
      segment(ctx, cx + dx, rows.agents + 15, cx + dx, rows.tools - 15);
    });
    box("Usuarios", cx, rows.users, 120);
    box("App web", cx - 90, rows.apps, 120);
    box("App móvil", cx + 90, rows.apps, 120);
    box("API", cx, rows.api, 110);
    box("Orquestador de agentes", cx, rows.orch, 230, true);
    box("Conciliación", cx - 150, rows.agents, 130, true);
    box("Cobranzas", cx, rows.agents, 130, true);
    box("Atención", cx + 150, rows.agents, 130, true);
    box("ERP", cx - 150, rows.tools, 100);
    box("CRM", cx, rows.tools, 100);
    box("Base de datos", cx + 150, rows.tools, 130);
    const side = w - 130;
    ["Seguridad por diseño", "Observabilidad"].forEach((label, i) => {
      const y = 150 + i * 110;
      ctx.strokeStyle = CELESTE;
      ctx.lineWidth = 1.5;
      roundRect(ctx, side - 90, y - 40, 180, 80, 6);
      ctx.stroke();
      text(ctx, font(700, 14), INK, label, side, y + 5, "center");
    });
  });

  /* The laptops: code, an agent's harness, a review, tests. */
  const laptops: ((w: number, h: number) => void)[] = [
    (w) => code(ctx, font, w, "conciliacion.ts", [
      ["export async function ", "conciliar", "(dia) {"],
      ["  const extracto = await ", "banco.extracto", "(dia);"],
      ["  const facturas = await ", "erp.facturas", "(dia);"],
      ["  return ", "agente.cruzar", "(extracto, facturas);"],
      ["}", "", ""],
    ]),
    (w) => {
      header(ctx, font, w, "agente · harness", false, 16);
      [["plan", true], ["herramienta: erp", true], ["herramienta: banco", true], ["resultado", false]].forEach(([label, done], i) => {
        const y = 62 + i * 24;
        ctx.fillStyle = done ? CELESTE : SOFT;
        ctx.beginPath();
        ctx.arc(18, y - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        text(ctx, font(400, 14), done ? INK : SOFT, String(label), 32, y);
      });
    },
    (w) => code(ctx, font, w, "revisión", [
      ["+ ", "validarStock", "(pedido);"],
      ["+ ", "if (!stock) ", "avisar(cliente);"],
      ["- ", "", "// validación manual"],
      ["+ ", "agente.aprobar", "(pedido);"],
    ]),
    (w) => {
      header(ctx, font, w, "pruebas", false, 16);
      ["integración", "unitarias", "seguridad", "regresión"].forEach((label, i) => {
        const y = 62 + i * 24;
        tick(ctx, 20, y - 5, 0.8);
        text(ctx, font(400, 14), INK, label, 36, y);
      });
    },
  ];
  laptops.forEach((paint, i) => inRegion(`laptop-${i}`, paint));
}

/* ----------------------------------------------------------------------------
 * Pieces
 * ------------------------------------------------------------------------- */

type Font = (weight: number, size: number) => string;

function text(ctx: Ctx, font: string, color: string, value: string, x: number, y: number, align: CanvasTextAlign = "left") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(value, x, y);
}

function title(ctx: Ctx, font: Font, value: string, x: number, y: number, size = 30) {
  text(ctx, font(700, size), "rgba(255,255,255,0.85)", value, x, y);
}

function header(ctx: Ctx, font: Font, w: number, value: string, live = false, size = 20) {
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(0, 0, w, size * 2);
  text(ctx, font(700, size), "rgba(255,255,255,0.8)", value, 16, size * 1.35);
  if (live) {
    ctx.fillStyle = CELESTE;
    ctx.beginPath();
    ctx.arc(w - 88, size * 0.95, 5, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, font(400, 15), SOFT, "en vivo", w - 16, size * 1.3, "right");
  }
}

function legend(ctx: Ctx, font: Font, items: [string, string, boolean][], x: number, y: number) {
  let at = x;
  for (const [label, color, dashed] of items) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.setLineDash(dashed ? [6, 5] : []);
    segment(ctx, at, y - 6, at + 30, y - 6);
    ctx.setLineDash([]);
    text(ctx, font(400, 16), SOFT, label, at + 40, y);
    ctx.font = font(400, 16);
    at += 40 + ctx.measureText(label).width + 32;
  }
}

function grid(ctx: Ctx, chart: { x: number; y: number; w: number; h: number }, lines: number) {
  ctx.strokeStyle = FAINT;
  ctx.lineWidth = 1;
  for (let i = 0; i <= lines; i++) {
    const y = chart.y + (chart.h * i) / lines;
    segment(ctx, chart.x, y, chart.x + chart.w, y);
  }
}

function marker(ctx: Ctx, font: Font, x: number, top: number, height: number, label: string) {
  ctx.strokeStyle = "rgba(61,176,228,0.7)";
  ctx.setLineDash([3, 5]);
  ctx.lineWidth = 1.5;
  segment(ctx, x, top - 4, x, top + height);
  ctx.setLineDash([]);
  text(ctx, font(700, 13), CELESTE, label, x + 8, top + 10);
}

function barChart(ctx: Ctx, font: Font, w: number, h: number, name: string, unit: string, values: number[], mark: number, markLabel: string, labels?: string[]) {
  title(ctx, font, name, 22, 36, 22);
  text(ctx, font(400, 14), SOFT, unit, 22, 58);
  const chart = { x: 26, y: 74, w: w - 46, h: h - 118 };
  grid(ctx, chart, 3);
  const bw = chart.w / values.length;
  values.forEach((v, i) => {
    ctx.fillStyle = mark < 0 || i >= mark ? CELESTE : CELESTE_SOFT;
    ctx.fillRect(chart.x + i * bw + bw * 0.22, chart.y + chart.h * (1 - v), bw * 0.56, chart.h * v);
    const label = labels ? labels[i] : `S${i + 1}`;
    text(ctx, font(400, 12), SOFT, label, chart.x + (i + 0.5) * bw, chart.y + chart.h + 18, "center");
  });
  if (mark >= 0 && markLabel) marker(ctx, font, chart.x + mark * bw, chart.y, chart.h, markLabel);
}

function code(ctx: Ctx, font: Font, w: number, file: string, rows: [string, string, string][]) {
  header(ctx, font, w, file, false, 16);
  rows.forEach(([a, b, c], i) => {
    const y = 60 + i * 22;
    let x = 12;
    for (const [part, color] of [[a, INK], [b, CELESTE], [c, SOFT]] as const) {
      ctx.font = font(400, 13);
      ctx.fillStyle = part.startsWith("+") ? CELESTE : part.startsWith("-") ? "rgba(255,255,255,0.4)" : color;
      ctx.textAlign = "left";
      ctx.fillText(part, x, y);
      x += ctx.measureText(part).width;
    }
  });
}

/** A drawn tick: Lato has no check mark, and a missing glyph falls back to
 *  another face without a word of warning. */
function tick(ctx: Ctx, x: number, y: number, scale: number) {
  ctx.strokeStyle = CELESTE;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x - 6 * scale, y);
  ctx.lineTo(x - 2 * scale, y + 4.5 * scale);
  ctx.lineTo(x + 6 * scale, y - 4.5 * scale);
  ctx.stroke();
}

function node(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 5);
  ctx.stroke();
}

function hexagon(ctx: Ctx, x: number, y: number, rx: number, ry: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - rx, y);
  ctx.lineTo(x - rx * 0.72, y - ry);
  ctx.lineTo(x + rx * 0.72, y - ry);
  ctx.lineTo(x + rx, y);
  ctx.lineTo(x + rx * 0.72, y + ry);
  ctx.lineTo(x - rx * 0.72, y + ry);
  ctx.closePath();
  ctx.stroke();
}

function segment(ctx: Ctx, x0: number, y0: number, x1: number, y1: number) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function polyline(ctx: Ctx, points: [number, number][], color: string, width: number) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
}

function area(ctx: Ctx, points: [number, number][], floor: number) {
  const gradient = ctx.createLinearGradient(0, Math.min(...points.map((p) => p[1])), 0, floor);
  gradient.addColorStop(0, "rgba(61,176,228,0.28)");
  gradient.addColorStop(1, "rgba(61,176,228,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.lineTo(points[points.length - 1][0], floor);
  ctx.lineTo(points[0][0], floor);
  ctx.closePath();
  ctx.fill();
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
