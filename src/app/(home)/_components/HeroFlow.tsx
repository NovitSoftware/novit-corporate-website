"use client";

import { useRef } from "react";
import { iconGlyph, type IconName } from "@/components/ui/Icon";
import { gsap, motionConditions, useGSAP } from "@/lib/gsap";
import {
  AG_TOP,
  AG_Y,
  AGENTS,
  BASELINE_Y,
  CHART,
  CX,
  GUARD,
  HEX,
  HEX_MID,
  JOBS,
  PLATE,
  PROGRESS_R,
  QUEUE,
  REVIEW,
  REVIEW_Y,
  RINGS,
  ROUTES,
  SOURCES,
  SRC_TOP,
  SYS_TOP,
  SYSTEMS,
  VIEW,
  WIRES,
  chartPaths,
  laneWires,
  mountFlow,
  settledSeries,
} from "../_lib/hero-flow";

const GLYPH = 16;
const HEX_PATH = `M${HEX.left} ${HEX_MID} L${HEX.left + HEX.inset} ${HEX.top} H${HEX.right - HEX.inset} L${HEX.right} ${HEX_MID} L${HEX.right - HEX.inset} ${HEX.bottom} H${HEX.left + HEX.inset} Z`;
const settled = chartPaths(settledSeries());

/** The rail: each layer's name, level with it. */
const RAIL = [
  { label: "INTAKE", y: SRC_TOP + PLATE / 2 + 3.5 },
  { label: "ORCHESTRATOR", y: HEX_MID + 3.5 },
  { label: "AGENTS", y: AG_Y + 3.5 },
  { label: "GUARDRAILS", y: GUARD.top + PLATE / 2 + 3.5 },
  { label: "SYSTEMS", y: SYS_TOP + PLATE / 2 + 3.5 },
];

/**
 * The hero's ground: an agentic business process at work, and what it does
 * to throughput.
 *
 * Four channels feed a queue; an orchestrator hands each item to one of four
 * agents; guardrails check every result and pass the exceptions to a person;
 * the result lands in a system of record. Under it, throughput against the
 * baseline of one agent. It is drawn in the board's material — hairlines,
 * plates that are a film of white, celeste for what moves — and named the
 * way the board names its parts: a word per layer on a rail, in English, as
 * the field says them.
 *
 * Set beside the copy from `xl`; below that, under it, whole — and on a
 * phone without its words. The model is `hero-flow.ts`. Reduced motion, and no JavaScript,
 * get the drawing with every lane online and the chart already climbed.
 */
export function HeroFlow() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) {
        return;
      }
      const media = gsap.matchMedia();
      media.add(motionConditions, (context) =>
        mountFlow(root, Boolean(context.conditions?.motion), context),
      );
      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className="hero-flow">
      <svg viewBox={`-20 -8 ${VIEW.width + 40} ${VIEW.height + 16}`} className="hero-flow_art">
        <defs>
          <clipPath id="hero-flow-chart">
            <rect x={CHART.left} y={CHART.top - 12} width={CHART.right - CHART.left} height={CHART.bottom - CHART.top + 12} />
          </clipPath>
          <linearGradient id="hero-flow-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3db0e4" stopOpacity="0.28" />
            <stop offset="1" stopColor="#3db0e4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Object.entries(ROUTES).map(([name, d]) => (
          <path key={name} data-route={name} className="hero-flow_route" d={d} />
        ))}

        {WIRES.map((d) => (
          <path key={d} className="hero-flow_wire" d={d} />
        ))}

        {/* Each layer named on a rail, as the board names its own — down the
            right edge, since the left one is the headline's side. */}
        {RAIL.map(({ label, y }) => (
          <text key={label} className="hero-flow_text hero-flow_heading" x={VIEW.width + 12} y={y} textAnchor="end">
            {label}
          </text>
        ))}

        {/* Where work comes in. */}
        {SOURCES.map(({ x, icon }, index) => (
          <Plate key={index} glow={`src-${index}`} x={x - PLATE / 2} y={SRC_TOP} icon={icon} />
        ))}

        {/* The queue: what is waiting, head nearest the orchestrator. */}
        <rect
          className="hero-flow_draw hero-flow_queue"
          x={CX - QUEUE.width / 2}
          y={QUEUE.top}
          width={QUEUE.width}
          height={QUEUE.slots * QUEUE.pitch + 4}
          rx={QUEUE.width / 2}
        />

        {/* Who decides. */}
        <g className="hero-flow_plate">
          <path className="hero-flow_draw hero-flow_hex" d={HEX_PATH} />
          <path data-glow="hex" className="hero-flow_glow hero-flow_glow-hex" d={HEX_PATH} />
          {/* Off the spine, which the item being decided sits on. */}
          <Glyph name="spark" x={CX - 72} y={HEX_MID - 7} size={14} />
          <Glyph name="spark" x={CX + 58} y={HEX_MID - 7} size={14} />
        </g>

        {/* Who does it: four lanes, each dimmed while it is not online. */}
        {AGENTS.map((x, index) => (
          <g key={x} data-lane={index}>
            {laneWires(x).map((d) => (
              <path key={d} className="hero-flow_wire" d={d} />
            ))}
            <Plate glow={`ag-${index}`} x={x - PLATE / 2} y={AG_TOP} icon="agent" />
            <circle
              data-progress={index}
              className="hero-flow_progress"
              cx={x}
              cy={AG_Y}
              r={PROGRESS_R}
              transform={`rotate(-90 ${x} ${AG_Y})`}
            />
          </g>
        ))}

        {/* The checks, and the person the exceptions go to. */}
        <Plate glow="guard" x={GUARD.x - PLATE / 2} y={GUARD.top} icon="shield" />
        <Plate glow="review" x={REVIEW.x - PLATE / 2} y={REVIEW.top} icon="user" />
        <text className="hero-flow_text hero-flow_caption" x={REVIEW.x + PLATE / 2 + 8} y={REVIEW_Y + 3.5}>
          Human review
        </text>
        <circle
          data-review-progress=""
          className="hero-flow_progress"
          cx={REVIEW.x}
          cy={REVIEW_Y}
          r={PROGRESS_R}
          transform={`rotate(-90 ${REVIEW.x} ${REVIEW_Y})`}
        />

        {/* Where the result is written. */}
        {SYSTEMS.map(({ x, icon }, index) => (
          <Plate key={index} glow={`sys-${index}`} x={x - PLATE / 2} y={SYS_TOP} icon={icon} />
        ))}

        {/* Throughput, against one agent's. */}
        <g>
          <text className="hero-flow_text hero-flow_heading" x={CHART.left} y={CHART.top - 14}>
            THROUGHPUT
          </text>
          <path className="hero-flow_wire" d={`M${CHART.left} ${CHART.bottom} H${CHART.right}`} />
          <path className="hero-flow_baseline" d={`M${CHART.left} ${BASELINE_Y} H${CHART.right}`} />
          <text className="hero-flow_text hero-flow_caption" x={CHART.left} y={BASELINE_Y + 13}>
            1 agent
          </text>
          <g clipPath="url(#hero-flow-chart)">
            <path className="hero-flow_area" d={settled.area} />
            <path className="hero-flow_draw hero-flow_trend" d={settled.line} />
          </g>
          <circle className="hero-flow_head" cx={settled.head.x} cy={settled.head.y} r={3.5} />
        </g>

        {/* What moves: the items, and the ring each leaves where it lands. */}
        {Array.from({ length: RINGS }, (_, index) => (
          <circle key={`ring-${index}`} className="hero-flow_ring" r={0} />
        ))}
        {Array.from({ length: JOBS }, (_, index) => (
          <circle key={`job-${index}`} className="hero-flow_job" r={4} />
        ))}
      </svg>
    </div>
  );
}

/** An icon plate, as the board draws one, with the film that lights it. */
function Plate({ x, y, icon, glow }: { x: number; y: number; icon: IconName; glow: string }) {
  const inset = (PLATE - GLYPH) / 2;
  return (
    <g className="hero-flow_plate">
      <rect className="hero-flow_draw hero-flow_plate-edge" x={x + 0.5} y={y + 0.5} width={PLATE - 1} height={PLATE - 1} rx={9} />
      <rect data-glow={glow} className="hero-flow_glow" x={x + 0.5} y={y + 0.5} width={PLATE - 1} height={PLATE - 1} rx={9} />
      <Glyph name={icon} x={x + inset} y={y + inset} size={GLYPH} />
    </g>
  );
}

/** One of the site's icons, placed in the drawing's coordinates. */
function Glyph({ name, x, y, size }: { name: IconName; x: number; y: number; size: number }) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" overflow="visible" className="hero-flow_glyph">
      {iconGlyph(name)}
    </svg>
  );
}
