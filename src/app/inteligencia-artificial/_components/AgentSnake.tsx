"use client";

import { useId, useRef, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { agentSnake } from "@/content/inteligencia-artificial";
import { gsap, motionConditions, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { mountSnake } from "../_lib/snake-motion";

/** The arrow glyph points right; these turn it for left, right, up, down. */
const TURN = ["rotate-180", "", "-rotate-90", "rotate-90"] as const;
/** Entries the log keeps on screen; the pane shows as many as fit. */
const LOG_ROWS = 8;

/**
 * An agent at work, and its audit.
 *
 * The reference was a standalone demo — a snake played by a decision model,
 * with the model's four probabilities beside it, over a violet target. Here it
 * is drawn in the page's material and straight onto the page, with no panel
 * under it: celeste for what the agent does, white for the field and the
 * target, violet only on Novit's one remark. It thinks while it moves: at
 * each new target or change of plan its reasoning streams into the audit and
 * the route it is weighing draws itself ahead of it — faintly, too, any route
 * it turns down. Beside the game the audit is what an audit of it would
 * read: its confidence in each move and which were vetoed, its thinking, and
 * a log of what changed — the traceability the page promises.
 *
 * It plays in a loop and starts again when a game ends, at the pace the
 * speed control sets. The motion is `snake-motion.ts`; the policy is
 * `snake-sim.ts`. Reduced motion gets one still position with its audit.
 * Under `md` it is the ground behind the opener's copy — `OpenerFigure` —
 * and only the line plays, with no field and no audit.
 */
export function AgentSnake({ className }: { className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const copy = agentSnake;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) {
        return;
      }

      const media = gsap.matchMedia();
      media.add(
        {
          ...motionConditions,
          // The breakpoint `OpenerFigure` turns it into the ground at.
          compact: "(max-width: 47.99rem)",
        },
        (context) => {
          const { motion, compact } = context.conditions ?? {};
          return mountSnake(root, { motion: Boolean(motion), compact: Boolean(compact) });
        },
      );

      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <figure ref={ref} data-anim="card" className={cn("agent-snake", className)}>
      <div className="agent-snake_inner">
        <header className="agent-snake_header">
          <div>
            <p className="agent-snake_title">{copy.title}</p>
            <p className="agent-snake_subtitle">{copy.subtitle}</p>
          </div>
          <SpeedControl />
        </header>

        {/* The game and its audit change several times a second, so they
            are one image to assistive technology, described once, rather
            than a region that never stops talking. */}
        <div role="img" aria-label={copy.description} className="agent-snake_panes">
          <div>
            <PaneHeading label={copy.board.label}>
              {copy.board.game} <span data-snake-game>01</span>
            </PaneHeading>
            <div className="agent-snake_stage">
              <canvas className="agent-snake_canvas" />
            </div>
          </div>

          <div className="agent-snake_audit">
            <PaneHeading label={copy.audit.label}>
              {copy.audit.step} <span data-snake-step>000</span>
            </PaneHeading>

            <ul className="agent-snake_moves">
              {copy.moves.map((move, index) => (
                <li key={move} data-snake-move={index} className="agent-snake_move">
                  <span className="agent-snake_move-row">
                    <span className="agent-snake_move-label">
                      <Icon name="arrow" size="micro" className={TURN[index]} />
                      {move}
                    </span>
                    <span data-snake-value className="agent-snake_value">
                      0%
                    </span>
                  </span>
                  <span className="agent-snake_track">
                    <span data-snake-bar className="agent-snake_bar" />
                  </span>
                </li>
              ))}
            </ul>

            {/* Its thinking, the way a model's arrives: "Pensando" while it
                works it out, the words streaming in behind it, and once it
                has decided, what it weighed. */}
            <div data-snake-thinking className="agent-snake_thinking">
              <p className="agent-snake_thinking-head">
                <span className="agent-snake_heading">{copy.thinking.label}</span>
                <span className="agent-snake_status">
                  <span data-snake-status />
                  <span aria-hidden="true" className="agent-snake_dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </p>
              <p className="agent-snake_thought">
                <span data-snake-thought />
                <span aria-hidden="true" className="agent-snake_caret" />
              </p>
            </div>

            <div className="agent-snake_log">
              <p className="agent-snake_heading">{copy.audit.log}</p>
              <ol data-snake-log>
                {Array.from({ length: LOG_ROWS }, (_, index) => (
                  <li key={index} data-kind="">
                    <span className="agent-snake_log-step" />
                    <span className="agent-snake_log-label" />
                    <span className="agent-snake_log-detail" />
                  </li>
                ))}
              </ol>
            </div>

            <dl className="agent-snake_totals">
              <div>
                <dt>{copy.audit.captures}</dt>
                <dd data-snake-captures>00</dd>
              </div>
              <div>
                <dt>{copy.audit.avoided}</dt>
                <dd data-snake-avoided>00</dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="agent-snake_note">{copy.note}</p>
      </div>
    </figure>
  );
}

/**
 * How fast the game runs. Plain radios, so it is a keyboard control with no
 * script of its own; `snake-motion.ts` listens for the change. Shown only
 * where the game moves — see agent-snake.css.
 */
function SpeedControl() {
  const id = useId();
  const { speed } = agentSnake;

  return (
    <div data-snake-speed className="agent-snake_speed">
      <span id={`${id}-label`} className="agent-snake_heading">
        {speed.label}
      </span>
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="agent-snake_speed-options">
        {speed.options.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={`${id}-speed`}
              value={option.value}
              defaultChecked={option.value === speed.initial}
              className="sr-only"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PaneHeading({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="agent-snake_pane-heading">
      <span>{label}</span>
      <span className="agent-snake_meta">{children}</span>
    </p>
  );
}
