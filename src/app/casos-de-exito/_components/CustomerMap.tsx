"use client";

import { useRef } from "react";
import { customerCountries, customerHome } from "@/content/casos-de-exito";
import { withBasePath } from "@/lib/base-path";
import { gsap, motionConditions, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { ARGENTINA, CROP, WORLD, place, route } from "../_lib/map-geometry";
import { mountMap } from "../_lib/map-motion";

const points = customerCountries.map((country) => ({
  name: country.name,
  ...place(country.lat, country.lon),
}));

const origin = points.find((point) => point.name === customerHome);
if (!origin) throw new Error(`"${customerHome}" has no point on the customer map`);
const home = origin;

/** Every other country, with its route from home and the side its name goes
 *  on — the left for a neighbour beside home, so the two names never meet,
 *  and for a point near the right edge, so its name is not lost in the fade. */
const places = points
  .filter((point) => point !== home)
  .map((point) => ({
    ...point,
    route: route(home, point),
    left:
      (point.x < home.x && Math.abs(point.y - home.y) < 80) ||
      point.x > CROP.x + CROP.width * 0.8,
  }));

const label = `Clientes en ${new Intl.ListFormat("es", { type: "conjunction" }).format(
  customerCountries.map((country) => country.name),
)}, conectados desde ${customerHome}`;

/** The dot's radius, and how far round it the pointer counts as on it. */
const DOT = 7;
const REACH = 30;

/**
 * The map of where Novit's clients are, drawn from where Novit is.
 *
 * Argentina is drawn in over the world's outlines in celeste, and every other
 * client country hangs off it by a route. That is the one idea it moves on:
 * a signal leaves Buenos Aires, runs out along a route as a short run of
 * light and arrives with a ring, one country after the next — the same signal
 * the Academia's architecture carries requests with. Point at a country and
 * its route lights, its name shows, and the signal goes only there; point at
 * home and it goes everywhere at once. The motion is `map-motion.ts`.
 *
 * It belongs to `/casos-de-exito` alone: the band it opens is the one that
 * says who the clients are. No surface of its own — the outlines are set
 * straight on the gradient and fade out at the crop, so it reads as the
 * band's ground rather than a map widget. Reduced motion gets the finished
 * drawing, and pointing still lights a route; nothing travels.
 */
export function CustomerMap({ className }: { className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) {
        return;
      }

      const media = gsap.matchMedia();
      media.add(motionConditions, (context) =>
        mountMap(root, Boolean(context.conditions?.motion), context),
      );

      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <figure ref={ref} role="img" aria-label={label} className={cn("customer-map", className)}>
      <svg
        viewBox={`${CROP.x} ${CROP.y} ${CROP.width} ${CROP.height}`}
        aria-hidden="true"
        className="customer-map_art block aspect-[780/746] h-auto w-full"
      >
        <image
          href={withBasePath("/maps/world.svg")}
          x={WORLD.x}
          y={WORLD.y}
          width={WORLD.width}
          height={WORLD.height}
          className="customer-map_land"
        />
        <path className="customer-map_home-land" d={ARGENTINA} />

        {/* Under every point, so no route crosses a dot. */}
        <g>
          {places.map((point, index) => (
            <g key={point.name}>
              <path data-route={index} className="customer-map_route" d={point.route} />
              <path className="customer-map_trail" d={point.route} />
            </g>
          ))}
        </g>

        {places.map((point, index) => (
          <g key={point.name} data-place={index} className="customer-map_place">
            <circle className="customer-map_hit" cx={point.x} cy={point.y} r={REACH} />
            <circle className="customer-map_pulse" cx={point.x} cy={point.y} r={DOT} />
            <circle className="customer-map_dot" cx={point.x} cy={point.y} r={DOT} />
            <text
              className="customer-map_label"
              x={point.left ? point.x - 16 : point.x + 16}
              y={point.y + 6}
              textAnchor={point.left ? "end" : "start"}
            >
              {point.name.toLocaleUpperCase("es")}
            </text>
          </g>
        ))}

        <g data-home="" className="customer-map_place">
          <circle className="customer-map_hit" cx={home.x} cy={home.y} r={REACH} />
          <circle className="customer-map_pulse" cx={home.x} cy={home.y} r={DOT} />
          <circle className="customer-map_home" cx={home.x} cy={home.y} r={DOT} />
          <text className="customer-map_label" x={home.x + 16} y={home.y + 6}>
            {home.name.toLocaleUpperCase("es")}
          </text>
        </g>

        {places.map((point) => (
          <circle key={point.name} className="customer-map_signal" r={4.5} cx={home.x} cy={home.y} />
        ))}
      </svg>
    </figure>
  );
}
