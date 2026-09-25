"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { FIELD, HUBS, lines, mountCurrents } from "../_lib/hero-currents";

/** A plate's size, in field units: the board's icon plate, empty. */
const PLATE = 16;

/**
 * The hero's ground: a handful of lines wired like the Academia's
 * architecture, and a signal finding its way through them.
 *
 * It is there to make the band read as alive before anyone looks at it, so
 * it is set well under the copy: hairlines of translucent white, plates that
 * are a film of it, one run of celeste light at a time, and a mask that
 * fades all of it out towards the headline and the foot of the band. On a
 * phone the same field shows only its right-hand edge, above the copy.
 *
 * The motion is `hero-currents.ts`. Reduced motion, and no JavaScript, get
 * the lines standing still.
 */
export function HeroCurrents() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) {
        return;
      }
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", (context) => mountCurrents(root, context));
      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className="hero-currents">
      <svg
        viewBox={`0 0 ${FIELD.width} ${FIELD.height}`}
        preserveAspectRatio="xMaxYMid slice"
        className="hero-currents_field"
      >
        {lines.map((line) => (
          <path key={line.name} data-line={line.name} className="hero-currents_line" d={line.d} />
        ))}
        {lines.map((line) => (
          <path key={line.name} data-line={line.name} className="hero-currents_trail" d={line.d} />
        ))}
        {Object.entries(HUBS).map(([name, [x, y]]) => (
          <g key={name}>
            <circle data-hub={name} className="hero-currents_pulse" cx={x} cy={y} r={7} />
            <rect
              className="hero-currents_hub"
              x={x - PLATE / 2}
              y={y - PLATE / 2}
              width={PLATE}
              height={PLATE}
              rx={5}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
