"use client";

import { useRef, type ReactNode } from "react";
import { iconGlyph, type IconName } from "@/components/ui/Icon";
import { academyBoard } from "@/content/academianovit";
import { gsap, motionConditions, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { mountBoard } from "../_lib/board-motion";

/* The drawing's own grid, in viewBox units. At the width the opener gives it
   one unit is about one CSS pixel, so the type sizes in `board.css` are
   close to what is read. */
const WIDTH = 640;
/** The written title above the diagram. */
const HEADER = 72;
/** Air round the drawing, for the captions and rings at its edges. */
const MARGIN = 26;
/** An icon plate: the badge material, drawn. */
const PLATE = 30;
const HALF = PLATE / 2;
const GLYPH = 16;

/*
 * The board is drawn in layers, top to bottom, the way the work moves:
 * channels, the orchestrator, the agents and their model, and under the
 * model what it reaches — the client's systems and the knowledge base built
 * from them — with governance under all of it.
 *
 * The first three layers hang off one spine, so a request comes straight
 * down the middle: each channel ticks down to a bus, the bus down to the
 * orchestrator, the orchestrator down to a bus over the three agents. Every
 * link is square — a tick, a bus, a trunk — and meets a part at the middle
 * of a side.
 */
const CX = 380;
/** Where each layer's name is written: a rail down the left edge. */
const RAIL_X = 0;

/* Layer 1 · channels: a row, captions above the plates. */
const CH_TOP = 20;
const CH_PITCH = 124;
const chX = (index: number) => CX + (index - 1.5) * CH_PITCH;
const CH_BUS = CH_TOP + PLATE + 12;

/* Layer 2 · the orchestrator. Wide and low, so its two lines fit on one row
   each. */
const HEX = { left: CX - 116, right: CX + 116, top: CH_BUS + 12, bottom: CH_BUS + 68, inset: 24 };
const HEX_MID = (HEX.top + HEX.bottom) / 2;

/* Layer 3 · the agents, one team: a bus over the three, and across the foot
   of the group the model they reason with. The group is as wide as what hangs
   under the model, so the query, the context and the tool calls each leave
   it straight down. */
const AGENTS_BOX = { x: 136, right: 624, y: HEX.bottom + 16 };
const AG_BUS = AGENTS_BOX.y + 14;
const AG_TOP = AG_BUS + 12;
const AG_PITCH = 132;
const agX = (index: number) => CX + (index - 1) * AG_PITCH;
const LLM = { x: 146, right: 614, top: AG_TOP + PLATE + 26, bottom: AG_TOP + PLATE + 50 };
const LLM_Y = (LLM.top + LLM.bottom) / 2;
const AGENTS_BOTTOM = LLM.bottom + 10;

/* Layer 4 · what the model reaches. The systems on the left, their labels
   set against the plates so the bus can run down the plates' right; the RAG
   beside them, fed by that same bus — the ingest is one short arrow in. */
const BAND = AGENTS_BOTTOM + 30;
/** Where the flow labels between the model and layer 4 sit. */
const FLOW_LABEL_Y = (LLM.bottom + BAND) / 2 + 4;
const SYS_X = 112;
const SYS_PITCH = 36;
const sysTop = (index: number) => BAND + 22 + index * SYS_PITCH;
const sysY = (index: number) => sysTop(index) + HALF;
const SYS_EDGE = SYS_X + PLATE + 3;
const BUS_X = 158;

/*
 * The RAG in two lanes. Along the foot, the indexing: Documents → Chunking →
 * Embeddings → Vector store, white, done once and kept up to date. Above it,
 * what a request does: the query lands on the retriever, which looks it up
 * in the vector store under it (↕) and builds the context (→), and the
 * context goes back up to the model. The retriever sits right over the
 * store, and the two arrows to the model leave straight up from the
 * retriever and the context.
 */
const STEP_PITCH = 88;
const col = (index: number) => 244 + index * STEP_PITCH;
const TRAY = { x: 206, y: BAND };
/** The indexing lane, between the last two systems' ticks so the ingest
 *  reads as the bus's own, not one system's. */
const LOWER_Y = (sysY(2) + sysY(3)) / 2;
const LOWER_TOP = LOWER_Y - HALF;
const UPPER_TOP = BAND + 38;
const UPPER_Y = UPPER_TOP + HALF;
const TRAY_BOTTOM = LOWER_TOP + PLATE + 30;
/** Each step's place: its column, its lane, where its caption goes. */
const STEPS: readonly { x: number; top: number; caption: Caption }[] = [
  { x: col(0), top: LOWER_TOP, caption: "below" },
  { x: col(1), top: LOWER_TOP, caption: "below" },
  { x: col(2), top: LOWER_TOP, caption: "below" },
  { x: col(3), top: LOWER_TOP, caption: "below" },
  { x: col(3), top: UPPER_TOP, caption: "left" },
  { x: col(4), top: UPPER_TOP, caption: "below" },
];
const ASK_X = col(3);
const ANSWER_X = col(4);

/** Governance: five items across the foot of the board. */
const RULE_Y = TRAY_BOTTOM + 18;
const GOV_PITCH = 128;
const HEIGHT = RULE_Y + 40;

/**
 * The agent architecture, drawn straight onto the page.
 *
 * It was a whiteboard — first a picture of one, then a dark slate in a glass
 * frame on a stand — and either way it was an object standing in front of
 * the page. Now there is no surface under it: the lines, the plates and the
 * words are set on the scene gradient itself, in the customer map's material
 * — hairlines, translucent white, celeste for what moves — so the diagram is
 * part of the band rather than a panel placed on it. It is still drawn in
 * front of you, part by part, in the order it would be drawn in class.
 *
 * Then it keeps working, the way the customer map keeps sending: a request
 * comes down from each channel in turn, through the orchestrator to an agent,
 * into the RAG and back, and out to a system. Point at any part and the
 * diagram shows that part's route instead. The motion is `board-motion.ts`;
 * this is the drawing, with every part named for it.
 *
 * Under `md` it is the band's ground instead of a figure — `OpenerFigure`
 * sets it behind the copy, and board.css leaves only the lines, with a
 * request still travelling them. Reduced motion gets the finished drawing,
 * and hovering still lights a route; nothing travels. Without JavaScript it
 * is the finished drawing.
 */
export function AcademyBoard({ className }: { className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const board = academyBoard;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) {
        return;
      }

      const media = gsap.matchMedia();
      // At every width: on a phone it is the ground behind the copy, and a
      // request still crosses it there.
      media.add(motionConditions, (context) =>
        mountBoard(root, Boolean(context.conditions?.motion), context),
      );

      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <figure ref={ref} data-anim="card" className={cn("academy-board", className)}>
      <svg
        viewBox={`${-MARGIN} ${-MARGIN} ${WIDTH + 2 * MARGIN} ${HEADER + HEIGHT + 2 * MARGIN}`}
        role="img"
        aria-label={`${board.title}. ${board.description}`}
        className="academy-board_art block h-auto w-full"
      >
        <defs>
          {/* Uncovers the title left to right, the way it is written. */}
          <clipPath id="board-writing">
            <rect className="board-writing" x={-4} y={-4} width={700} height={HEADER} />
          </clipPath>
          {/* Novit's voice: cierre, from its violet end up to voz-suave. */}
          <linearGradient id="board-voice-bar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#85067b" />
            <stop offset="1" stopColor="#f1ebfb" />
          </linearGradient>
        </defs>

        {/* 0 · The title, written first, and underlined. */}
        <g data-board-step="title">
          <g clipPath="url(#board-writing)">
            <text className="board-title" x={0} y={20}>
              {board.title}
            </text>
            <text className="board-subtitle" x={0} y={48}>
              {board.subtitle}
            </text>
          </g>
          <path className="board-draw board-underline" d="M-2 31 C60 34 150 29 236 32" />
        </g>

        <g transform={`translate(0 ${HEADER})`}>
          {/* 1 · Where the work comes in. */}
          <g data-board-step="channels">
            <Heading x={RAIL_X} y={CH_TOP + HALF + 3.5}>
              {board.channels.label}
            </Heading>
            {board.channels.items.map((item, index) => (
              <Node
                key={item.label}
                part={`ch-${index}`}
                x={chX(index) - HALF}
                y={CH_TOP}
                icon={item.icon}
                caption="above"
                reach={96}
              >
                {item.label}
              </Node>
            ))}
          </g>

          {/* Each channel ticks down to one bus, and the bus comes down to
              the orchestrator; the answers go back up the same way. */}
          <g data-board-step="in">
            {board.channels.items.map((item, index) => (
              <g key={item.label} data-part={`in-${index}`}>
                <path
                  data-route={`in-${index}`}
                  className="board-draw board-link"
                  d={`M${chX(index)} ${CH_TOP + PLATE + 3} V${CH_BUS} H${CX} V${HEX.top - 3}`}
                />
                {/* Two-way: the answer goes back out the channel the
                    request came in by. */}
                <Arrowhead x={chX(index)} y={CH_TOP + PLATE + 1} up />
                <Arrowhead x={CX} y={HEX.top - 1} down />
              </g>
            ))}
          </g>

          {/* 2 · Who decides. */}
          <g data-board-step="orchestrator">
            <Heading x={RAIL_X} y={HEX_MID + 3.5}>
              {board.orchestrator.label}
            </Heading>
            <g data-part="hex" data-node="hex">
              <path
                className="board-draw board-fill board-hex"
                d={`M${HEX.left} ${HEX_MID} L${HEX.left + HEX.inset} ${HEX.top} H${HEX.right - HEX.inset} L${HEX.right} ${HEX_MID} L${HEX.right - HEX.inset} ${HEX.bottom} H${HEX.left + HEX.inset} Z`}
              />
              <Glyph name="spark" x={CX - 66} y={HEX_MID - 16} size={14} />
              <text className="board-text board-hex-title" x={CX + 9} y={HEX_MID - 4} textAnchor="middle">
                {board.orchestrator.title}
              </text>
              <text className="board-text board-detail" x={CX} y={HEX_MID + 14} textAnchor="middle">
                {board.orchestrator.detail.join(" ")}
              </text>
            </g>
          </g>

          {/* It hands the work down to the agents, and takes the results
              back up. */}
          <g data-board-step="out">
            {board.agents.items.map((item, index) => (
              <g key={item.label} data-part={`out-${index}`}>
                <path
                  data-route={`out-${index}`}
                  className="board-draw board-link board-link-accent"
                  d={`M${CX} ${HEX.bottom + 3} V${AG_BUS} H${agX(index)} V${AG_TOP - 3}`}
                />
                <Arrowhead x={agX(index)} y={AG_TOP - 1} accent down />
                {/* Two-way: each agent's result comes back to be merged. */}
                <Arrowhead x={CX} y={HEX.bottom + 1} accent up />
              </g>
            ))}
          </g>

          {/* 3 · Who does it: three agents, one team, one model. */}
          <g data-board-step="agents">
            <Heading x={RAIL_X} y={AG_TOP + HALF + 3.5}>
              {board.agents.label}
            </Heading>
            <rect
              data-part="agents"
              className="board-draw board-group"
              x={AGENTS_BOX.x}
              y={AGENTS_BOX.y}
              width={AGENTS_BOX.right - AGENTS_BOX.x}
              height={AGENTS_BOTTOM - AGENTS_BOX.y}
              rx={12}
            />
            {board.agents.items.map((item, index) => (
              <Node
                key={item.label}
                part={`ag-${index}`}
                x={agX(index) - HALF}
                y={AG_TOP}
                icon={item.icon}
                caption="below"
                reach={100}
              >
                {item.label}
              </Node>
            ))}
            <g data-part="llm" data-node="llm">
              <rect
                className="board-draw board-fill board-plate"
                x={LLM.x + 0.5}
                y={LLM.top + 0.5}
                width={LLM.right - LLM.x - 1}
                height={LLM.bottom - LLM.top - 1}
                rx={8}
              />
              <Glyph name="spark" x={CX - 46} y={LLM_Y - 8} size={GLYPH} />
              <text className="board-text board-label" x={CX - 22} y={LLM_Y + 4}>
                {board.agents.model.label}
                <tspan className="board-detail" dx={6}>
                  {board.agents.model.detail}
                </tspan>
              </text>
            </g>
          </g>

          {/* 4 · What they touch, both ways, down one bus. */}
          <g data-board-step="systems">
            <Heading x={RAIL_X} y={BAND + 10}>
              {board.systems.label}
            </Heading>
            {/* The model acting on the systems and hearing back — its own
                part, so indexing, which runs along the bus without it,
                does not light it. */}
            <g data-part="act">
              <path
                className="board-draw board-link board-link-accent"
                d={`M${BUS_X} ${LLM.bottom + 3} V${sysY(0)}`}
              />
              <Arrowhead x={BUS_X} y={LLM.bottom + 1} accent up />
              {/* What the link is: tool calls, executed by the agent. */}
              <text className="board-text board-flow-label" x={BUS_X + 8} y={FLOW_LABEL_Y}>
                {board.systems.via}
              </text>
            </g>
            <path
              data-part="bus"
              className="board-draw board-link"
              d={`M${BUS_X} ${sysY(0)} V${sysY(board.systems.items.length - 1)}`}
            />
            {board.systems.items.map((item, index) => (
              <g key={item.label}>
                <g data-part={`tick-${index}`}>
                  <path className="board-draw board-link" d={`M${BUS_X} ${sysY(index)} H${SYS_EDGE + 2}`} />
                  <Arrowhead x={SYS_EDGE} y={sysY(index)} flip />
                </g>
                {/* The way an action reaches this system: out of the model,
                    down the bus, in at its row — and the way this system's
                    data reaches the RAG. Never drawn. */}
                <path
                  data-route={`sys-${index}`}
                  className="board-route"
                  d={`M${BUS_X} ${LLM.bottom + 3} V${sysY(index)} H${SYS_EDGE + 1}`}
                />
                <path
                  data-route={`ingest-${index}`}
                  className="board-route"
                  d={`M${SYS_EDGE + 1} ${sysY(index)} H${BUS_X} V${LOWER_Y} H${col(0) - HALF - 4}`}
                />
                <Node
                  part={`sys-${index}`}
                  x={SYS_X}
                  y={sysTop(index)}
                  icon={item.icon}
                  caption="left"
                  reach={SYS_X + PLATE + 10}
                >
                  {item.label}
                </Node>
              </g>
            ))}
          </g>

          {/* 5 · What they know: asked for, handed back — straight down
              from the model and straight back up. */}
          <g data-board-step="rag-links">
            <g data-part="ask">
              <path
                data-route="ask"
                className="board-draw board-link board-link-accent"
                d={`M${ASK_X} ${LLM.bottom + 3} V${UPPER_TOP - 3}`}
              />
              <Arrowhead x={ASK_X} y={UPPER_TOP - 1} accent down />
              <text
                className="board-text board-flow-label"
                x={ASK_X - 8}
                y={FLOW_LABEL_Y}
                textAnchor="end"
              >
                {board.rag.ask}
              </text>
            </g>
            <g data-part="answer">
              <path
                data-route="answer"
                className="board-draw board-link board-link-accent"
                d={`M${ANSWER_X} ${UPPER_TOP - 2} V${LLM.bottom + 3}`}
              />
              <Arrowhead x={ANSWER_X} y={LLM.bottom + 1} accent up />
              <text
                className="board-text board-flow-label"
                x={ANSWER_X - 8}
                y={FLOW_LABEL_Y}
                textAnchor="end"
              >
                {board.rag.answer}
              </text>
            </g>
          </g>

          <g data-board-step="rag">
            <g data-part="rag" data-node="rag">
              <rect
                className="board-draw board-fill board-tray"
                x={TRAY.x}
                y={TRAY.y}
                width={WIDTH - TRAY.x - 0.5}
                height={TRAY_BOTTOM - TRAY.y}
                rx={14}
              />
              <text className="board-text board-tray-title" x={TRAY.x + 16} y={TRAY.y + 24}>
                {board.rag.label}
                <tspan className="board-detail" dx={6}>
                  · {board.rag.detail}
                </tspan>
              </text>
            </g>
            {/* The joins: the indexing along the foot, then the lookup up
                into the retriever and on to the context. */}
            {[1, 2, 3].map((index) => (
              <g key={index} data-part={`pipe-${index}`}>
                <path
                  data-route={`pipe-${index}`}
                  className="board-draw board-link"
                  d={`M${col(index - 1) + HALF + 8} ${LOWER_Y} H${col(index) - HALF - 10}`}
                />
                <Arrowhead x={col(index) - HALF - 7} y={LOWER_Y} />
              </g>
            ))}
            {/* The lookup goes both ways. */}
            <g data-part="pipe-4">
              <path
                data-route="pipe-4"
                className="board-draw board-link board-link-accent"
                d={`M${ASK_X} ${LOWER_TOP - 4} V${UPPER_TOP + PLATE + 4}`}
              />
              <Arrowhead x={ASK_X} y={UPPER_TOP + PLATE + 2} accent up />
              <Arrowhead x={ASK_X} y={LOWER_TOP - 2} accent down />
            </g>
            <g data-part="pipe-5">
              <path
                data-route="pipe-5"
                className="board-draw board-link board-link-accent"
                d={`M${ASK_X + HALF + 8} ${UPPER_Y} H${ANSWER_X - HALF - 10}`}
              />
              <Arrowhead x={ANSWER_X - HALF - 7} y={UPPER_Y} accent />
            </g>
            {board.rag.steps.map((step, index) => {
              const at = STEPS[index];
              return (
                <Node
                  key={step.label}
                  part={`rag-${index}`}
                  x={at.x - HALF}
                  y={at.top}
                  icon={step.icon}
                  caption={at.caption}
                  reach={at.caption === "left" ? 104 : 80}
                  text="board-caption"
                >
                  {step.label}
                </Node>
              );
            })}
          </g>

          {/* The client's systems feeding the knowledge base: off the bus,
              into Documents. */}
          <g data-board-step="ingest">
            <g data-part="ingest">
              <path
                className="board-draw board-link"
                d={`M${BUS_X} ${sysY(board.systems.items.length - 1)} V${LOWER_Y} H${col(0) - HALF - 5}`}
              />
              <Arrowhead x={col(0) - HALF - 3} y={LOWER_Y} />
              <text
                className="board-text board-flow-label board-flow-label-quiet"
                x={BUS_X + 8}
                y={LOWER_Y - 7}
              >
                {board.rag.ingest}
              </text>
            </g>
          </g>

          {/* Novit's two remarks, written on the board in its own voice. */}
          <g data-board-step="notes">
            <Note
              part="note-hex"
              x={HEX.right + 14}
              y={HEX_MID + 11 - (board.notes.orchestrator.length * 15) / 2}
              lines={board.notes.orchestrator}
            />
            {/* About the whole box — indexed once, read by every agent — so
                it stands in the box's free corner and points at no one step. */}
            <Note part="note-rag" x={TRAY.x + 16} y={TRAY.y + 50} lines={board.notes.rag} />
          </g>

          {/* 6 · The rules round all of it. */}
          <g data-board-step="governance">
            <path className="board-draw board-rule" d={`M0 ${RULE_Y} H${WIDTH}`} />
            {board.governance.map((item, index) => {
              const x = index * GOV_PITCH;
              return (
                <g key={item.label} data-part={`gov-${index}`} data-node={`gov-${index}`}>
                  <rect className="board-hit" x={x - 6} y={RULE_Y + 8} width={GOV_PITCH - 6} height={30} />
                  <Glyph name={item.icon} x={x} y={RULE_Y + 16} size={GLYPH} />
                  <text className="board-text board-label" x={x + 24} y={RULE_Y + 28}>
                    {item.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* What travels: a request, several at once where work fans
              out, and the ring each leaves where it arrives. */}
          {[0, 1, 2, 3].map((index) => (
            <circle key={`ring-${index}`} className="board-ring" r={4} cx={0} cy={0} />
          ))}
          {[0, 1, 2, 3].map((index) => (
            <circle key={`pulse-${index}`} className="board-pulse" r={4} cx={0} cy={0} />
          ))}
        </g>
      </svg>
    </figure>
  );
}

function Heading({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text className="board-text board-heading" x={x} y={y}>
      {children.toLocaleUpperCase("es")}
    </text>
  );
}

/** Where a part's name goes: on the side its links do not use. */
type Caption = "left" | "above" | "below";

/** An icon plate and its name: a part the pointer can ask about. */
function Node({
  part,
  x,
  y,
  icon,
  caption,
  reach,
  text = "board-label",
  children,
}: {
  part: string;
  /** The plate's top-left corner. */
  x: number;
  y: number;
  icon: IconName;
  caption: Caption;
  /** How wide the part answers the pointer, plate and name together. */
  reach: number;
  text?: string;
  children: ReactNode;
}) {
  const label = {
    left: { x: x - 10, y: y + HALF + 4, anchor: "end" as const },
    above: { x: x + HALF, y: y - 8, anchor: "middle" as const },
    below: { x: x + HALF, y: y + PLATE + 15, anchor: "middle" as const },
  }[caption];
  const hit = {
    left: { x: x + PLATE + 5 - reach, y: y - 5, height: PLATE + 10 },
    above: { x: x + HALF - reach / 2, y: y - 22, height: PLATE + 27 },
    below: { x: x + HALF - reach / 2, y: y - 5, height: PLATE + 27 },
  }[caption];
  return (
    <g data-part={part} data-node={part}>
      <rect className="board-hit" x={hit.x} y={hit.y} width={reach} height={hit.height} />
      <Plate x={x} y={y} icon={icon} />
      <text className={cn("board-text", text)} x={label.x} y={label.y} textAnchor={label.anchor}>
        {children}
      </text>
    </g>
  );
}

function Plate({ x, y, icon }: { x: number; y: number; icon: IconName }) {
  const inset = (PLATE - GLYPH) / 2;
  return (
    <g>
      <rect
        className="board-draw board-fill board-plate"
        x={x + 0.5}
        y={y + 0.5}
        width={PLATE - 1}
        height={PLATE - 1}
        rx={9}
      />
      <Glyph name={icon} x={x + inset} y={y + inset} size={GLYPH} />
    </g>
  );
}

/** One of the site's icons, placed in the board's coordinates. */
function Glyph({ name, x, y, size }: { name: IconName; x: number; y: number; size: number }) {
  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      overflow="visible"
      className="board-glyph"
    >
      {iconGlyph(name)}
    </svg>
  );
}

function Arrowhead({
  x,
  y,
  accent = false,
  flip = false,
  up = false,
  down = false,
}: {
  x: number;
  y: number;
  accent?: boolean;
  flip?: boolean;
  up?: boolean;
  down?: boolean;
}) {
  const rotate = flip ? 180 : up ? -90 : down ? 90 : 0;
  return (
    <path
      className={cn("board-draw board-link", accent && "board-link-accent")}
      d="M-5 -4 L0 0 L-5 4"
      transform={`translate(${x} ${y}) rotate(${rotate})`}
    />
  );
}

/**
 * Novit's remark, as a teacher writes one beside the drawing: a violet bar
 * for whose voice it is, the words in voz-suave, and — when it is about one
 * part — an arrow to it. Not a box: nothing else on the board is written in
 * a box.
 */
function Note({
  part,
  x,
  y,
  lines,
  arrow,
  head,
}: {
  part: string;
  x: number;
  /** Baseline of the first line. */
  y: number;
  lines: readonly string[];
  /** The arrow to what the note is about, when it is about one thing. */
  arrow?: string;
  head?: string;
}) {
  const leading = 15;
  return (
    <g className="board-note" data-part={part}>
      {arrow && head ? (
        <>
          <path className="board-draw board-note_arrow" d={arrow} />
          <path className="board-draw board-note_arrow" d={head} />
        </>
      ) : null}
      <rect
        className="board-note_bar"
        x={x}
        y={y - 11}
        width={3}
        height={(lines.length - 1) * leading + 15}
        rx={1.5}
      />
      {lines.map((line, index) => (
        <text key={line} className="board-note_text" x={x + 11} y={y + index * leading}>
          {line}
        </text>
      ))}
    </g>
  );
}
